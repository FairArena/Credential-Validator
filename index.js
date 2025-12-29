import express from "express";
import { isDisposableEmail } from "./utils/emailValidator.js";
import { isTempPhone } from "./utils/phoneValidator.js";
import { ENV } from "./config/env.js";
import { arcjetMiddleware } from "./middleware/arcjet.middleware.js";
import helmet from "helmet";
import hpp from "hpp";
import cors from "cors";
import dns from "dns/promises";

const app = express();
const PORT = ENV?.PORT || 3000;

app.use(express.json());
process.env.ARCJET_ENABLED === "true" ? app.use(arcjetMiddleware) : null;
app.set("trust proxy", true);
app.use(hpp());
app.use(helmet());
app.use(cors());
app.get('/check', async (req, res) => {
  const email = req.query.email;

  if (typeof email !== 'string') {
    return res.status(400).json({ tempmail: null });
  }

  // RFC-lite email sanity
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ tempmail: null });
  }

  const domain = email.split('@')[1];

  // MX existence check (free, strong signal)
  try {
    const mx = await dns.resolveMx(domain);
    if (!Array.isArray(mx) || mx.length === 0) {
      return res.status(400).json({ tempmail: null });
    }
  } catch {
    return res.status(400).json({ tempmail: null });
  }

  try {
    const result = await isDisposableEmail(email);
    res.json({ tempmail: result });
  } catch {
    res.status(500).json({ tempmail: null });
  }
});


app.get('/check-phone', async (req, res) => {
  const phone = req.query.phone;

  if (typeof phone !== 'string') {
    return res.status(400).json({ tempphone: null });
  }

  // Phone number format validation (E.164 compliant, reasonable limits)
  const cleaned = phone.replace(/[^\d+]/g, '');
  // Check if original contains only valid phone characters (digits, spaces, hyphens, parentheses, +)
  if (!/^[\d\s\-\(\)\+]+$/.test(phone)) {
    return res.status(400).json({ tempphone: "invalid phone number" });
  }
  if (!/^\+?[1-9]\d{8,11}$/.test(cleaned)) {
    return res.status(400).json({ tempphone: "invalid phone number" });
  }

  try {
    const result = await isTempPhone(phone);
    res.json({ tempphone: result });
  } catch {
    // Never leak internal state
    res.status(500).json({ tempphone: null });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "TempMail Validator API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`TempMail Validator API listening on port ${PORT}`);
});
