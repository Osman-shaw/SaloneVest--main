"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Send } from "lucide-react"
import { Connection, SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

export function TransferForm() {
    const [recipient, setRecipient] = useState("")
    const [amount, setAmount] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
    const [txSignature, setTxSignature] = useState("")

    const handleSend = async () => {
        setIsLoading(true)
        setStatus("idle")

        try {
            // Check for Phantom wallet
            const provider = window.phantom?.solana
            if (!provider?.publicKey) {
                throw new Error("Wallet not connected")
            }

            // Connect to Devnet
            const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

            // Create Transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: provider.publicKey,
                    toPubkey: new PublicKey(recipient),
                    lamports: parseFloat(amount) * LAMPORTS_PER_SOL,
                })
            )

            // Get latest blockhash
            const { blockhash } = await connection.getLatestBlockhash()
            transaction.recentBlockhash = blockhash
            transaction.feePayer = provider.publicKey

            // Sign and Send via Phantom
            const { signature } = await (provider as any).signAndSendTransaction(transaction)

            // Wait for confirmation
            await connection.confirmTransaction(signature, "confirmed")

            setTxSignature(signature)
            setStatus("success")
        } catch (error) {
            console.error("Transaction failed:", error)
            setStatus("error")
        } finally {
            setIsLoading(false)
        }
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in">
                <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Send className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Transfer Sent!</h3>
                <p className="text-muted-foreground">
                    {amount} SOL has been sent to {recipient.slice(0, 4)}...{recipient.slice(-4)}.
                </p>
                <a
                    href={`https://explorer.solana.com/tx/${txSignature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm block"
                >
                    View on Solana Explorer
                </a>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    Send Another
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Send SOL (Devnet)</h3>
                <p className="text-sm text-muted-foreground">
                    Send money instantly to any Solana wallet.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Recipient Address</Label>
                    <Input
                        placeholder="Solana Wallet Address"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Amount (SOL)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="p-4 bg-muted/50 rounded-lg space-y-2 text-sm">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Network Fee</span>
                        <span className="text-green-600">~0.000005 SOL</span>
                    </div>
                    <div className="flex justify-between font-medium pt-2 border-t">
                        <span>Total Cost</span>
                        <span>{amount ? (parseFloat(amount) + 0.000005).toFixed(5) : "0"} SOL</span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleSend}
                    disabled={!amount || !recipient || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send Now"
                    )}
                </Button>

                {status === "error" && (
                    <p className="text-sm text-destructive text-center">
                        Transaction failed. Please check your wallet and try again.
                    </p>
                )}
            </div>
        </div>
    )
}
