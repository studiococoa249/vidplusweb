import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createClosedTransaction, getPaymentChannels, getTransactionDetail, TransactionPayload } from "@/lib/tripay";
import { createCryptomusTransaction, CryptomusPayload } from "@/lib/cryptomus";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;
const VIP_MINI_APP_URL =
  process.env.TELEGRAM_MINI_APP_URL || "https://vip-vidplus.vercel.app/auth";

function telegramEmail(chatId: number) {
  return `telegram_${chatId}@vidplus.local`;
}

function buildMiniAppUrl(userToken: string) {
  return `${VIP_MINI_APP_URL}?${encodeURIComponent(userToken)}`;
}

function miniAppReplyMarkup(userToken: string) {
  return {
    inline_keyboard: [
      [
        {
          text: "🎬 Open Vidplus VIP",
          web_app: { url: buildMiniAppUrl(userToken) },
        },
      ],
    ],
  };
}

async function getTelegramUser(chatId: number) {
  const { data: user } = await supabase
    .from("users")
    .select("id, full_name, email, user_token")
    .eq("email", telegramEmail(chatId))
    .single();
  return user;
}

async function sendMiniAppAccess(chatId: number, introText: string) {
  const user = await getTelegramUser(chatId);
  if (!user?.user_token) {
    await sendMessage(
      chatId,
      "You are not registered yet. Type /register to create your account."
    );
    return;
  }

  await sendMessage(chatId, introText, miniAppReplyMarkup(user.user_token));
}

