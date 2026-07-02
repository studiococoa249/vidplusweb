import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createClosedTransaction, getPaymentChannels, TransactionPayload } from "@/lib/tripay";

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

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
      const email = `telegram_${chatId}@vidplus.local`;
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
        if (!gatewaySettings || !gatewaySettings.tripay_config) {
          await sendMessage(chatId, "Payment gateway is not configured yet.");
          return NextResponse.json({ ok: true });
        }

        const tripayConfig = {
          mode: gatewaySettings.mode || 'Sandbox',
          apiKey: gatewaySettings.tripay_config.apiKey,
          privateKey: gatewaySettings.tripay_config.privateKey,
          merchantCode: gatewaySettings.tripay_config.merchantCode,
        };

        const channelsRes = await getPaymentChannels(tripayConfig);
        let keyboard: any[] = [];
        
        if (channelsRes.success && channelsRes.data) {
          // Filter active channels and map to buttons
          keyboard = channelsRes.data
            .filter((ch: any) => ch.active)
            .map((ch: any) => ([
              { text: ch.name, callback_data: `pay_${planId}_${ch.code}` }
            ]));
        } else {
          // Fallback if API fails
          console.error("Failed to fetch Tripay channels:", channelsRes);
          const methods = ["QRIS", "BRIVA", "BCAVA", "MANDIRIVA", "OVO", "DANA"];
          keyboard = methods.map(method => ([
            { text: method, callback_data: `pay_${planId}_${method}` }
          ]));
        }

        await sendMessage(
          chatId,
          `You selected **${plan.name}** (IDR ${plan.price_idr.toLocaleString()}).\n\nPlease select a payment method:`,
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
          if (!gatewaySettings || !gatewaySettings.tripay_config) {
            await sendMessage(chatId, "Payment gateway is not configured yet.");
            return NextResponse.json({ ok: true });
          }

          const tripayConfig = {
            mode: gatewaySettings.mode || 'Sandbox',
            apiKey: gatewaySettings.tripay_config.apiKey,
            privateKey: gatewaySettings.tripay_config.privateKey,
            merchantCode: gatewaySettings.tripay_config.merchantCode,
          };

          const merchantRef = `INV-${Date.now()}`;

          // Create Tripay Transaction
          const payload: TransactionPayload = {
            method: method,
            merchant_ref: merchantRef,
            amount: Number(plan.price_idr),
            customer_name: user.full_name,
            customer_email: user.email,
            order_items: [
              {
                sku: `PLAN-${planId.substring(0,8)}`,
                name: plan.name,
                price: Number(plan.price_idr),
                quantity: 1
              }
            ]
          };

          try {
            const tripayRes = await createClosedTransaction(tripayConfig, payload);

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

              // Send photo if it's a QR code
              if (tripayRes.data.qr_url) {
                await sendPhoto(
                  chatId, 
                  tripayRes.data.qr_url, 
                  `Scan this QR Code to pay via ${method}`
                );
              }

              let paymentInstructions = "";
              if (tripayRes.data.pay_code) {
                paymentInstructions = `\n**Payment Code / Virtual Account:**\n\`${tripayRes.data.pay_code}\`\n`;
              }

              await sendMessage(
                chatId,
                `Transaction Created! 🎉\n\nMethod: ${method}\nAmount: IDR ${plan.price_idr.toLocaleString()}\nReference: \`${tripayRes.data.reference}\`${paymentInstructions}`
              );
            } else {
              console.error("Tripay API Error:", tripayRes);
              await sendMessage(chatId, `Failed to create payment: ${tripayRes.message}`);
            }
          } catch (e: any) {
            console.error("Payment error:", e);
            await sendMessage(chatId, "An error occurred during payment processing.");
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
        const email = `telegram_${chatId}@vidplus.local`;
        
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
          await sendMessage(chatId, `You are already registered!\n\nYour User Token:\n\`${existingUser.user_token}\``);
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
            `Registered Success. 🎉\n\nName: ${fullName}\n\n**Your User Token:**\n\`${userToken}\`\n\nPlease keep this token safe.`
          );
        }
      } 
      else if (text.startsWith("/plan") || text.startsWith("/buy")) {
        const { data: plans } = await supabase.from("plan_membership").select("*").order("price_idr", { ascending: true });
        
        if (!plans || plans.length === 0) {
          await sendMessage(chatId, "No plans available right now.");
          return NextResponse.json({ ok: true });
        }

        const keyboard = plans.map(plan => ([
          {
            text: `${plan.name} - IDR ${plan.price_idr.toLocaleString()}`,
            callback_data: `plan_${plan.id}`
          }
        ]));

        await sendMessage(
          chatId,
          "Please select a membership plan to purchase:",
          { inline_keyboard: keyboard }
        );
      }
      else if (text === "/start" || text === "/help") {
         await sendMessage(
            chatId,
            "Welcome! Available commands:\n\n/register - Register and get your User Token\n/plan - Buy a membership plan"
         );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Telegram webhook error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
