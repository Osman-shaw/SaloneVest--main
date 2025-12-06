import { EscrowDashboard } from "@/components/sandbox/escrow-dashboard"
import { ExpenseRequest } from "@/components/sandbox/expense-request"
import { DividendPayment } from "@/components/sandbox/dividend-payment"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SandboxPage() {
    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Startup Sandbox Portal
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Manage your funding, request disbursements, and pay dividends securely under the BSL Regulatory Sandbox.
                    </p>
                </div>

                <div className="max-w-4xl mx-auto space-y-8">
                    <EscrowDashboard />

                    <Tabs defaultValue="expenses" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-8">
                            <TabsTrigger value="expenses">Request Funds</TabsTrigger>
                            <TabsTrigger value="dividends">Pay Dividends</TabsTrigger>
                        </TabsList>

                        <TabsContent value="expenses">
                            <Card>
                                <CardContent className="pt-6">
                                    <ExpenseRequest />
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="dividends">
                            <Card>
                                <CardContent className="pt-6">
                                    <DividendPayment />
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
