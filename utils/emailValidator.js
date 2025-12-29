import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const STORE_FILE = path.join(DATA_DIR, 'disposable-email-domains.txt');

const STRONG_SOURCES = [
  'https://raw.githubusercontent.com/disposable/disposable-email-domains/master/domains.txt',
  'https://raw.githubusercontent.com/martenson/disposable-email-domains/master/disposable_email_blocklist.conf'
];

const WEAK_SOURCES = [
  'https://raw.githubusercontent.com/7c/fakefilter/main/txt/data.txt'
];

// Only SAFE, brand-based patterns
const SAFE_PATTERNS = [
  /mailinator/i,
  /guerrillamail/i,
  /sharklasers/i,
  /10minutemail/i,
  /tempmail/i,
  /mail\.tm$/i
];

const REFRESH_INTERVAL = 6 * 60 * 60 * 1000;

let domainSet = new Set();
let ready = false;
let refreshing = false;

/* ================= NORMALIZATION ================= */

function normalizeDomain(domain) {
  if (!domain || typeof domain !== 'string') return null;

  const d = domain.trim().toLowerCase().replace(/\.$/, '');
  if (!/^[a-z0-9.-]+\.[a-z]{2,}$/.test(d)) return null;

  return d;
}

function extractDomain(email) {
  const parts = email.split('@');
  if (parts.length !== 2) return null;
  return normalizeDomain(parts[1]);
}

/* ================= SUBDOMAIN CHAIN ================= */

function domainChain(domain) {
  const parts = domain.split('.');
  const chain = [];
  for (let i = 0; i < parts.length - 1; i++) {
    chain.push(parts.slice(i).join('.'));
  }
  return chain;
}

/* ================= STORAGE ================= */

async function saveBackup() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(STORE_FILE, [...domainSet].join('\n'));
}

async function loadBackup() {
  try {
    const raw = await fs.readFile(STORE_FILE, 'utf8');
    domainSet = new Set(
      raw.split('\n').map(normalizeDomain).filter(Boolean)
    );
    ready = true;
  } catch {
    // silent fail
  }
}

/* ================= FETCH ================= */

async function fetchSource(url) {
  try {
    const res = await fetch(url, { timeout: 15000 });
    if (!res.ok) return [];

    return (await res.text())
      .split('\n')
      .map(normalizeDomain)
      .filter(Boolean);
  } catch {
    return [];
  }
}

/* ================= REFRESH ================= */

async function refresh() {
  if (refreshing) return;
  refreshing = true;

  const next = new Set();

  // Strong sources (always trusted)
  for (const url of STRONG_SOURCES) {
    const domains = await fetchSource(url);
    domains.forEach(d => next.add(d));
  }

  // Weak sources only if pattern-backed
  for (const url of WEAK_SOURCES) {
    const domains = await fetchSource(url);
    domains.forEach(d => {
      if (SAFE_PATTERNS.some(p => p.test(d))) {
        next.add(d);
      }
    });
  }

  if (next.size > 1000) {
    domainSet = next;
    ready = true;
    await saveBackup();
  } else {
    await loadBackup();
  }

  refreshing = false;
}

/* ================= CORE CHECK ================= */

export async function isDisposableEmail(email) {
  if (typeof email !== 'string') return false;
  if (!ready) await refresh();

  const domain = extractDomain(email);
  if (!domain) return false;

  const chain = domainChain(domain);

  for (const d of chain) {
    if (domainSet.has(d)) return true;
    if (SAFE_PATTERNS.some(p => p.test(d))) return true;
  }

  return false;
}

/* ================= INIT ================= */

refresh();
setInterval(refresh, REFRESH_INTERVAL);

export default isDisposableEmail;
