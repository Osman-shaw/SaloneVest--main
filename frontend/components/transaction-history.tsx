"use client"

import { useEffect, useState } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ReceiptModal } from "./receipt-modal"
import { History, RefreshCw } from "lucide-react"
import { db, TransactionRecord } from "@/lib/db"
import { Button } from "./ui/button"

export function TransactionHistory() {
    const [transactions, setTransactions] = useState<TransactionRecord[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const loadTransactions = async () => {
        setIsLoading(true)
        try {
            const data = await db.getTransactions()
            setTransactions(data)
        } catch (error) {
            console.error("Failed to load transactions:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadTransactions()
    }, [])

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <History className="h-5 w-5 text-primary" />
                        <CardTitle>Transaction History</CardTitle>
                    </div>
                    <Button variant="ghost" size="sm" onClick={loadTransactions} disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
                <CardDescription>Recent activity and investment records</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Date</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>TxID</TableHead>
                            <TableHead className="text-right">Amount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No transactions found
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((tx, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{tx.date}</TableCell>
                                    <TableCell className="capitalize">{tx.type}</TableCell>
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        {tx.txHash ? `${tx.txHash.slice(0, 4)}...${tx.txHash.slice(-4)}` : "Pending"}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                        {tx.type === "withdrawal" ? "-" : "+"}${tx.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant="outline"
                                            className={
                                                tx.status === "completed"
                                                    ? "bg-green-50 text-green-700 border-green-200"
                                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                            }
                                        >
                                            {tx.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <ReceiptModal transaction={{
                                            id: index.toString(),
                                            date: tx.date,
                                            type: tx.type,
                                            amount: tx.amount,
                                            status: tx.status,
                                            txId: tx.txHash || "Pending",
                                            recipient: tx.recipient
                                        }} />
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}
