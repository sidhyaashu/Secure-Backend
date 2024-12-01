import arcjet, { detectBot, shield, tokenBucket } from '@arcjet/bun';
import { env } from 'bun';

// Arcjet configuration
export const aj = arcjet({
  key: env.ARCJET_KEY!, // Ensure this is set in your .env file
  characteristics: ['ip.src'], // Track requests by IP
  rules: [
    // Protect against common attacks
    shield({ mode: 'LIVE' }),
    // Detect and block bots
    detectBot({
      mode: 'LIVE', // Use DRY_RUN to test without blocking
      allow: [
        'CATEGORY:SEARCH_ENGINE', // Allow search engine bots
      ],
    }),
    // Rate limiting using a token bucket
    tokenBucket({
      mode: 'LIVE',
      refillRate: 5, // Refill 5 tokens per interval
      interval: 10, // Every 10 seconds
      capacity: 10, // Bucket can hold 10 tokens
    }),
  ],
});
