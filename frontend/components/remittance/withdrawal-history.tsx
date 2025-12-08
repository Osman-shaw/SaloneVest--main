'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import apiClient from '@/lib/api-client'

interface WithdrawalHistoryProps {
  userId: string
}

interface Withdrawal {
  _id: string
  amount: number
  fee: number
  netAmount: number
  paymentMethod: string
  status: string
  createdAt: string
  processedDate?: string
  mobileMoneyDetails?: {
    phoneNumber: string
    accountName: string
  }
  bankDetails?: {
    bankName: string
    accountNumber: string
  }
}

export function WithdrawalHistory({ userId }: WithdrawalHistoryProps) {
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const response = await apiClient.get(`/api/withdrawals/user/${userId}`)
        if (response.data.success) {
          setWithdrawals(response.data.withdrawals)
        }
      } catch (error) {
        console.error('Failed to fetch withdrawal history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchWithdrawals()
  }, [userId])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-blue-100 text-blue-800'
      case 'processed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'bank_transfer':
        return '🏦 Bank Transfer'
      case 'orange_money':
        return '📱 Orange Money'
      case 'afromo_money':
        return '📱 Afromo Money'
      default:
        return method
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Withdrawal History</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Withdrawal History</CardTitle>
        <CardDescription>Recent withdrawal requests and transactions</CardDescription>
      </CardHeader>
      <CardContent>
        {withdrawals.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No withdrawals yet</p>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal) => (
              <div
                key={withdrawal._id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-lg">${withdrawal.amount.toFixed(2)}</p>
                    <p className="text-sm text-muted-foreground">
                      {getPaymentMethodLabel(withdrawal.paymentMethod)}
                    </p>
                  </div>
                  <Badge className={getStatusColor(withdrawal.status)}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-muted-foreground">Net Amount</p>
                    <p className="font-medium">${withdrawal.netAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Fee</p>
                    <p className="font-medium">${withdrawal.fee.toFixed(2)}</p>
                  </div>
                </div>

                {/* Payment Details */}
                <div className="pt-2 border-t text-sm">
                  {withdrawal.bankDetails && (
                    <div className="space-y-1 text-muted-foreground">
                      <p><span className="font-medium">Bank:</span> {withdrawal.bankDetails.bankName}</p>
                      <p><span className="font-medium">Account:</span> {withdrawal.bankDetails.accountNumber}</p>
                    </div>
                  )}
                  {withdrawal.mobileMoneyDetails && (
                    <div className="space-y-1 text-muted-foreground">
                      <p><span className="font-medium">Phone:</span> {withdrawal.mobileMoneyDetails.phoneNumber}</p>
                      <p><span className="font-medium">Name:</span> {withdrawal.mobileMoneyDetails.accountName}</p>
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="pt-2 border-t text-xs text-muted-foreground">
                  <p>Requested: {new Date(withdrawal.createdAt).toLocaleDateString()}</p>
                  {withdrawal.processedDate && (
                    <p>Processed: {new Date(withdrawal.processedDate).toLocaleDateString()}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
