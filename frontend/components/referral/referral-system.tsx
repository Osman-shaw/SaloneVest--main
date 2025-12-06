"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Copy, Users, Gift, Share2 } from "lucide-react"

export function ReferralSystem() {
    const [referralCode, setReferralCode] = useState("")
    const [inviteCount, setInviteCount] = useState(0)
    const [earnings, setEarnings] = useState(0)

    useEffect(() => {
        // Generate or retrieve referral code
        const storedCode = localStorage.getItem("salonevest_referral_code")
        if (storedCode) {
            setReferralCode(storedCode)
        } else {
            const newCode = "SALONE-" + Math.random().toString(36).substring(2, 8).toUpperCase()
            localStorage.setItem("salonevest_referral_code", newCode)
            setReferralCode(newCode)
        }

        // Mock data for invites
        setInviteCount(3)
        setEarnings(150)
    }, [])

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://salonevest.com/join?ref=${referralCode}`)
        toast.success("Referral Link Copied", {
            description: "Share this link with your friends to earn rewards."
        })
    }

    const shareReferral = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join SaloneVest',
                text: 'Invest in Sierra Leone\'s future with me on SaloneVest!',
                url: `https://salonevest.com/join?ref=${referralCode}`,
            })
        } else {
            copyToClipboard()
        }
    }

    return (
        <div className="space-y-6">
            <Card className="bg-gradient-to-br from-primary/10 to-background border-primary/20">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Gift className="h-5 w-5 text-primary" />
                        Refer & Earn
                    </CardTitle>
                    <CardDescription>
                        Invite friends to SaloneVest and earn $50 USDC for every verified investor.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full space-y-2">
                            <Label>Your Unique Referral Link</Label>
                            <div className="flex gap-2">
                                <Input
                                    readOnly
                                    value={`https://salonevest.com/join?ref=${referralCode}`}
                                    className="bg-background/50"
                                />
                                <Button variant="outline" size="icon" onClick={copyToClipboard}>
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button size="icon" onClick={shareReferral}>
                                    <Share2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Invites</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{inviteCount}</div>
                        <p className="text-xs text-muted-foreground">
                            Friends joined using your code
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                        <Gift className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">${earnings}</div>
                        <p className="text-xs text-muted-foreground">
                            Paid directly to your wallet
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
