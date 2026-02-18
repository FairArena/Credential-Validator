import arcjet, { detectBot, shield, fixedWindow } from '@arcjet/node';
import { ENV } from './env.js';

/**
 * Arcjet instance for security protection (rate limiting, bot detection, etc.)
 * Will be null when ARCJET_ENABLED is not 'true' or ARCJET_KEY is missing.
 * This allows the application to start without Arcjet configuration.
 */
let aj = null;

if (ENV.ARCJET_KEY && ENV.ARCJET_ENABLED === 'true') {
  aj = arcjet({
    key: ENV.ARCJET_KEY,
    characteristics: ['ip.src'],
    rules: [
      shield({ mode: 'LIVE' }),

      detectBot({
        mode: 'LIVE',
        allow: [
          'CATEGORY:SEARCH_ENGINE',
          'CATEGORY:PREVIEW',
        ],
      }),

      fixedWindow({
        mode: 'LIVE',
        window: '1s',
        max: 60,
      }),
    ],
  });
}

export { aj };