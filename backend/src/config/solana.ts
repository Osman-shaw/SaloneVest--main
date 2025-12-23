import { Connection, PublicKey } from '@solana/web3.js';

// Solana configuration
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'mainnet-beta';

// Initialize Solana connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// USDC Mint Address on Solana Mainnet
export const USDC_MINT = new PublicKey('EPjFWdd6LikePEgjfZ8JsZvEHGDnStJmNKX2wnm9wHLC');

// SaloneVest Program ID (placeholder - should be your deployed program)
export const SALONEVEST_PROGRAM_ID = new PublicKey('SaLoNeVeSt111111111111111111111111111111111');

console.log(`✅ Solana connected to ${SOLANA_NETWORK}`);
