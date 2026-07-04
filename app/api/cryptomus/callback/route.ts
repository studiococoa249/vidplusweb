import { NextResponse } from 'next/server';
import { supabase } from '@/utils/supabase';
import { verifyCryptomusSignature } from '@/lib/cryptomus';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

async function sendTelegramMessage(chatId: string | number, text: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: text, parse_mode: "Markdown" }),
    });
  } catch (error) {
    console.error("Failed to send message to Telegram:", error);
  }
}

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const payload = JSON.parse(rawBody);

    const { data: gatewaySettings } = await supabase
      .from('payment_gateway')
      .select('*')
      .limit(1)
      .single();

    if (!gatewaySettings || !gatewaySettings.cryptomus_config) {
      return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 500 });
    }

    const paymentKey = gatewaySettings.cryptomus_config.paymentKey;
    const providedSign = payload.sign;

    if (!providedSign || !verifyCryptomusSignature(payload, paymentKey, providedSign)) {
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    // Cryptomus statuses: 'paid', 'paid_over', 'wrong_amount', 'wrong_amount_waiting', 'host_unreachable', 'system_fail', 'refund_process', 'refund_fail', 'refund_paid', 'locked', 'check', 'fail', 'cancel'
    const reference = payload.order_id;
    console.log("Cryptomus Webhook Received:", payload.status, reference);

    if (payload.status === 'paid' || payload.status === 'paid_over') {
      const { data: history, error: historyError } = await supabase
        .from('membership_history')
        .select(`
          id,
          id_plan_membership,
          id_users,
          status_payment,
          plan_membership ( duration, name ),
          users ( id, email )
        `)
        .eq('invoice', reference)
        .single();

      if (historyError) console.error("Supabase Error fetching history:", historyError);

      if (history && history.status_payment !== 'Success') {
         console.log("Updating history to Success for", reference);
         await supabase.from('membership_history').update({ status_payment: 'Success' }).eq('id', history.id);

         const plan: any = history.plan_membership;
         const durationDays = plan?.duration || 30;
         
         const startDate = new Date();
         const endDate = new Date();
         endDate.setDate(startDate.getDate() + durationDays);

         await supabase.from('users').update({
           membership: 'VIP',
           start_membership: startDate.toISOString(),
           end_membership: endDate.toISOString()
         }).eq('id', history.id_users);

         const userEmail = (history.users as any)?.email;
         if (userEmail && userEmail.startsWith('telegram_')) {
            const chatId = userEmail.split('@')[0].replace('telegram_', '');
            console.log("Sending Telegram message to", chatId);
            await sendTelegramMessage(
              chatId, 
              `✅ **Crypto Payment Successful!** 🎉\n\nThank you, your payment for the **${plan.name}** plan (Reference: \`${reference}\`) has been received.\n\nYour membership status is now **VIP** until ${endDate.toLocaleDateString('en-US')}. Enjoy!`
            );
         }
      }
    } else if (payload.status === 'fail' || payload.status === 'cancel') {
      const { data: history, error: historyError } = await supabase.from('membership_history').select('id, users (email)').eq('invoice', reference).single();
      
      if (historyError) console.error("Supabase Error fetching history (failed/expired):", historyError);
      
      if (history) {
        await supabase.from('membership_history').update({ status_payment: 'Expired' }).eq('id', history.id);
        
        const userEmail = (history.users as any)?.email;
        if (userEmail && userEmail.startsWith('telegram_')) {
          const chatId = userEmail.split('@')[0].replace('telegram_', '');
          await sendTelegramMessage(chatId, `❌ **Crypto Payment Cancelled / Failed**\n\nTransaction with reference \`${reference}\` has failed or was cancelled.`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Cryptomus Callback Error:", err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
