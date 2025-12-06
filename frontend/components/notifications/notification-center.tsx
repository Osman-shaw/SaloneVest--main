"use client"

import { useState, useEffect } from "react"
import { Bell, Check, Mail, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

type NotificationType = "info" | "success" | "warning"

interface Notification {
    id: string
    title: string
    message: string
    type: NotificationType
    read: boolean
    timestamp: number
}

// Mock Email Service
const sendEmailNotification = async (to: string, subject: string, body: string) => {
    console.log(`[EmailService] Sending email to ${to}: ${subject}`)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
}

export function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([
        {
            id: "1",
            title: "Dividend Received",
            message: "You received $45.20 from Lion Mountain Ag.",
            type: "success",
            read: false,
            timestamp: Date.now() - 1000 * 60 * 60 * 2 // 2 hours ago
        },
        {
            id: "2",
            title: "New Investment Opportunity",
            message: "Freetown Tech Hub is now open for funding.",
            type: "info",
            read: false,
            timestamp: Date.now() - 1000 * 60 * 60 * 24 // 1 day ago
        },
        {
            id: "3",
            title: "Security Alert",
            message: "New login detected from a new device.",
            type: "warning",
            read: true,
            timestamp: Date.now() - 1000 * 60 * 60 * 48 // 2 days ago
        }
    ])

    const unreadCount = notifications.filter(n => !n.read).length

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
    }

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    }

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "success": return <Check className="h-4 w-4 text-green-500" />
            case "warning": return <AlertTriangle className="h-4 w-4 text-yellow-500" />
            default: return <Info className="h-4 w-4 text-blue-500" />
        }
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            variant="destructive"
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] rounded-full"
                        >
                            {unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel className="flex justify-between items-center">
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                        <Button variant="ghost" size="sm" className="text-xs h-auto p-1" onClick={markAllAsRead}>
                            Mark all read
                        </Button>
                    )}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <ScrollArea className="h-[300px]">
                    {notifications.length === 0 ? (
                        <div className="p-4 text-center text-muted-foreground text-sm">
                            No notifications
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1 p-1">
                            {notifications.map((notification) => (
                                <DropdownMenuItem
                                    key={notification.id}
                                    className={`flex flex-col items-start gap-1 p-3 cursor-pointer ${!notification.read ? "bg-muted/50" : ""}`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex w-full gap-2">
                                        <div className="mt-0.5">{getIcon(notification.type)}</div>
                                        <div className="flex-1 space-y-1">
                                            <p className={`text-sm font-medium leading-none ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground line-clamp-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70">
                                                {new Date(notification.timestamp).toLocaleDateString()}
                                            </p>
                                        </div>
                                        {!notification.read && (
                                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                        )}
                                    </div>
                                </DropdownMenuItem>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                <DropdownMenuSeparator />
                <div className="p-2">
                    <Button variant="outline" className="w-full text-xs h-8 gap-2">
                        <Mail className="h-3 w-3" />
                        Manage Email Preferences
                    </Button>
                </div>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
