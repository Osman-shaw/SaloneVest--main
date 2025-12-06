import { RemittanceFlow } from "@/components/remittance/remittance-flow"

export default function RemitPage() {
    return (
        <div className="min-h-screen bg-background py-12">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center space-y-4 text-center mb-12">
                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                        Remit Without Borders
                    </h1>
                    <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                        Send money to Sierra Leone instantly with near-zero fees.
                        Convert Fiat to USDC, transfer via Solana, and withdraw to Local Mobile Money.
                    </p>
                </div>

                <RemittanceFlow />
            </div>
        </div>
    )
}
