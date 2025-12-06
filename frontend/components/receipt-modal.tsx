"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer, CheckCircle2 } from "lucide-react"

interface Transaction {
    id: string
    date: string
    type: string
    amount: number
    status: string
    txId: string
    recipient?: string
}

interface ReceiptModalProps {
    transaction: Transaction
}

export function ReceiptModal({ transaction }: ReceiptModalProps) {
    const traditionalFee = transaction.amount * 0.07 // Approx 7% for traditional remittance
    const platformFee = 0
    const networkFee = 0.000005 // Solana network fee (negligible)
    const totalSavings = traditionalFee - (platformFee + networkFee)

    const handlePrint = () => {
        window.print()
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">View Receipt</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-6 w-6 text-green-500" />
                        <DialogTitle>Transaction Receipt</DialogTitle>
                    </div>
                    <DialogDescription>
                        Transaction ID: <span className="font-mono text-xs">{transaction.txId}</span>
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Date</span>
                        <span className="font-medium">{transaction.date}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Type</span>
                        <span className="font-medium">{transaction.type}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Amount</span>
                        <span className="text-xl font-bold">${transaction.amount.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="font-medium text-sm">Fee Breakdown</h4>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Network Fee (Solana)</span>
                            <span>${networkFee.toFixed(6)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Platform Fee</span>
                            <span className="text-green-600">FREE</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Traditional Cost (Est.)</span>
                            <span className="text-red-500 line-through">${traditionalFee.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-100 dark:border-green-900">
                        <div className="flex justify-between items-center text-green-700 dark:text-green-400 font-medium">
                            <span>Total Savings</span>
                            <span>${totalSavings.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handlePrint} className="w-full gap-2">
                        <Printer className="h-4 w-4" /> Print Receipt
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
