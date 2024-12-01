import { Hono } from 'hono';
import { aj } from './arcjet';

const app = new Hono();

// Middleware for Arcjet protection
app.use('/*', async (c, next) => {
  try {
    const decision = await aj.protect(c.req.raw, { requested: 5 }); // Deduct 5 tokens
    console.log('Arcjet decision:', decision.conclusion);

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return c.json({ error: 'Too many requests' }, 429);
      } else if (decision.reason.isBot()) {
        return c.json({ error: 'No bots allowed' }, 403);
      } else {
        return c.json({ error: 'Forbidden' }, 403);
      }
    }

    await next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Error in Arcjet middleware:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Default route
app.get('/', (c) => {
  return c.text('Hello Hono!');
});

export default app;
