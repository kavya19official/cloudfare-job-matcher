/// <reference types="@cloudflare/workers-types" />
import { handleRequest } from './routes';

addEventListener('fetch', (event: FetchEvent) => {
  event.respondWith(handleRequest(event.request));
});
