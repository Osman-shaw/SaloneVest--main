/**
 * Legacy client-side stubs. Persistence and MongoDB are handled by the Express backend.
 */

export type TransactionRecord = {
    date: string
    type: string
    txHash?: string
    amount: number
    status: string
    recipient?: string
}

export const db = {
    async getTransactions(): Promise<TransactionRecord[]> {
        return []
    },
}
 