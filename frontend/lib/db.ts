export interface TransactionRecord {
    id?: number
    type: "investment" | "transfer" | "deposit" | "withdrawal" | "dividend"
    amount: number
    recipient?: string
    txHash?: string
    date: string
    status: "pending" | "completed" | "failed"
    synced: number // 0 for false, 1 for true
}

export interface UserRecord {
    publicKey: string // Primary Key
    role: "admin" | "startup" | "investor"
    fullName: string
    email: string
    status: "active" | "suspended"
    joinedAt: number
    // KYC Fields
    kycStatus?: "none" | "pending" | "verified" | "rejected"
    nationality?: string
    tin?: string // Tax Identification Number
    documents?: { type: string, name: string, date: string, content?: string }[]
    sourceOfFunds?: string
}

const DB_NAME = "SaloneVestDB"
const DB_VERSION = 4 // Increment version
const STORE_NAME = "transactions"

export const db = {
    async open(): Promise<IDBDatabase> {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onupgradeneeded = (event: any) => {
                const db = event.target.result
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true })
                    store.createIndex("status", "status", { unique: false })
                    store.createIndex("synced", "synced", { unique: false })
                }
                if (!db.objectStoreNames.contains("users")) {
                    const userStore = db.createObjectStore("users", { keyPath: "publicKey" })
                    userStore.createIndex("role", "role", { unique: false })
                }
            }

            request.onsuccess = (event: any) => resolve(event.target.result)
            request.onerror = (event: any) => reject(event.target.error)
        })
    },

    async addTransaction(transaction: Omit<TransactionRecord, "id">): Promise<number> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite")
            const store = tx.objectStore(STORE_NAME)
            const request = store.add(transaction)

            request.onsuccess = () => resolve(request.result as number)
            request.onerror = () => reject(request.error)
        })
    },

    async getTransactions(): Promise<TransactionRecord[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly")
            const store = tx.objectStore(STORE_NAME)
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result.reverse()) // Newest first
            request.onerror = () => reject(request.error)
        })
    },

    async getPendingTransactions(): Promise<TransactionRecord[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readonly")
            const store = tx.objectStore(STORE_NAME)
            const index = store.index("synced")
            const request = index.getAll(0) // Get all where synced is 0 (false)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async markAsSynced(id: number, txHash: string) {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction(STORE_NAME, "readwrite")
            const store = tx.objectStore(STORE_NAME)
            const getRequest = store.get(id)

            getRequest.onsuccess = () => {
                const record = getRequest.result
                record.synced = 1 // True
                record.status = "completed"
                record.txHash = txHash
                store.put(record)
                resolve(true)
            }
            getRequest.onerror = () => reject(getRequest.error)
        })
    },

    // User Management Methods
    async getUser(publicKey: string): Promise<UserRecord | undefined> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction("users", "readonly")
            const store = tx.objectStore("users")
            const request = store.get(publicKey)

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    },

    async createUser(user: UserRecord): Promise<string> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction("users", "readwrite")
            const store = tx.objectStore("users")
            const request = store.add(user)

            request.onsuccess = () => resolve(request.result as string)
            request.onerror = () => reject(request.error)
        })
    },

    async updateUser(user: UserRecord): Promise<string> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction("users", "readwrite")
            const store = tx.objectStore("users")
            const request = store.put(user)

            request.onsuccess = () => resolve(request.result as string)
            request.onerror = () => reject(request.error)
        })
    },

    async getAllUsers(): Promise<UserRecord[]> {
        const db = await this.open()
        return new Promise((resolve, reject) => {
            const tx = db.transaction("users", "readonly")
            const store = tx.objectStore("users")
            const request = store.getAll()

            request.onsuccess = () => resolve(request.result)
            request.onerror = () => reject(request.error)
        })
    }
}
