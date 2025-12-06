"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { useUser } from "@/context/user-context"
import { UserRecord } from "@/lib/db"
import { api } from "@/lib/api-client"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Shield, Users, Activity } from "lucide-react"

export default function AdminDashboard() {
    const { user, isAdmin, isLoading } = useUser()
    const router = useRouter()
    const [users, setUsers] = useState<UserRecord[]>([])
    const [loadingUsers, setLoadingUsers] = useState(true)

    useEffect(() => {
        if (!isLoading && !isAdmin) {
            toast.error("Access Denied", { description: "You need admin privileges to view this page." })
            router.push("/dashboard")
        }
    }, [isLoading, isAdmin, router])

    useEffect(() => {
        if (isAdmin) {
            loadUsers()
        }
    }, [isAdmin])

    const loadUsers = async () => {
        try {
            const response = await api.user.getAll()
            // Map backend user to UserRecord format if needed, or adjust state type
            // For now assuming backend returns compatible structure or we map it
            const mappedUsers = response.data.users.map((u: any) => ({
                publicKey: u.walletAddress,
                role: u.role,
                fullName: u.profile?.fullName || "Unknown",
                email: u.profile?.email || "",
                status: u.status || "active",
                joinedAt: new Date(u.createdAt).getTime(),
            }))
            setUsers(mappedUsers)
        } catch (error) {
            console.error("Failed to load users:", error)
            toast.error("Failed to load users")
        } finally {
            setLoadingUsers(false)
        }
    }

    const handleRoleChange = async (publicKey: string, newRole: "admin" | "startup" | "investor") => {
        try {
            await api.user.update(publicKey, { role: newRole })

            setUsers(users.map(u => u.publicKey === publicKey ? { ...u, role: newRole } : u))
            toast.success("Role updated", { description: `User role changed to ${newRole}` })
        } catch (error) {
            console.error("Failed to update role:", error)
            toast.error("Failed to update role")
        }
    }

    const handleStatusChange = async (publicKey: string, newStatus: "active" | "suspended") => {
        try {
            await api.user.update(publicKey, { status: newStatus })

            setUsers(users.map(u => u.publicKey === publicKey ? { ...u, status: newStatus } : u))
            toast.success("Status updated", { description: `User status changed to ${newStatus}` })
        } catch (error) {
            console.error("Failed to update status:", error)
            toast.error("Failed to update status")
        }
    }

    if (isLoading || !isAdmin) {
        return null // Or a loading spinner
    }

    return (
        <main className="min-h-screen bg-background">
            <Navbar isConnected={true} walletAddress={user?.publicKey} />
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-primary/10 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                        <p className="text-muted-foreground">Manage users, roles, and platform settings.</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Active Investors</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.filter(u => u.role === "investor").length}</div>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Startups</CardTitle>
                            <Activity className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{users.filter(u => u.role === "startup").length}</div>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>User Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Joined</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.publicKey}>
                                        <TableCell>
                                            <div className="font-medium">{user.fullName}</div>
                                            <div className="text-xs text-muted-foreground font-mono">{user.publicKey.slice(0, 8)}...</div>
                                        </TableCell>
                                        <TableCell>
                                            <Select
                                                defaultValue={user.role}
                                                onValueChange={(value: any) => handleRoleChange(user.publicKey, value)}
                                            >
                                                <SelectTrigger className="w-[110px] h-8">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="investor">Investor</SelectItem>
                                                    <SelectItem value="startup">Startup</SelectItem>
                                                    <SelectItem value="admin">Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={user.status === "active" ? "default" : "destructive"}>
                                                {user.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-muted-foreground text-sm">
                                            {new Date(user.joinedAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleStatusChange(user.publicKey, user.status === "active" ? "suspended" : "active")}
                                            >
                                                {user.status === "active" ? "Suspend" : "Activate"}
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