async function sendMessage(chatId: number, text: string, replyMarkup?: any) {
  if (!TELEGRAM_BOT_TOKEN) {
    console.error("TELEGRAM_BOT_TOKEN is not set.");
    return;
  }
  try {
    const body: any = {
      chat_id: chatId,
      text: text,
      parse_mode: "Markdown",
    };
    if (replyMarkup) {
      body.reply_markup = replyMarkup;
    }

    await fetch(`${TELEGRAM_API_URL}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("Failed to send message to Telegram:", error);
  }
}

async function sendPhoto(chatId: number, photoUrl: string, caption?: string) {
  if (!TELEGRAM_BOT_TOKEN) return;
  try {
    await fetch(`${TELEGRAM_API_URL}/sendPhoto`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        photo: photoUrl,
        caption: caption,
        parse_mode: "Markdown",
      }),
    });
  } catch (error) {
    console.error("Failed to send photo to Telegram:", error);
  }
}

export async function POST(req: Request) {
  try {
    const update = await req.json();

    // Handle Callback Queries (Inline Button Taps)
    if (update.callback_query) {
      const callbackQuery = update.callback_query;
      const data = callbackQuery.data;
      const chatId = callbackQuery.message.chat.id;

      // Acknowledge the callback query to remove loading state on the button
      await fetch(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackQuery.id }),
      }).catch(console.error);

      // Extract user using their dummy email tied to chat ID
      const email = telegramEmail(chatId);
      const { data: user } = await supabase.from("users").select("id, full_name, email").eq("email", email).single();

      if (!user) {
        await sendMessage(chatId, "You need to register first. Type /register");
        return NextResponse.json({ ok: true });
      }

      if (data.startsWith("plan_")) {
        // Step 1: User selected a plan. Now select payment method.
        const planId = data.replace("plan_", "");

        const { data: plan } = await supabase.from("plan_membership").select("*").eq("id", planId).single();
        if (!plan) {
          await sendMessage(chatId, "Plan not found.");
          return NextResponse.json({ ok: true });
        }

        // Fetch Tripay config to get payment channels
        const { data: gatewaySettings } = await supabase.from("payment_gateway").select("*").limit(1).single();
        if (!gatewaySettings || !gatewaySettings.socialbooster_config) {
          await sendMessage(chatId, "Payment gateway is not configured yet.");
          return NextResponse.json({ ok: true });
        }

        const tripayConfig = {
          api_key: gatewaySettings.socialbooster_config.api_key,
          kode_api: gatewaySettings.socialbooster_config.kode_api,
        };

        const channelsRes = await getPaymentChannels(tripayConfig);
        let keyboard: any[] = [];

        if (channelsRes.success && channelsRes.data && channelsRes.data.length > 0) {
          // Map channels to inline keyboard buttons (filter only active)
          keyboard = channelsRes.data
            .filter((ch: any) => ch.active)
            .map((ch: any) => ([
              { text: ch.name, callback_data: `pay_${planId}_${ch.code}` }
            ]));
        } else {
          // Fallback if API fails
          console.error("Failed to fetch Tripay channels:", channelsRes);
          const methods = ["BCAVA", "QRIS"];
          keyboard = methods.map(method => ([
            { text: method, callback_data: `pay_${planId}_${method}` }
          ]));
        }

        // Add Cryptomus option at the end
        keyboard.push([{ text: "🪙 Cryptomus (Crypto - USD)", callback_data: `pay_${planId}_Cryptomus` }]);

        await sendMessage(
          chatId,
          `You selected *${plan.name}* (IDR ${plan.price_idr.toLocaleString()} / $${plan.price_usd}).\n\nSelect a payment method:`,
          { inline_keyboard: keyboard }
        );
      }
      else if (data.startsWith("pay_")) {
        // Step 2: User selected payment method.
        // Data format: pay_UUID_METHOD
        const parts = data.split("_");
        if (parts.length >= 3) {
          const planId = parts[1];
          const method = parts[2];

          // Fetch plan details
          const { data: plan } = await supabase.from("plan_membership").select("*").eq("id", planId).single();
          if (!plan) {
            await sendMessage(chatId, "Plan not found.");
            return NextResponse.json({ ok: true });
          }

          // Fetch Tripay config
          const { data: gatewaySettings } = await supabase.from("payment_gateway").select("*").limit(1).single();
          if (!gatewaySettings || !gatewaySettings.socialbooster_config) {
            await sendMessage(chatId, "Payment gateway is not configured yet.");
            return NextResponse.json({ ok: true });
          }

          const tripayConfig = {
            api_key: gatewaySettings.socialbooster_config.api_key,
            kode_api: gatewaySettings.socialbooster_config.kode_api,
          };

          const merchantRef = `INV-${Date.now()}`;

          if (method === 'Cryptomus') {
            const { data: gatewaySettings } = await supabase.from("payment_gateway").select("*").limit(1).single();
            if (!gatewaySettings || !gatewaySettings.cryptomus_config) {
              await sendMessage(chatId, "Cryptomus is not configured yet.");
              return NextResponse.json({ ok: true });
            }

            const cryptoConfig = {
              merchantId: gatewaySettings.cryptomus_config.merchantId,
              paymentKey: gatewaySettings.cryptomus_config.paymentKey
            };

            const payload: CryptomusPayload = {
              amount: plan.price_usd.toString(),
              currency: 'USD',
              order_id: merchantRef
            };

            try {
              const res = await createCryptomusTransaction(cryptoConfig, payload);
              if (res.state === 0 && res.result) {
                const { error: insertError } = await supabase.from("membership_history").insert([{
                  id_plan_membership: planId,
                  id_users: user.id,
                  status_payment: "Pending",
                  invoice: res.result.order_id,
                  detail_payment: res.result
                }]);

                if (insertError) {
                  console.error("Failed to insert membership_history:", insertError);
                }

                await sendMessage(
                  chatId,
                  `Transaction Created! 🎉\n\nMethod: Cryptomus\nAmount: $${plan.price_usd}\nReference: \`${res.result.order_id}\`\n\n[>> PAY WITH CRYPTO <<](${res.result.url})`
                );
              } else {
                console.error("Cryptomus API Error:", res);
                await sendMessage(chatId, `Failed to create crypto payment: ${res.message}`);
              }
            } catch (e: any) {
              console.error("Crypto payment error:", e);
              await sendMessage(chatId, "An error occurred during crypto payment processing.");
            }
            return NextResponse.json({ ok: true });
          }

          // Custom Tripay payment logic
          const payloadTripay: TransactionPayload = {
            method: method,
            amount: Number(plan.price_idr),
          };

          try {
            const tripayRes = await createClosedTransaction(tripayConfig, payloadTripay);

            if (tripayRes.success) {
              // Insert to membership_history with Pending status
              const { error: insertError } = await supabase.from("membership_history").insert([{
                id_plan_membership: planId,
                id_users: user.id,
                status_payment: "Pending",
                invoice: tripayRes.data.reference,
                detail_payment: tripayRes.data
              }]);

              if (insertError) {
                console.error("Failed to insert membership_history:", insertError);
              }

              // Send QR code photo if available
              const qrUrl = tripayRes.data.payment?.qr_url;
              if (qrUrl) {
                await sendPhoto(
                  chatId,
                  qrUrl,
                  `Scan this QR Code to pay via ${method}`
                );
              }

              // Show VA number if available
              let paymentInstructions = "";
              const vaNumber = tripayRes.data.payment?.va_number;
              if (vaNumber) {
                paymentInstructions = `\n*Virtual Account Number:*\n\`${vaNumber}\`\n`;
              }

              await sendMessage(
                chatId,
                `Transaction Created! 🎉\n\nMethod: ${method}\nAmount: IDR ${plan.price_idr.toLocaleString()}\nReference: \`${tripayRes.data.reference}\`${paymentInstructions}\n\nPlease complete your payment before it expires.`
              );
            } else {
              console.error("Tripay API Error:", tripayRes);
              await sendMessage(chatId, `Failed to create payment: ${tripayRes.message}`);
            }
          } catch (e: any) {
            console.error("Payment error:", e);
            await sendMessage(chatId, "An error occurred during payment processing. Please try again.");
          }
        }
      }

      return NextResponse.json({ ok: true });
    }

    // Handle standard text messages
    if (update.message && update.message.text) {
      const chatId = update.message.chat.id;
      const text = update.message.text.trim();

      if (text.startsWith("/register")) {
        const fullName = update.message.from?.first_name || "Telegram User";
        const email = telegramEmail(chatId);

        const randomPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 10);

        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let userToken = '';
        const randomValues = crypto.randomBytes(16);
        for (let i = 0; i < 16; i++) {
          userToken += chars[randomValues[i] % chars.length];
        }

        const { data: existingUser } = await supabase
          .from("users")
          .select("id, user_token")
          .eq("email", email)
          .single();

        if (existingUser) {
          await sendMessage(
            chatId,
            `You are already registered!\n\nYour User Token:\n\`${existingUser.user_token}\``,
            miniAppReplyMarkup(existingUser.user_token)
          );
          return NextResponse.json({ ok: true });
        }

        const { error } = await supabase.from("users").insert([
          {
            full_name: fullName,
            email: email,
            password: hashedPassword,
            user_token: userToken,
          },
        ]);

        if (error) {
          console.error("Supabase insert error:", error);
          await sendMessage(chatId, "Failed to register automatically. Please try again later.");
        } else {
          await sendMessage(
            chatId,
            `Registration Successful! 🎉\n\nName: ${fullName}\n\n*Your User Token:*\n\`${userToken}\`\n\nTap the button below to open Vidplus VIP.`,
            miniAppReplyMarkup(userToken)
          );
        }
      }
      else if (text === "/app" || text === "/vip") {
        await sendMiniAppAccess(
          chatId,
          "Tap the button below to open *Vidplus VIP* with your account."
        );
      }
      else if (text.startsWith("/plan") || text.startsWith("/buy")) {
        const { data: plans } = await supabase.from("plan_membership").select("*").order("price_idr", { ascending: true });

        if (!plans || plans.length === 0) {
          await sendMessage(chatId, "No plans available right now.");
          return NextResponse.json({ ok: true });
        }

        const keyboard = plans.map(plan => ([
          {
            text: `${plan.name} - IDR ${plan.price_idr.toLocaleString()} / $${plan.price_usd}`,
            callback_data: `plan_${plan.id}`
          }
        ]));

        await sendMessage(
          chatId,
          "Please select a membership plan to purchase:",
          { inline_keyboard: keyboard }
        );
      }
      else if (text.startsWith("/pstatus")) {
        const args = text.split(" ");
        if (args.length < 2) {
          await sendMessage(chatId, "Please provide a reference number.\nUsage: `/pstatus [reference]`");
          return NextResponse.json({ ok: true });
        }
        
        const reference = args[1].trim();

        // Fetch gateway config
        const { data: gatewaySettings } = await supabase.from("payment_gateway").select("*").limit(1).single();
        if (!gatewaySettings || (!gatewaySettings.socialbooster_config && !gatewaySettings.tripay_config)) {
          await sendMessage(chatId, "Payment gateway is not configured yet.");
          return NextResponse.json({ ok: true });
        }

        const config = gatewaySettings.socialbooster_config || gatewaySettings.tripay_config;
        const tripayConfig = {
          api_key: config.api_key || config.apiKey,
          kode_api: config.kode_api || config.private_key || config.privateKey,
        };

        try {
          const detailRes: any = await getTransactionDetail(tripayConfig, reference);

          if (detailRes.success && detailRes.data) {
            const data = detailRes.data;
            await sendMessage(
              chatId,
              `*Payment Status*\n\nReference: \`${data.reference}\`\nStatus: *${data.status}*\nAmount: IDR ${data.amount.toLocaleString()}`
            );
          } else {
            await sendMessage(chatId, `Failed to get status: ${detailRes.message || 'Transaction not found'}`);
          }
        } catch (error) {
          console.error("Error checking pstatus:", error);
          await sendMessage(chatId, "An error occurred while checking payment status.");
        }
      }
      else if (text === "/start" || text === "/help") {
        const user = await getTelegramUser(chatId);

        if (user?.user_token) {
          await sendMessage(
            chatId,
            "Welcome back! 👋\n\n/register - View your account token\n/app - Open Vidplus VIP Mini App\n/plan - Purchase membership\n/pstatus [ref] - Check payment status",
            miniAppReplyMarkup(user.user_token)
          );
        } else {
          await sendMessage(
            chatId,
            "Welcome! 👋\n\n/register - Register and get your User Token\n/plan - Purchase membership\n/pstatus [ref] - Check payment status\n\nAfter registering, use /app to open Vidplus VIP."
          );
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
