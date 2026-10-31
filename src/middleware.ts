import { defineMiddleware } from 'astro:middleware';
import { maybeRunWatchdog } from './lib/watchdog';

export const onRequest = defineMiddleware((_ctx, next) => {
  maybeRunWatchdog();
  return next();
});
