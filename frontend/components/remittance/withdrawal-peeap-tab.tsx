"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import apiClient from "@/lib/api-client"
import {
  PEEAP_SCRIPT_SRC,
  getPeeapBaseUrl,
  getPeeapPublicKey,
  getDisplaySlePerUsdc,
} from "@/lib/peeap"

type Props = {
  userId: string
  usdcBalance: number
  onRecorded: () => void
}

export function WithdrawalPeeapTab({ userId, usdcBalance, onRecorded }: Props) {
  const [sleStr, setSleStr] = useState("")
  const [phone, setPhone] = useState("")
  const [accountName, setAccountName] = useState("")
  const [loading, setLoading] = useState(false)
  const [scriptReady, setScriptReady] = useState(false)
  const initDone = useRef(false)

  const publicKey = getPeeapPublicKey()
  const rate = getDisplaySlePerUsdc()
  const sle = parseFloat(sleStr) || 0
  const usdcEq = rate > 0 && sle > 0 ? Math.round((sle / rate) * 1e6) / 1e6 : 0
  const fee = usdcEq > 0 ? Math.round(usdcEq * 0.01 * 1e6) / 1e6 : 0
  const net = usdcEq - fee

  const initPeeap = useCallback(() => {
    if (!publicKey || !window.PeeapSDK || initDone.current) return
    window.PeeapSDK.init({
      publicKey,
      baseUrl: getPeeapBaseUrl(),
      onSuccess: (payment) => {
        const ref = (payment as { reference?: string })?.reference
        toast.success("Peeap payment session completed", {
          description: ref ? `Ref: ${ref}` : undefined,
        })
      },
      onError: (err) => {
        toast.error("Peeap error", { description: err?.message || "Unknown error" })
      },
      onCancel: () => {
        if (process.env.NODE_ENV === "development") {
          console.debug("Peeap checkout cancelled")
        }
      },
    })
    initDone.current = true
  }, [publicKey])

  useEffect(() => {
    if (scriptReady && publicKey && window.PeeapSDK) {
      initPeeap()
    }
  }, [scriptReady, publicKey, initPeeap])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!publicKey) {
      toast.error("Peeap is not configured", {
        description: "Set NEXT_PUBLIC_PEEAP_PUBLIC_KEY for your environment.",
      })
      return
    }
    if (sle < 5) {
      toast.error("Minimum 5 SLE (New Leone)")
      return
    }
    if (usdcEq > usdcBalance + 1e-9) {
      toast.error("Insufficient USDC balance for this SLE amount")
      return
    }
    if (!phone.trim()) {
      toast.error("Phone number is required")
      return
    }

    setLoading(true)
    try {
      const { data } = await apiClient.post("/api/withdrawals", {
        walletAddress: userId,
        paymentMethod: "peeap",
        sleAmount: sle,
        mobileMoneyDetails: {
          phoneNumber: phone.trim(),
          accountName: accountName.trim() || "—",
        },
      })

      if (!data?.success || !data?.withdrawal) {
        throw new Error(data?.error || "Request failed")
      }

      onRecorded()
      const w = data.withdrawal
      const slePay = w.payoutSle ?? sle
      const ref = String(w.id)

      if (window.PeeapSDK) {
        window.PeeapSDK.createPayment({
          amount: Math.round(slePay * 100) / 100,
          currency: "SLE",
          description: `SaloneVest withdrawal ${ref.slice(-8)}`,
          reference: `sv_withdraw_${ref}`,
        })
      } else {
        toast.error("Peeap script not loaded yet — try again in a second.")
      }
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ||
        (err as Error).message
      toast.error("Withdrawal request failed", { description: String(msg) })
    } finally {
      setLoading(false)
    }
  }

  if (!publicKey) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-100">
        <p className="font-medium">Peeap (Sierra Leone — SLE)</p>
        <p className="mt-1 text-muted-foreground">
          Set <code className="rounded bg-background px-1">NEXT_PUBLIC_PEEAP_PUBLIC_KEY</code> and rebuild to
          enable embedded checkout. Never commit live keys; use your hosting env vars.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 mt-4">
      <Script src={PEEAP_SCRIPT_SRC} strategy="afterInteractive" onLoad={() => setScriptReady(true)} />
      <p className="text-sm text-muted-foreground">
        Amounts are <strong className="text-foreground">New Leone (SLE)</strong>, not old SLL. 1% fee.
        Implied USDC: 1 USDC ≈ {rate} SLE (tune with{" "}
        <code className="text-xs">SLE_USDC_RATE</code> on the server and{" "}
        <code className="text-xs">NEXT_PUBLIC_SLE_USDC_RATE</code> in the app).
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-sm font-medium">Amount to receive (SLE)</label>
          <Input
            type="number"
            min={5}
            step="0.01"
            placeholder="e.g. 50"
            value={sleStr}
            onChange={(e) => setSleStr(e.target.value)}
            required
          />
        </div>
        {sle > 0 && usdcEq > 0 && (
          <div className="rounded-md border bg-muted/40 p-3 text-sm">
            <div className="flex justify-between">
              <span>≈ USDC from portfolio</span>
              <span className="font-mono">{usdcEq.toFixed(4)}</span>
            </div>
            <div className="flex justify-between text-amber-700 dark:text-amber-400">
              <span>Fee (1%)</span>
              <span className="font-mono">−{fee.toFixed(4)}</span>
            </div>
            <div className="mt-1 flex justify-between font-semibold">
              <span>Net in USDC</span>
              <span className="font-mono">{net.toFixed(4)}</span>
            </div>
          </div>
        )}
        <div>
          <label className="text-sm font-medium">Mobile number (+232…)</label>
          <Input
            placeholder="+232 76 000000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Account name (optional)</label>
          <Input
            placeholder="Name on mobile money"
            value={accountName}
            onChange={(e) => setAccountName(e.target.value)}
          />
        </div>
        <div className="rounded-md bg-blue-50 p-3 text-xs text-blue-900 dark:bg-blue-950/40 dark:text-blue-200">
          After the request is saved, the Peeap checkout opens for the same SLE amount. Complete payment in
          the modal to proceed with the chosen Sierra Leone mobile-money channels.
        </div>
        <Button
          type="submit"
          disabled={loading || sle < 5 || usdcEq > usdcBalance}
          className="w-full"
        >
          {loading ? "Saving…" : "Save request & open Peeap"}
        </Button>
      </form>
    </div>
  )
}
