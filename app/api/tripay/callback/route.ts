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

    // Log all incoming headers for debugging
    const incomingSignature = req.headers.get('x-callback-signature')
      || req.headers.get('signature')
      || req.headers.get('x-signature');

    console.log('[Webhook] Headers:', Object.fromEntries(req.headers.entries()));
    console.log('[Webhook] Raw body preview:', rawBody.substring(0, 300));

    let payload: any;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      console.error('[Webhook] Invalid JSON body');
      return NextResponse.json({ success: false, message: 'Invalid JSON' }, { status: 400 });
    }

    console.log('[Webhook] Received status:', payload.status, '| reference:', payload.reference);

    // Fetch gateway config
    const { data: gatewaySettings } = await supabase
      .from('payment_gateway')
      .select('*')
      .limit(1)
      .single();

    if (!gatewaySettings) {
      console.error('[Webhook] No gateway settings found in DB');
      return NextResponse.json({ success: false, message: 'Gateway not configured' }, { status: 500 });
    }

    // Support both socialbooster_config (new) and tripay_config (old)
    const config = gatewaySettings.socialbooster_config || gatewaySettings.tripay_config;
    if (!config) {
      console.error('[Webhook] No socialbooster_config or tripay_config found');
      return NextResponse.json({ success: false, message: 'Gateway config missing' }, { status: 500 });
    }

    // kode_api: support new (kode_api) and old (private_key / privateKey) field names
    const kodeApi = config.kode_api || config.private_key || config.privateKey;
    if (!kodeApi) {
      console.error('[Webhook] kode_api not found in config:', config);
      return NextResponse.json({ success: false, message: 'kode_api not configured' }, { status: 500 });
    }

    // Verify signature — HMAC-SHA256 of JSON({reference, merchant_ref, status})
    const expectedSignature = crypto
      .createHmac('sha256', kodeApi)
      .update(JSON.stringify({
        reference: payload.reference,
        merchant_ref: payload.merchant_ref,
        status: payload.status,
      }))
      .digest('hex');

    console.log('[Webhook] Expected signature:', expectedSignature);
    console.log('[Webhook] Incoming signature:', incomingSignature);

    if (incomingSignature) {
      const sigBuffer = Buffer.from(incomingSignature, 'hex');
      const expBuffer = Buffer.from(expectedSignature, 'hex');
      const isValid = sigBuffer.length === expBuffer.length &&
        crypto.timingSafeEqual(sigBuffer, expBuffer);

      if (!isValid) {
        console.error('[Webhook] Signature mismatch — rejecting');
        return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 400 });
      }
      console.log('[Webhook] Signature verified OK');
    } else {
      // No signature header — log warning but still process (for testing)
      console.warn('[Webhook] No signature header received — proceeding without verification');
    }

    // ── PAID ──────────────────────────────────────────────────────────────────
    if (payload.status === 'PAID') {
      const reference = payload.reference;

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

      if (historyError) {
        console.error('[Webhook] Supabase error fetching history:', historyError);
      }

      if (history && history.status_payment !== 'Success') {
        console.log('[Webhook] Updating history to Success for', reference);

        await supabase.from('membership_history')
          .update({ status_payment: 'Success' })
          .eq('id', history.id);

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
        console.log('[Webhook] User email:', userEmail);

        if (userEmail && userEmail.startsWith('telegram_')) {
          const chatId = userEmail.split('@')[0].replace('telegram_', '');
          console.log('[Webhook] Sending success notification to chatId:', chatId);
          await sendTelegramMessage(
            chatId,
            `✅ *Payment Successful!* 🎉\n\nYour payment for the *${plan?.name}* plan has been confirmed.\n\nReference: \`${reference}\`\n\nYour membership is now *VIP* until *${endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}*.\n\nEnjoy Vidplus! 🎬`
          );
        }
      } else if (history?.status_payment === 'Success') {
        console.log('[Webhook] Already processed:', reference);
      } else {
        console.warn('[Webhook] No history found for reference:', reference);
      }

    // ── EXPIRED / FAILED ───────────────────────────────────────────────────────
    } else if (payload.status === 'EXPIRED' || payload.status === 'FAILED') {
      const reference = payload.reference;
      const { data: history, error: historyError } = await supabase
        .from('membership_history')
        .select('id, status_payment, users (email)')
        .eq('invoice', reference)
        .single();

      if (historyError) {
        console.error('[Webhook] Supabase error fetching history (failed/expired):', historyError);
      }

      if (history && history.status_payment !== 'Expired') {
        await supabase.from('membership_history')
          .update({ status_payment: 'Expired' })
          .eq('id', history.id);

        const userEmail = (history.users as any)?.email;
        if (userEmail && userEmail.startsWith('telegram_')) {
          const chatId = userEmail.split('@')[0].replace('telegram_', '');
          console.log('[Webhook] Sending expired notification to chatId:', chatId);
          await sendTelegramMessage(
            chatId,
            `❌ *Payment ${payload.status === 'FAILED' ? 'Failed' : 'Expired'}*\n\nYour transaction with reference \`${reference}\` has ${payload.status === 'FAILED' ? 'failed' : 'expired'}.\n\nPlease use /plan to start a new transaction.`
          );
        }
      }

    } else {
      console.log('[Webhook] Unhandled status:', payload.status);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[Webhook] Unexpected error:', err);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
