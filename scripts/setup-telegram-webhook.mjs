/**
 * Register Telegram webhook for production.
 *
 * Usage:
 *   node scripts/setup-telegram-webhook.mjs
 *   node scripts/setup-telegram-webhook.mjs https://www.vidplus.web.id/api/telegram-bot
 *
 * Requires TELEGRAM_BOT_TOKEN in .env or environment.
 */
import fs from "fs";
import path from "path";

function loadToken() {
  if (process.env.TELEGRAM_BOT_TOKEN) {
    return process.env.TELEGRAM_BOT_TOKEN.trim();
  }

  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) return "";

  const envFile = fs.readFileSync(envPath, "utf-8");
  for (const line of envFile.split("\n")) {
    if (line.startsWith("TELEGRAM_BOT_TOKEN=")) {
      return line.split("=").slice(1).join("=").trim();
    }
  }
  return "";
}

const token = loadToken();
if (!token) {
  console.error("TELEGRAM_BOT_TOKEN tidak ditemukan di .env atau environment.");
  process.exit(1);
}

const webhookUrl =
  process.argv[2] || "https://www.vidplus.web.id/api/telegram-bot";
const miniAppUrl =
  process.env.TELEGRAM_MINI_APP_URL || "https://vip-vidplus.vercel.app/auth";
const api = `https://api.telegram.org/bot${token}`;

console.log(`Mendaftarkan webhook ke: ${webhookUrl}`);

const setRes = await fetch(`${api}/setWebhook`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    url: webhookUrl,
    allowed_updates: ["message", "callback_query"],
  }),
});
const setData = await setRes.json();
console.log("setWebhook:", JSON.stringify(setData, null, 2));

console.log(`Mengatur menu Mini App ke: ${miniAppUrl}`);

const menuRes = await fetch(`${api}/setChatMenuButton`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    menu_button: {
      type: "web_app",
      text: "Vidplus VIP",
      web_app: { url: miniAppUrl },
    },
  }),
});
const menuData = await menuRes.json();
console.log("setChatMenuButton:", JSON.stringify(menuData, null, 2));

const commandsRes = await fetch(`${api}/setMyCommands`, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    commands: [
      { command: "start", description: "Menu utama" },
      { command: "register", description: "Daftar & dapatkan token" },
      { command: "app", description: "Buka Vidplus VIP Mini App" },
      { command: "plan", description: "Beli membership" },
    ],
  }),
});
const commandsData = await commandsRes.json();
console.log("setMyCommands:", JSON.stringify(commandsData, null, 2));

const infoRes = await fetch(`${api}/getWebhookInfo`);
const infoData = await infoRes.json();
console.log("getWebhookInfo:", JSON.stringify(infoData, null, 2));

if (!setData.ok) {
  process.exit(1);
}
