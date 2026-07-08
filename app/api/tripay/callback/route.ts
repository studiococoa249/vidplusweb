import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/utils/supabase';

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
    const signature = req.headers.get('x-callback-signature');

    const { data: gatewaySettings } = await supabase
      .from('payment_gateway')
      .select('*')
      .limit(1)
      .single();

    if (!gatewaySettings || !gatewaySettings.tripay_config) {
      return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 500 });
    }

    // Parse body first to get fields for signature verification
    const payload = JSON.parse(rawBody);

    // Verify signature sesuai format custom API:
    // HMAC-SHA256 dari JSON({reference, merchant_ref, status}) menggunakan kode_api (private_key)
    const kodeApi = gatewaySettings.tripay_config.private_key;
    const expectedSignature = crypto
      .createHmac('sha256', kodeApi)
      .update(JSON.stringify({
        reference: payload.reference,
        merchant_ref: payload.merchant_ref,
        status: payload.status,
      }))
      .digest('hex');

    const sigBuffer = Buffer.from(signature || '', 'hex');
    const expBuffer = Buffer.from(expectedSignature, 'hex');
    const isValidSignature = sigBuffer.length === expBuffer.length &&
      crypto.timingSafeEqual(sigBuffer, expBuffer);

    if (!isValidSignature) {
      console.error('Invalid webhook signature');
      return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
    }

    console.log('Tripay Webhook Received:', payload.status, payload.reference);

    // Only process when payment is PAID
    if (payload.status === 'PAID') {
      const reference = payload.reference;
      
      // Get membership history
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
         // Update history status
         await supabase.from('membership_history').update({ status_payment: 'Success' }).eq('id', history.id);

         // Calculate membership dates
         const plan: any = history.plan_membership;
         const durationDays = plan?.duration || 30;
         
         const startDate = new Date();
         const endDate = new Date();
         endDate.setDate(startDate.getDate() + durationDays);

         // Update user to VIP
         await supabase.from('users').update({
           membership: 'VIP',
           start_membership: startDate.toISOString(),
           end_membership: endDate.toISOString()
         }).eq('id', history.id_users);

         // Send telegram notification if email format matches our bot's dummy email
         const userEmail = (history.users as any)?.email;
         if (userEmail && userEmail.startsWith('telegram_')) {
            const chatId = userEmail.split('@')[0].replace('telegram_', '');
            console.log("Sending Telegram message to", chatId);
            await sendTelegramMessage(
              chatId, 
              `✅ **Payment Successful!** 🎉\n\nThank you, your payment for the **${plan.name}** plan (Reference: \`${reference}\`) has been received.\n\nYour membership status is now **VIP** until ${endDate.toLocaleDateString('en-US')}. Enjoy!`
            );
         } else {
            console.log("Email does not match telegram format:", userEmail);
         }
      }
    } else if (payload.status === 'EXPIRED' || payload.status === 'FAILED') {
      const reference = payload.reference;
      const { data: history, error: historyError } = await supabase.from('membership_history').select('id, users (email)').eq('invoice', reference).single();
      
      if (historyError) console.error("Supabase Error fetching history (failed/expired):", historyError);
      if (history) {
        await supabase.from('membership_history').update({ status_payment: 'Expired' }).eq('id', history.id);
        
        const userEmail = (history.users as any)?.email;
        if (userEmail && userEmail.startsWith('telegram_')) {
          const chatId = userEmail.split('@')[0].replace('telegram_', '');
          await sendTelegramMessage(chatId, `❌ **Payment Cancelled / Expired**\n\nTransaction with reference \`${reference}\` has been cancelled or has expired.`);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Tripay Callback Error:", err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
