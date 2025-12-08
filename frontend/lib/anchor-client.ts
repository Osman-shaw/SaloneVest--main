import { AnchorProvider, Program, web3 } from '@coral-xyz/anchor'
import { Connection, PublicKey } from '@solana/web3.js'
import type { AnchorWallet } from '@solana/wallet-adapter-react'

// This will be replaced with the actual IDL after deploying the smart contract
// For now, we'll create a placeholder structure
export interface InvestmentEscrowIDL {
    version: string
    name: string
    instructions: any[]
    accounts: any[]
    types: any[]
}

// Placeholder IDL - will be replaced after anchor build
const IDL: InvestmentEscrowIDL = {
    version: "0.1.0",
    name: "investment_escrow",
    instructions: [],
    accounts: [],
    types: []
}

// Get program ID from environment
const PROGRAM_ID = new PublicKey(
    process.env.NEXT_PUBLIC_PROGRAM_ID || '11111111111111111111111111111111'
)

/**
 * Get Anchor provider instance
 */
export function getProvider(wallet: AnchorWallet, connection: Connection): AnchorProvider {
    return new AnchorProvider(connection, wallet, {
        commitment: 'confirmed',
    })
}

/**
 * Get Anchor program instance
 */
export function getProgram(provider: AnchorProvider) {
    return new Program(IDL as any, PROGRAM_ID, provider)
}

/**
 * Derive PDA for investment account
 */
export function getInvestmentPDA(investmentId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('investment'), Buffer.from(investmentId)],
        PROGRAM_ID
    )
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
        PROGRAM_ID
    )
}

/**
 * Derive PDA for escrow account
 */
export function getEscrowPDA(investmentId: string): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('escrow'), Buffer.from(investmentId)],
        PROGRAM_ID
    )
}

/**
 * Derive PDA for admin account
 */
export function getAdminPDA(): [PublicKey, number] {
    return PublicKey.findProgramAddressSync(
        [Buffer.from('admin')],
        PROGRAM_ID
    )
}

// Export types and constants
export { PROGRAM_ID, IDL }
export type { AnchorWallet }
