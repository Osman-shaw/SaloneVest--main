'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import apiClient from '@/lib/api-client'

interface WithdrawalFormProps {
  balance: number
  userId: string
}

export function WithdrawalForm({ balance, userId }: WithdrawalFormProps) {
  const [amount, setAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'bank_transfer' | 'orange_money' | 'afromo_money'>('bank_transfer')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Bank transfer fields
  const [bankName, setBankName] = useState('')
  const [accountNumber, setAccountNumber] = useState('')
  const [accountHolder, setAccountHolder] = useState('')
  const [swiftCode, setSwiftCode] = useState('')

  // Mobile money fields
  const [phoneNumber, setPhoneNumber] = useState('')
  const [accountName, setAccountName] = useState('')

  const estimatedFee = amount ? (parseFloat(amount) * (paymentMethod === 'bank_transfer' ? 0.02 : 0.01)).toFixed(2) : '0'
  const netAmount = amount ? (parseFloat(amount) - parseFloat(estimatedFee)).toFixed(2) : '0'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const payload: any = {
        walletAddress: userId,
        amount: parseFloat(amount),
        paymentMethod
      }

      if (paymentMethod === 'bank_transfer') {
        payload.bankDetails = {
          bankName,
          accountNumber,
          accountHolder,
          swiftCode
        }
      } else {
        payload.mobileMoneyDetails = {
          phoneNumber,
          accountName,
          providerName: paymentMethod === 'orange_money' ? 'Orange Money' : 'Afromo Money'
        }
      }

      const response = await apiClient.post('/api/withdrawals', payload)

      if (response.data.success) {
        setSuccess(true)
        // Reset form
        setAmount('')
        setBankName('')
        setAccountNumber('')
        setAccountHolder('')
        setPhoneNumber('')
        setAccountName('')
        setTimeout(() => setSuccess(false), 5000)
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create withdrawal request')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Withdrawal Request</CardTitle>
        <CardDescription>
          Current balance: <span className="font-semibold">${balance.toFixed(2)} USDC</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
            ✅ Withdrawal request submitted successfully! You will receive confirmation once processed.
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
            ❌ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Amount */}
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

          {/* Fee Breakdown */}
          {amount && (
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

          {/* Payment Method Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Method</label>
            <Tabs value={paymentMethod} onValueChange={(val: any) => setPaymentMethod(val)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="bank_transfer">Bank Transfer</TabsTrigger>
                <TabsTrigger value="orange_money">Orange Money</TabsTrigger>
                <TabsTrigger value="afromo_money">Afromo Money</TabsTrigger>
              </TabsList>

              {/* Bank Transfer Tab */}
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

              {/* Orange Money Tab */}
              <TabsContent value="orange_money" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Orange Money Phone Number</label>
                  <Input
                    placeholder="e.g., +232 76 123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Include country code (+232)</p>
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
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                  💡 Orange Money withdrawals are processed within 1-2 hours
                </div>
              </TabsContent>

              {/* Afromo Money Tab */}
              <TabsContent value="afromo_money" className="space-y-4 mt-4">
                <div>
                  <label className="text-sm font-medium">Afromo Money Phone Number</label>
                  <Input
                    placeholder="e.g., +232 76 123456"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground mt-1">Include country code (+232)</p>
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
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg text-sm text-purple-800">
                  💡 Afromo Money withdrawals are processed within 30 minutes to 1 hour
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <Button type="submit" disabled={loading || !amount || parseFloat(amount) <= 0} className="w-full">
            {loading ? 'Processing...' : 'Request Withdrawal'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
