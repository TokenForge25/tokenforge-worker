import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/create-token') {
    const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
    const fromKeypair = Keypair.fromSecretKey(Uint8Array.from([
      180, 236, 117, 73, 118, 94, 96, 242, 84, 252, 133, 11, 189, 136, 177, 248,
      251, 233, 240, 32, 153, 246, 178, 66, 47, 74, 81, 238, 141, 133, 73, 227,
      143, 243, 179, 206, 141, 207, 95, 17, 10, 233, 174, 232, 189, 161, 108,
      100, 133, 49, 126, 228, 231, 45, 68, 23, 60, 147, 154, 248, 121, 247, 14
    ]));
    const toPubkey = new PublicKey('GmCay6WYZU4ZnGfVdRMFzzUz7DcYm7Vbr9oFB8r9nvtN');

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: fromKeypair.publicKey,
        toPubkey,
        lamports: LAMPORTS_PER_SOL * 0.01, // 0.01 SOL
      })
    );

    const signature = await sendAndConfirmTransaction(connection, transaction, [fromKeypair]);
    return new Response(JSON.stringify({ txHash: signature }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
  return fetch('https://tokenforge25.github.io' + pathname);
}
