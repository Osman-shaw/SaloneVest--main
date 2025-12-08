'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAdminWithdrawals } from '@/hooks/use-withdrawals'
import { useUser } from '@/context/user-context'
import apiClient from '@/lib/api-client'

export default function AdminWithdrawalsPage() {
    const { user, isAdmin } = useUser()
    const [status, setStatus] = useState<string>('')
    const { withdrawals, loading, total } = useAdminWithdrawals(status)
    const [processing, setProcessing] = useState<string | null>(null)

    if (!user || !isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle>Access Denied</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Admin privileges required.</p>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const handleApprove = async (withdrawalId: string) => {
        setProcessing(withdrawalId)
        try {
            await apiClient.put(`/api/withdrawals/${withdrawalId}/approve`, {
                adminId: user.id,
                transactionReference: `REF-${Date.now()}`
            })
            // Refresh data
            window.location.reload()
        } catch (error) {
            console.error('Error approving withdrawal:', error)
        } finally {
            setProcessing(null)
        }
    }

    const handleProcess = async (withdrawalId: string) => {
        setProcessing(withdrawalId)
        try {
            await apiClient.put(`/api/withdrawals/${withdrawalId}/process`, {})
            // Refresh data
            window.location.reload()
        } catch (error) {
            console.error('Error processing withdrawal:', error)
        } finally {
            setProcessing(null)
        }
    }

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

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Withdrawal Management</h1>
                    <p className="text-lg text-muted-foreground">
                        Approve and process user withdrawal requests
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{total}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-yellow-600">Pending</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{withdrawals.filter(w => w.status === 'pending').length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-blue-600">Approved</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{withdrawals.filter(w => w.status === 'approved').length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium text-green-600">Processed</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{withdrawals.filter(w => w.status === 'processed').length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs for status filtering */}
                <Card>
                    <CardHeader>
                        <CardTitle>Withdrawal Requests</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Tabs value={status} onValueChange={setStatus} className="w-full">
                            <TabsList className="grid w-full grid-cols-5">
                                <TabsTrigger value="">All</TabsTrigger>
                                <TabsTrigger value="pending">Pending</TabsTrigger>
                                <TabsTrigger value="approved">Approved</TabsTrigger>
                                <TabsTrigger value="processed">Processed</TabsTrigger>
                                <TabsTrigger value="failed">Failed</TabsTrigger>
                            </TabsList>

                            <TabsContent value="" className="mt-6">
                                {loading ? (
                                    <p>Loading...</p>
                                ) : withdrawals.length === 0 ? (
                                    <p className="text-muted-foreground">No withdrawals found</p>
                                ) : (
                                    renderWithdrawalsList()
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            </div>
        </div>
    )

    function renderWithdrawalsList() {
        return (
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
                                    {withdrawal.user.name} ({withdrawal.user.walletAddress})
                                </p>
                            </div>
                            <Badge className={getStatusColor(withdrawal.status)}>
                                {withdrawal.status.toUpperCase()}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                            <div>
                                <p className="text-muted-foreground">Method</p>
                                <p className="font-medium">{getPaymentMethodLabel(withdrawal.paymentMethod)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Net Amount</p>
                                <p className="font-medium">${withdrawal.netAmount.toFixed(2)}</p>
                            </div>
                            <div>
                                <p className="text-muted-foreground">Fee</p>
                                <p className="font-medium">${withdrawal.fee.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {withdrawal.status === 'pending' && (
                            <div className="flex gap-2 pt-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleApprove(withdrawal._id)}
                                    disabled={processing === withdrawal._id}
                                    className="bg-blue-600 hover:bg-blue-700"
                                >
                                    {processing === withdrawal._id ? 'Approving...' : 'Approve'}
                                </Button>
                                <Button size="sm" variant="outline">
                                    Reject
                                </Button>
                            </div>
                        )}

                        {withdrawal.status === 'approved' && (
                            <div className="flex gap-2 pt-2">
                                <Button
                                    size="sm"
                                    onClick={() => handleProcess(withdrawal._id)}
                                    disabled={processing === withdrawal._id}
                                    className="bg-green-600 hover:bg-green-700"
                                >
                                    {processing === withdrawal._id ? 'Processing...' : 'Mark as Processed'}
                                </Button>
                            </div>
                        )}

                        <p className="text-xs text-muted-foreground pt-2">
                            Requested: {new Date(withdrawal.createdAt).toLocaleString()}
                        </p>
                    </div>
                ))}
            </div>
        )
    }
}
