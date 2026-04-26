/** Client-side user shape; `publicKey` mirrors Solana wallet / `walletAddress` from the API. */
export interface UserRecord {
    id?: string
    _id?: string
    publicKey: string
    walletAddress?: string
    role?: "investor" | "admin" | "startup"
    profile?: {
        name?: string
        email?: string
        avatar?: string
        [key: string]: unknown
    }
    settings?: {
        notifications?: boolean
        currency?: string
        riskTolerance?: "low" | "moderate" | "high"
        [key: string]: unknown
    }
    kycStatus?: "none" | "pending" | "verified" | "rejected"
    createdAt?: string | Date
    lastLogin?: string | Date
}
