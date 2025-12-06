"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, FileText, CheckCircle } from "lucide-react"

export function ExpenseRequest() {
    const [category, setCategory] = useState("")
    const [amount, setAmount] = useState("")
    const [description, setDescription] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<"idle" | "success">("idle")

    const handleSubmit = async () => {
        setIsLoading(true)
        // Simulate API call and approval process
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        setStatus("success")
    }

    if (status === "success") {
        return (
            <div className="text-center space-y-4 py-8 animate-in fade-in zoom-in bg-muted/30 rounded-lg border border-border">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-foreground">Request Submitted</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                    Your request for <strong>${amount}</strong> for <strong>{category}</strong> has been sent for approval.
                    Once approved, funds will be converted to SLL and sent to your local account.
                </p>
                <Button onClick={() => setStatus("idle")} variant="outline">
                    Submit Another Request
                </Button>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h3 className="text-lg font-semibold">Request Funds (Draw-Down)</h3>
                <p className="text-sm text-muted-foreground">
                    Submit an expense report to release funds from Escrow.
                </p>
            </div>

            <div className="space-y-4">
                <div className="grid gap-2">
                    <Label>Expense Category</Label>
                    <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rent">Office Rent</SelectItem>
                            <SelectItem value="salaries">Salaries & Wages</SelectItem>
                            <SelectItem value="procurement">Local Procurement</SelectItem>
                            <SelectItem value="utilities">Utilities & Internet</SelectItem>
                            <SelectItem value="legal">Legal & Compliance</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label>Amount (USDC)</Label>
                    <Input
                        type="number"
                        placeholder="0.00"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                    />
                </div>

                <div className="grid gap-2">
                    <Label>Description / Invoice Reference</Label>
                    <Input
                        placeholder="e.g., Q4 Rent Payment - Invoice #123"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg space-y-2 text-sm border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                        <FileText className="h-4 w-4 text-yellow-600 mt-0.5" />
                        <span className="text-yellow-700 dark:text-yellow-300">
                            Funds will be converted to SLL by our licensed partner at the current spot rate upon approval.
                        </span>
                    </div>
                </div>

                <Button
                    className="w-full"
                    onClick={handleSubmit}
                    disabled={!amount || !category || isLoading}
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Submitting Request...
                        </>
                    ) : (
                        "Submit Expense Request"
                    )}
                </Button>
            </div>
        </div>
    )
}
