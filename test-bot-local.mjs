import fs from 'fs';
import path from 'path';

// Load .env
const envPath = path.resolve('.env');
const envFile = fs.readFileSync(envPath, 'utf-8');
let token = '';

envFile.split('\n').forEach(line => {
  if (line.startsWith('TELEGRAM_BOT_TOKEN=')) {
    token = line.split('=')[1].trim();
  }
});

if (!token) {
  console.error("TELEGRAM_BOT_TOKEN tidak ditemukan di .env");
  process.exit(1);
}

const TELEGRAM_API = `https://api.telegram.org/bot${token}`;
const LOCAL_WEBHOOK = 'http://localhost:3000/api/telegram-bot';

let lastUpdateId = 0;

console.log('Memulai local polling untuk Telegram Bot...');
console.log(`Meneruskan pesan dari Telegram ke ${LOCAL_WEBHOOK}`);

async function pollUpdates() {
  try {
    const res = await fetch(`${TELEGRAM_API}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    const data = await res.json();

    if (data.ok && data.result.length > 0) {
      for (const update of data.result) {
        lastUpdateId = update.update_id;
        
        console.log(`[Pesan Masuk] Meneruskan pesan ke localhost...`);
        
        // Teruskan (forward) pesan ke endpoint Next.js lokal kita
        await fetch(LOCAL_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(update)
        }).catch(e => console.error("Gagal meneruskan ke localhost. Pastikan 'npm run dev' menyala.", e.message));
      }
    }
  } catch (error) {
    console.error('Error saat polling:', error.message);
  }

  // Ulangi polling
  setTimeout(pollUpdates, 1000);
}

// Pastikan webhook dihapus terlebih dahulu agar getUpdates bisa berjalan
fetch(`${TELEGRAM_API}/deleteWebhook`)
  .then(() => {
    pollUpdates();
  })
  .catch(console.error);
