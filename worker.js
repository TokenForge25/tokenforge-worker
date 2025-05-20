import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import fs from 'fs';
import { resolve } from 'path';

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  if (request.method === 'POST' && new URL(request.url).pathname === '/api/create-token') {
    try {
      // Initialize Solana connection to devnet
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

      // Load the wallet keypair from the file (generated in Task 6)
      const keypairPath = resolve('/home/aiadmin/.config/solana/id.json');
      const secretKey = JSON.parse(fs.readFileSync(keypairPath, 'utf8'));
      const fromKeypair = Keypair.fromSecretKey(new Uint8Array(secretKey));

      // Request 1 SOL airdrop to cover transaction fees and rent
      const airdropSignature = await connection.requestAirdrop(
        fromKeypair.publicKey,
        LAMPORTS_PER_SOL // 1 SOL
      );
      await connection.confirmTransaction(airdropSignature);

      // Define token mint parameters (simplified for demo)
      const mintAuthority = fromKeypair.publicKey;
      const decimals = 6;
      const supply = BigInt(1000000 * Math.pow(10, decimals)); // 1 million tokens

      // Create a new token mint (simplified mock with transfer)
      const tx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromKeypair.publicKey,
          toPubkey: new PublicKey('GmCay6WYZU4ZnGfVdRMFzzUz7DcYm7Vbr9oFB8r9nvtN'), // Recipient from Task 6
          lamports: LAMPORTS_PER_SOL * 0.1, // 0.1 SOL as a mock token creation cost
        })
      );

      const signature = await sendAndConfirmTransaction(connection, tx, [fromKeypair]);
      return new Response(JSON.stringify({ txHash: signature }), {
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      });
    }
  }
  return new Response('Not Found', { status: 404 });
}
