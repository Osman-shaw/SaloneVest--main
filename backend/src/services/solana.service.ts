import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
import { config } from '../config';

// Solana connection
let connection: Connection;

/**
 * Initialize Solana connection
 */
export function initializeSolanaConnection(): Connection {
    const network = config.solana.network as 'devnet' | 'mainnet-beta' | 'testnet';
    const endpoint = config.solana.rpcUrl || clusterApiUrl(network);

    connection = new Connection(endpoint, 'confirmed');
    console.log(`✅ Solana connected to ${network}`);

    return connection;
}

/**
 * Get Solana connection instance
 */
export function getConnection(): Connection {
    if (!connection) {
        return initializeSolanaConnection();
    }
    return connection;
}

/**
 * Get program ID from environment
 */
export function getProgramId(): PublicKey {
    const programId = config.solana.programId;
    if (!programId) {
        throw new Error('PROGRAM_ID not configured in environment variables');
    }
    return new PublicKey(programId);
}

/**
 * Derive PDA for investment account
 */
export function getInvestmentPDA(investmentId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('investment'), Buffer.from(investmentId)],
        getProgramId()
    );
}

/**
 * Derive PDA for investor account
 */
export function getInvestorPDA(
    investmentId: string,
    investorPubkey: PublicKey
): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [
            Buffer.from('investor'),
            Buffer.from(investmentId),
            investorPubkey.toBuffer(),
        ],
        getProgramId()
    );
}

/**
 * Derive PDA for escrow account
 */
export function getEscrowPDA(investmentId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), Buffer.from(investmentId)],
        getProgramId()
    );
}

/**
 * Derive PDA for admin account
 */
export function getAdminPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('admin')],
        getProgramId()
    );
}

/**
 * Fetch investment account data from blockchain
 * @param investmentId - Investment ID
 * @returns Investment account data or null if not found
 */
export async function fetchInvestmentAccount(investmentId: string): Promise<any | null> {
    try {
        const [investmentPDA] = getInvestmentPDA(investmentId);
        const accountInfo = await getConnection().getAccountInfo(investmentPDA);

        if (!accountInfo) {
            return null;
        }

        // TODO: Deserialize account data using IDL
        // This will be implemented after the Anchor program is deployed
        // For now, return raw data
        return {
            address: investmentPDA.toString(),
            data: accountInfo.data,
            lamports: accountInfo.lamports,
        };
    } catch (error) {
        console.error(`Error fetching investment account ${investmentId}:`, error);
        return null;
    }
}

/**
 * Fetch investor account data from blockchain
 */
export async function fetchInvestorAccount(
    investmentId: string,
    investorPubkey: string
): Promise<any | null> {
    try {
        const [investorPDA] = getInvestorPDA(investmentId, new PublicKey(investorPubkey));
        const accountInfo = await getConnection().getAccountInfo(investorPDA);

        if (!accountInfo) {
            return null;
        }

        // TODO: Deserialize account data using IDL
        return {
            address: investorPDA.toString(),
            data: accountInfo.data,
            lamports: accountInfo.lamports,
        };
    } catch (error) {
        console.error(`Error fetching investor account:`, error);
        return null;
    }
}

/**
 * Verify if a wallet address is an authorized admin
 */
export async function isAuthorizedAdmin(walletAddress: string): Promise<boolean> {
    try {
        const [adminPDA] = getAdminPDA();
        const accountInfo = await getConnection().getAccountInfo(adminPDA);

        if (!accountInfo) {
            // If admin account doesn't exist, check against env variable
            const adminWallets = config.solana.adminWallets || [];
            return adminWallets.includes(walletAddress);
        }

        // TODO: Deserialize admin account and check if wallet is authorized
        // For now, fallback to env variable check
        const adminWallets = config.solana.adminWallets || [];
        return adminWallets.includes(walletAddress);
    } catch (error) {
        console.error('Error checking admin authorization:', error);
        return false;
    }
}

/**
 * Get SOL balance for a wallet
 */
export async function getSOLBalance(walletAddress: string): Promise<number> {
    try {
        const pubkey = new PublicKey(walletAddress);
        const balance = await getConnection().getBalance(pubkey);
        return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
        console.error('Error fetching SOL balance:', error);
        return 0;
    }
}

/**
 * Get USDC token balance for a wallet
 */
export async function getUSDCBalance(walletAddress: string): Promise<number> {
    try {
        // Balance is typically tracked via Portfolio model
        // Blockchain balance syncing is handled by dedicated sync service
        return 0;
    } catch (error) {
        console.error('Error fetching USDC balance:', error);
        return 0;
    }
}

export default {
    initializeSolanaConnection,
    getConnection,
    getProgramId,
    getInvestmentPDA,
    getInvestorPDA,
    getEscrowPDA,
    getAdminPDA,
    fetchInvestmentAccount,
    fetchInvestorAccount,
    isAuthorizedAdmin,
    getSOLBalance,
    getUSDCBalance,
};
