'use client'

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import apiClient from '@/lib/api-client'
import {
  PEEAP_SCRIPT_SRC,
  getDisplaySlePerUsdc,
  getPeeapBaseUrl,
  getPeeapPublicKey,
} from '@/lib/peeap'

type PaymentMethod = 'bank_transfer' | 'orange_money' | 'afromo_money' | 'peeap'

interface WithdrawalFormProps {
  balance: number
  /** Solana wallet address (required by POST /api/withdrawals). */
  walletAddress: string
}

export function WithdrawalForm({ balance, walletAddress }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('bank_transfer')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [peeapScriptReady, setPeeapScriptReady] = useState(false)
  const peeapInited = useRef(false)
  const peeapPk = getPeeapPublicKey()

  // Peeap (SLE) fields
  const [peeapSle, setPeeapSle] = useState('')
  const [peeapPhone, setPeeapPhone] = useState('')
  const [peeapName, setPeeapName] = useState('')

  // Bank
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [swiftCode, setSwiftCode] = useState('')

  // Mobile
  const [phoneNumber, setPhoneNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  const estimatedFee = amount
    ? (parseFloat(amount) * (paymentMethod === 'bank_transfer' ? 0.02 : 0.01)).toFixed(2)
    : '0'
  const netAmount = amount
    ? (parseFloat(amount) - parseFloat(estimatedFee)).toFixed(2)
    : '0'

  const slePerUsdc = getDisplaySlePerUsdc()
  const estimatedUsdcForPeeap = peeapSle
    ? (parseFloat(peeapSle) / slePerUsdc).toFixed(4)
    : '0'
  const feePeeapUsdc = peeapSle
    ? ((parseFloat(peeapSle) / slePerUsdc) * 0.01).toFixed(4)
    : '0'
  const netPeeapUsdc = peeapSle
    ? (parseFloat(estimatedUsdcForPeeap) - parseFloat(feePeeapUsdc)).toFixed(4)
    : '0'

  useEffect(() => {
    if (!peeapScriptReady || !peeapPk || typeof window === 'undefined' || !window.PeeapSDK) return
    if (peeapInited.current) return
    window.PeeapSDK.init({
      publicKey: peeapPk,
      baseUrl: getPeeapBaseUrl(),
      onSuccess: (payment) => {
        toast.success('Peeap payment session completed', {
          description: payment?.reference
            ? `Reference: ${String(payment.reference)}`
            : undefined,
        })
      },
      onError: (e) => {
        toast.error('Peeap error', { description: e?.message ?? 'Unknown error' })
      },
      onCancel: () => {
        if (process.env.NODE_ENV === 'development') {
          console.debug('Peeap checkout closed')
        }
      },
    })
    peeapInited.current = true
  }, [peeapScriptReady, peeapPk])

  const openPeeapCheckout = (sle: number, reference: string) => {
    if (typeof window === 'undefined' || !window.PeeapSDK) {
      toast.error('Peeap SDK not loaded. Refresh the page and try again.')
      return
    }
    if (!Number.isFinite(sle) || sle < 5) {
      toast.error('Invalid SLE amount for Peeap.')
      return
    }
    window.PeeapSDK.createPayment({
      amount: Math.round(sle * 100) / 100,
      currency: 'SLE',
      description: 'SaloneVest withdrawal to Sierra Leone mobile money',
      reference,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      if (paymentMethod === 'peeap') {
        if (!peeapPk) {
          setError('Peeap is not configured. Set NEXT_PUBLIC_PEEAP_PUBLIC_KEY in your environment.')
          return
        }
        const sle = parseFloat(peeapSle)
        if (!Number.isFinite(sle) || sle < 5) {
          setError('Enter at least 5 SLE (New Leone).')
          return
        }
        const usdcNeed = sle / slePerUsdc
        if (usdcNeed > balance) {
          setError('Insufficient USDC balance for this SLE amount.')
          return
        }
        const response = await apiClient.post('/api/withdrawals', {
          walletAddress,
          paymentMethod: 'peeap',
          sleAmount: sle,
          mobileMoneyDetails: {
            phoneNumber: peeapPhone,
            accountName: peeapName,
            providerName: 'Peeap (SLE)',
          },
        })

        if (response.data.success) {
          setSuccess(true)
          const w = response.data.withdrawal
          const ref = w?.id != null ? String(w.id) : 'withdrawal'
          if (w?.payoutSle != null) {
            openPeeapCheckout(Number(w.payoutSle), ref)
          }
          setPeeapSle('')
          setPeeapPhone('')
          setPeeapName('')
          setTimeout(() => setSuccess(false), 8000)
        }
        return
      }

      const payload: Record<string, unknown> = {
        walletAddress,
        amount: parseFloat(amount),
        paymentMethod,
      }

      if (paymentMethod === 'bank_transfer') {
        payload.bankDetails = {
          bankName,
          accountNumber,
          accountHolder,
          swiftCode,
        }
      } else {
        payload.mobileMoneyDetails = {
          phoneNumber,
          accountName,
          providerName: paymentMethod === 'orange_money' ? 'Orange Money' : 'Afromo Money',
        }
      }

      const response = await apiClient.post('/api/withdrawals', payload)

      if (response.data.success) {
        setSuccess(true)
        setAmount('')
        setBankName('')
        setAccountNumber('')
        setAccountHolder('')
        setPhoneNumber('')
        setAccountName('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err: unknown) {
      const ax = err as { response?: { data?: { error?: string } } }
      setError(ax.response?.data?.error || 'Failed to create withdrawal request')
    } finally {
      setLoading(false)
    }
  }

  const usdcForPeeap = parseFloat(estimatedUsdcForPeeap)
  const canSubmitPeeap = Boolean(
    peeapPk &&
      peeapSle &&
      parseFloat(peeapSle) >= 5 &&
      peeapPhone.trim().length > 0 &&
      Number.isFinite(usdcForPeeap) &&
      usdcForPeeap > 0 &&
      usdcForPeeap <= balance
  )

  return (
    <Card className="w-full">
      {peeapPk && (
        <Script
          src={PEEAP_SCRIPT_SRC}
          strategy="afterInteractive"
          onLoad={() => setPeeapScriptReady(true)}
        />
      )}

      <CardHeader>
        <CardTitle>Withdrawal Request</CardTitle>
        <CardDescription>
          Current balance: <span className="font-semibold">${balance.toFixed(2)} USDC</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            Withdrawal request recorded. {paymentMethod === 'peeap' && peeapPk
              ? 'Complete the Peeap window if it opened.'
              : 'You will receive confirmation once processed.'}
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {paymentMethod !== 'peeap' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Withdrawal Amount (USDC)</label>
              <Input
                type="number"
                placeholder="1000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                min="10"
                max={balance}
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground">Minimum: $10</p>
            </div>
          )}

          {paymentMethod === 'peeap' && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount to receive (SLE — New Leone)</label>
              <Input
                type="number"
                placeholder="e.g. 50"
                value={peeapSle}
                onChange={(e) => setPeeapSle(e.target.value)}
                min="5"
                step="0.01"
                required
              />
              <p className="text-xs text-muted-foreground">
                Sierra Leone 2022 redenomination: use SLE, not SLL. Small purchases are often
                5–500 SLE. Rate shown: ≈{slePerUsdc} SLE per 1 USDC (set via env; must match
                backend SLE_USDC_RATE).
              </p>
            </div>
          )}

          {amount && paymentMethod !== 'peeap' && (
            <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Amount:</span>
                <span>${parseFloat(amount).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Fee ({paymentMethod === 'bank_transfer' ? '2%' : '1%'}):</span>
                <span>-${estimatedFee}</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-semibold">
                <span>You will receive:</span>
                <span>${netAmount}</span>
              </div>
            </div>
          )}

          {paymentMethod === 'peeap' && peeapSle && (
            <div className="p-3 bg-muted rounded-lg space-y-1 text-sm">
              <div className="flex justify-between">
                <span>USDC set aside (est.):</span>
                <span>${estimatedUsdcForPeeap}</span>
              </div>
              <div className="flex justify-between text-yellow-600">
                <span>Fee (1%):</span>
                <span>-${feePeeapUsdc}</span>
              </div>
              <div className="border-t pt-1 flex justify-between font-semibold">
                <span>Net booking (est.):</span>
                <span>${netPeeapUsdc}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Tabs value={paymentMethod} onValueChange={(v) => setPaymentMethod(v as PaymentMethod)}>
              <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto flex-wrap gap-1">
                <TabsTrigger value="bank_transfer" className="text-xs sm:text-sm">
                  Bank
                </TabsTrigger>
                <TabsTrigger value="orange_money" className="text-xs sm:text-sm">
                  Orange
                </TabsTrigger>
                <TabsTrigger value="afromo_money" className="text-xs sm:text-sm">
                  Afromo
                </TabsTrigger>
                <TabsTrigger value="peeap" className="text-xs sm:text-sm">
                  Peeap (SLE)
                </TabsTrigger>
              </TabsList>

              <TabsContent value="bank_transfer" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Bank Name</label>
                  <Input
                    placeholder="e.g., Union Trust Bank"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    placeholder="e.g., 123456789"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Account Holder Name</label>
                  <Input
                    placeholder="e.g., John Doe"
                    value={accountHolder}
                    onChange={(e) => setAccountHolder(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">SWIFT Code (Optional)</label>
                  <Input
                    placeholder="e.g., UTTCSLLF"
                    value={swiftCode}
                    onChange={(e) => setSwiftCode(e.target.value)}
                  />
                </div>
              </TabsContent>

              <TabsContent value="orange_money" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Orange Money Phone Number</label>
                  <Input
                    placeholder="e.g., +232 76 123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    placeholder="Name associated with Orange Money account"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-blue-800 bg-blue-50 border border-blue-200 rounded p-2">
                  Orange Money withdrawals are processed within 1–2 hours
                </p>
              </TabsContent>

              <TabsContent value="afromo_money" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Afromo Money Phone Number</label>
                  <Input
                    placeholder="e.g., +232 76 123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    placeholder="Name associated with Afromo Money account"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    required
                  />
                </div>
                <p className="text-xs text-purple-800 bg-purple-50 border border-purple-200 rounded p-2">
                  Afromo Money withdrawals are often processed in 30 minutes to 1 hour
                </p>
              </TabsContent>

              <TabsContent value="peeap" className="space-y-4 mt-4">
                {!peeapPk && (
                  <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3">
                    Set <code className="text-xs">NEXT_PUBLIC_PEEAP_PUBLIC_KEY</code> and{' '}
                    <code className="text-xs">NEXT_PUBLIC_PEEAP_BASE_URL</code> in your deployment
                    environment, then rebuild the frontend.
                  </p>
                )}
                <div>
                  <label className="text-sm font-medium">Mobile number (Peeap / SL)</label>
                  <Input
                    placeholder="e.g., +232 7x xxx xxx"
                    value={peeapPhone}
                    onChange={(e) => setPeeapPhone(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Account name (optional but recommended)</label>
                  <Input
                    placeholder="Name on the wallet"
                    value={peeapName}
                    onChange={(e) => setPeeapName(e.target.value)}
                  />
                </div>
                <p className="text-xs text-muted-foreground border rounded p-2 bg-slate-50">
                  After you submit, the Peeap checkout opens for the same SLE amount. Currency
                  is <strong>SLE (New Leone)</strong> only — not legacy SLL.
                </p>
              </TabsContent>
            </Tabs>
          </div>

          <Button
            type="submit"
            disabled={
              loading ||
              (paymentMethod === 'peeap' ? !canSubmitPeeap : !amount || parseFloat(amount) <= 0)
            }
            className="w-full"
          >
            {loading ? 'Processing...' : paymentMethod === 'peeap' ? 'Save & open Peeap' : 'Request Withdrawal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
