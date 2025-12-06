"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OnRamp } from "./on-ramp"
import { TransferForm } from "./transfer-form"
import { OffRamp } from "./off-ramp"
import { Separator } from "@/components/ui/separator"

export function RemittanceFlow() {
    return (
        <div className="w-full max-w-3xl mx-auto">
            <Tabs defaultValue="send" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                    <TabsTrigger value="send">Send Money</TabsTrigger>
                    <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
                </TabsList>

                <TabsContent value="send">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Step 1: Get USDC</CardTitle>
                                <CardDescription>
                                    Top up your wallet with USDC using your card or bank account.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <OnRamp />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Step 2: Transfer</CardTitle>
                                <CardDescription>
                                    Send USDC to your recipient in Sierra Leone.
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TransferForm />
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                <TabsContent value="withdraw">
                    <Card className="max-w-xl mx-auto">
                        <CardHeader>
                            <CardTitle>Withdraw Funds</CardTitle>
                            <CardDescription>
                                Convert your received USDC to Leone (SLE) and cash out.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <OffRamp />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
