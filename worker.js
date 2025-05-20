addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/create-token') {
    // Mock Solana token creation (replace with @solana/spl-token later)
    return new Response(JSON.stringify({ txHash: crypto.randomUUID() }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
  return fetch('https://tokenforge25.github.io' + pathname);
}
