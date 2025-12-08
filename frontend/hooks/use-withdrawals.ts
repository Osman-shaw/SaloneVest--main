'use client'

import { useState, useEffect } from 'react'
import apiClient from '@/lib/api-client'

export interface Withdrawal {
    _id: string
    amount: number
    fee: number
    netAmount: number
    paymentMethod: string
    status: string
    createdAt: string
    processedDate?: string
}

export function useWithdrawals(userId: string) {
    const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const response = await apiClient.get(`/api/withdrawals/user/${userId}`)
                if (response.data.success) {
                    setWithdrawals(response.data.withdrawals)
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch withdrawals')
            } finally {
                setLoading(false)
            }
        }

        if (userId) {
            fetchWithdrawals()
        }
    }, [userId])

    return { withdrawals, loading, error }
}

export interface AdminWithdrawal extends Withdrawal {
    user: {
        _id: string
        walletAddress: string
        email: string
        name: string
    }
}

export function useAdminWithdrawals(status?: string, paymentMethod?: string) {
    const [withdrawals, setWithdrawals] = useState<AdminWithdrawal[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [total, setTotal] = useState(0)

    useEffect(() => {
        const fetchWithdrawals = async () => {
            try {
                const query = new URLSearchParams()
                if (status) query.append('status', status)
                if (paymentMethod) query.append('paymentMethod', paymentMethod)
                
                const response = await apiClient.get(`/api/withdrawals?${query}`)
                if (response.data.success) {
                    setWithdrawals(response.data.withdrawals)
                    setTotal(response.data.total)
                }
            } catch (err: any) {
                setError(err.message || 'Failed to fetch withdrawals')
            } finally {
                setLoading(false)
            }
        }

        fetchWithdrawals()
    }, [status, paymentMethod])

    return { withdrawals, loading, error, total }
}
