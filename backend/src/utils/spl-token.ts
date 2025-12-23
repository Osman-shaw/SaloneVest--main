import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
    getAssociatedTokenAddress,
    createAssociatedTokenAccountInstruction,
    getAccount,
    TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { connection, USDC_MINT } from '../config/solana';

/**
 * Get USDC token account for a wallet
 */
export async function getUSDCTokenAccount(walletAddress: string): Promise<PublicKey | null> {
    try {
        const walletPubkey = new PublicKey(walletAddress);
        const associatedTokenAddress = await getAssociatedTokenAddress(
            USDC_MINT,
            walletPubkey
        );

        try {
            await getAccount(connection, associatedTokenAddress);
            return associatedTokenAddress;
        } catch (error) {
            // Token account doesn't exist
            return null;
        }
    } catch (error) {
        console.error('Error getting USDC token account:', error);
        return null;
    }
}

/**
 * Get USDC balance for a wallet address
 */
export async function getUSDCBalance(walletAddress: string): Promise<number> {
    try {
        const tokenAccount = await getUSDCTokenAccount(walletAddress);

        if (!tokenAccount) {
            return 0;
        }

        const accountInfo = await getAccount(connection, tokenAccount);
        // USDC has 6 decimals
        const balance = Number(accountInfo.amount) / 1_000_000;

        return balance;
    } catch (error) {
        console.error('Error fetching USDC balance:', error);
        return 0;
    }
}

/**
 * Create USDC token account if it doesn't exist
 */
export async function createUSDCTokenAccount(
    walletPubkey: PublicKey
): Promise<Transaction> {
    const associatedTokenAddress = await getAssociatedTokenAddress(
        USDC_MINT,
        walletPubkey
    );

    const transaction = new Transaction().add(
        createAssociatedTokenAccountInstruction(
            walletPubkey, // payer
            associatedTokenAddress, // associated token account
            walletPubkey, // owner
            USDC_MINT // mint
        )
    );

    return transaction;
}

/**
 * Verify a USDC transfer transaction
 */
export async function verifyUSDCTransfer(
    txHash: string,
    expectedAmount: number,
    recipientAddress: string
): Promise<boolean> {
    try {
        const tx = await connection.getTransaction(txHash, {
            maxSupportedTransactionVersion: 0
        });

        if (!tx || !tx.meta) {
            return false;
        }

        // Check if transaction was successful
        if (tx.meta.err) {
            return false;
        }

        // Verify USDC amount from token balances
        // This is a simplified check - in production, parse the instruction data
        const postTokenBalances = tx.meta.postTokenBalances || [];
        const preTokenBalances = tx.meta.preTokenBalances || [];

        for (let i = 0; i < postTokenBalances.length; i++) {
            const post = postTokenBalances[i];
            const pre = preTokenBalances.find(p => p.accountIndex === post.accountIndex);

            if (post.mint === USDC_MINT.toBase58()) {
                const postAmount = Number(post.uiTokenAmount.uiAmount);
                const preAmount = pre ? Number(pre.uiTokenAmount.uiAmount) : 0;
                const transferAmount = postAmount - preAmount;

                // Allow small rounding differences
                if (Math.abs(transferAmount - expectedAmount) < 0.01) {
                    return true;
                }
            }
        }

        return false;
    } catch (error) {
        console.error('Error verifying USDC transfer:', error);
        return false;
    }
}

/**
 * Format USDC amount for display
 */
export function formatUSDC(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Check if wallet has sufficient USDC balance
 */
export async function hasSufficientBalance(
    walletAddress: string,
    requiredAmount: number
): Promise<{ sufficient: boolean; balance: number; shortfall: number }> {
    const balance = await getUSDCBalance(walletAddress);
    const sufficient = balance >= requiredAmount;
    const shortfall = sufficient ? 0 : requiredAmount - balance;

    return { sufficient, balance, shortfall };
}
