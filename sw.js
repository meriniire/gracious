// sw.js - Enhanced Service Worker
const CACHE_NAME = 'gff-v2';

self.addEventListener('install', (event) => {
  self.skipWaiting();
  console.log('Service Worker installed');
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
