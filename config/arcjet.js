import arcjet, { detectBot, shield, fixedWindow } from '@arcjet/node';
import { ENV } from './env.js';

let aj = null;

if (ENV.ARCJET_KEY && process.env.ARCJET_ENABLED === 'true') {
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