import { Connection, PublicKey } from '@solana/web3.js';

// Solana configuration
export const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com';
export const SOLANA_NETWORK = process.env.SOLANA_NETWORK || 'mainnet-beta';

// Initialize Solana connection
export const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// USDC Mint Address on Solana Mainnet
export const USDC_MINT = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

// SaloneVest Program ID (will be set after deployment)
export const PROGRAM_ID = process.env.PROGRAM_ID
    ? new PublicKey(process.env.PROGRAM_ID)
    : new PublicKey('11111111111111111111111111111111'); // Placeholder

// Admin wallet addresses (comma-separated in env)
export const ADMIN_WALLETS = process.env.ADMIN_WALLETS
    ? process.env.ADMIN_WALLETS.split(',').map(addr => addr.trim())
    : [];

// Export unified config
export const config = {
    solana: {
        rpcUrl: SOLANA_RPC_URL,
        network: SOLANA_NETWORK,
        programId: PROGRAM_ID.toString(),
        usdcMint: USDC_MINT.toString(),
        adminWallets: ADMIN_WALLETS,
    }
};

console.log(`✅ Solana connected to ${SOLANA_NETWORK}`);
