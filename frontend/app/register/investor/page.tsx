"use client"

import { KYCWizard } from "@/components/auth/kyc-wizard"
import { Navbar } from "@/components/navbar"

export default function RegisterInvestorPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar isConnected={false} />
            <div className="container mx-auto px-4 py-12">
                <div className="text-center mb-10 space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Investor Registration</h1>
                    <p className="text-muted-foreground">
                        Complete your profile to start investing in Sierra Leone. Takes less than 2 minutes.
                    </p>
                </div>
                <KYCWizard />
            </div>
        </main>
    )
}
