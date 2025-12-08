'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useUser } from '@/context/user-context'
import apiClient from '@/lib/api-client'

interface Investment {
    _id: string
    name: string
    description: string
    type: 'Growth' | 'Income' | 'Impact'
    minInvestment: number
    expectedReturn: number
    riskLevel: 'Low' | 'Medium' | 'High'
    sector: string
    location: string
    totalFunded?: number
    fundingGoal?: number
    status: 'Active' | 'Closed' | 'Pending'
}

export default function AdminInvestmentsPage() {
    const { user, isAdmin } = useUser()
    const [investments, setInvestments] = useState<Investment[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState('')
    const [seeding, setSeeding] = useState(false)

    useEffect(() => {
        if (isAdmin) {
            loadInvestments()
        }
    }, [isAdmin])

    const loadInvestments = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/api/investments')
            setInvestments(response.data)
        } catch (error) {
            console.error('Error loading investments:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSeedInvestments = async () => {
        setSeeding(true)
        try {
            await apiClient.post('/api/seed/investments', {})
            await loadInvestments()
            alert('✅ Investments seeded successfully!')
        } catch (error) {
            console.error('Error seeding investments:', error)
            alert('❌ Error seeding investments')
        } finally {
            setSeeding(false)
        }
    }

    const handleClearInvestments = async () => {
        if (window.confirm('Are you sure? This will delete all investments.')) {
            try {
                await apiClient.delete('/api/seed/investments/clear')
                setInvestments([])
                alert('✅ All investments cleared')
            } catch (error) {
                console.error('Error clearing investments:', error)
                alert('❌ Error clearing investments')
            }
        }
    }

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'Growth':
                return 'bg-blue-100 text-blue-800'
            case 'Income':
                return 'bg-green-100 text-green-800'
            case 'Impact':
                return 'bg-purple-100 text-purple-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

    const getRiskColor = (risk: string) => {
        switch (risk) {
            case 'Low':
                return 'bg-green-100 text-green-800'
            case 'Medium':
                return 'bg-yellow-100 text-yellow-800'
            case 'High':
                return 'bg-red-100 text-red-800'
            default:
                return 'bg-gray-100 text-gray-800'
        }
    }

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

    const filteredInvestments = investments.filter(inv =>
        inv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.description.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8 md:py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-foreground mb-2">Investment Management</h1>
                    <p className="text-lg text-muted-foreground">
                        Manage vetted investment opportunities
                    </p>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mb-6">
                    <Button
                        onClick={handleSeedInvestments}
                        disabled={seeding}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {seeding ? '🔄 Seeding...' : '🌱 Seed Investments (31)'}
                    </Button>
                    <Button
                        onClick={handleClearInvestments}
                        variant="destructive"
                    >
                        🗑️ Clear All
                    </Button>
                </div>

                {/* Stats */}
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Total Investments</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{investments.length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Growth</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{investments.filter(i => i.type === 'Growth').length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Income</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{investments.filter(i => i.type === 'Income').length}</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-3">
                            <CardTitle className="text-sm font-medium">Impact</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-2xl font-bold">{investments.filter(i => i.type === 'Impact').length}</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Search */}
                <Card className="mb-6">
                    <CardContent className="pt-6">
                        <Input
                            placeholder="Search investments by name or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-md"
                        />
                    </CardContent>
                </Card>

                {/* Investments List */}
                <Card>
                    <CardHeader>
                        <CardTitle>Investment Opportunities ({filteredInvestments.length})</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <p>Loading...</p>
                        ) : filteredInvestments.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-muted-foreground mb-4">No investments found</p>
                                <Button onClick={handleSeedInvestments} className="bg-blue-600">
                                    Seed Investments
                                </Button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredInvestments.map((investment) => (
                                    <div
                                        key={investment._id}
                                        className="border rounded-lg p-4 space-y-3 hover:bg-muted/50 transition"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="font-semibold text-lg">{investment.name}</p>
                                                <p className="text-sm text-muted-foreground">{investment.description}</p>
                                            </div>
                                            <Badge className={getTypeColor(investment.type)}>
                                                {investment.type}
                                            </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                                            <div>
                                                <p className="text-muted-foreground">Min. Investment</p>
                                                <p className="font-medium">${investment.minInvestment.toLocaleString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Expected Return</p>
                                                <p className="font-medium text-green-600">{investment.expectedReturn}%</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Risk</p>
                                                <Badge className={getRiskColor(investment.riskLevel)}>
                                                    {investment.riskLevel}
                                                </Badge>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Sector</p>
                                                <p className="font-medium">{investment.sector}</p>
                                            </div>
                                            <div>
                                                <p className="text-muted-foreground">Location</p>
                                                <p className="font-medium">{investment.location}</p>
                                            </div>
                                        </div>

                                        {investment.fundingGoal && (
                                            <div>
                                                <div className="flex justify-between text-sm mb-1">
                                                    <p className="text-muted-foreground">Funding Progress</p>
                                                    <p className="font-medium">
                                                        ${(investment.totalFunded || 0).toLocaleString()} / ${investment.fundingGoal.toLocaleString()}
                                                    </p>
                                                </div>
                                                <div className="w-full bg-muted rounded-full h-2">
                                                    <div
                                                        className="bg-blue-600 h-2 rounded-full"
                                                        style={{
                                                            width: `${Math.min(100, ((investment.totalFunded || 0) / investment.fundingGoal) * 100)}%`
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
