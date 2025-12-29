import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'tempphone-store.json');

const SOURCES = [
  {
    name: 'iP1SMS',
    url: 'https://raw.githubusercontent.com/iP1SMS/disposable-phone-numbers/master/number-list.json',
    type: 'strong'
  }
];

const REFRESH_INTERVAL = 6 * 60 * 60 * 1000; // 6 hours

let strongSet = new Set();
let ready = false;

function normalize(phone) {
  if (typeof phone !== 'string') return null;

  const cleaned = phone.replace(/[^\d+]/g, '');

  // Strict E.164 sanity (reasonable limits for validation)
  if (!/^\+?[1-9]\d{8,11}$/.test(cleaned)) return null;

  // Canonical internal form (digits only)
  if (cleaned.startsWith('+1')) return cleaned.slice(2);
  if (cleaned.startsWith('1') && cleaned.length === 11) return cleaned.slice(1);

  return cleaned.replace(/^\+/, '');
}

function structurallySuspicious(n) {
  if (/^(\d)\1{9,}$/.test(n)) return true;     // repeated digits
  if (new Set(n).size <= 3) return true;       // very low entropy
  if (n.startsWith('555')) return true;        // NANP reserved
  return false;
}

async function saveBackup() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(
    STORE_FILE,
    JSON.stringify({ strong: [...strongSet] })
  );
}

async function loadBackup() {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    const json = JSON.parse(raw);
    strongSet = new Set(json.strong || []);
    ready = true;
  } catch {
    // silent fail
  }
}

async function refresh() {
  const nextStrong = new Set();

  for (const source of SOURCES) {
    try {
      const res = await fetch(source.url, { timeout: 10000 });
      if (!res.ok) continue;

      const data = await res.json();

      if (source.type === 'strong') {
        Object.keys(data).forEach(raw => {
          const n = normalize(raw);
          if (n) nextStrong.add(n);
        });
      }
    } catch {
      // ignore source failure
    }
  }

  if (nextStrong.size > 0) {
    strongSet = nextStrong;
    ready = true;
    await saveBackup();
  } else {
    await loadBackup();
  }
}

export async function isTempPhone(phone) {
  if (!ready) await refresh();

  const n = normalize(phone);
  if (!n) return false;

  // STRONG source → immediate true
  if (strongSet.has(n)) return true;

  // Weak heuristics NEVER alone
  if (structurallySuspicious(n)) return false;

  return false;
}

refresh();
setInterval(refresh, REFRESH_INTERVAL);

export default isTempPhone;
