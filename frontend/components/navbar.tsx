"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import WalletConnect from "./wallet-connect"
import { ApiConnectionStatus } from "./api-connection-status"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu, X, Wallet } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationCenter } from "@/components/notifications/notification-center"
import { useBalance } from "@/hooks/use-balance"
import { Notifications } from "@/components/notifications"
import { useUser } from "@/context/user-context"

interface NavbarProps {
  isConnected: boolean
  walletAddress?: string | null
}

export function Navbar({ isConnected, walletAddress }: NavbarProps) {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { formatted, loading } = useBalance(walletAddress || null)
  const { isAdmin } = useUser()

  const handleDisconnect = () => {
    // Clear wallet connection
    localStorage.removeItem('walletAddress')
    localStorage.removeItem('walletConnected')
    
    // Close dropdown
    setIsMobileMenuOpen(false)
    
    // Redirect to home
    router.push('/')
  }

  const navigationLinks = isConnected
    ? [
      { href: "/dashboard", label: "🔍 Discover" },
      { href: "/portfolio", label: "📊 Portfolio" },
      { href: "/remit", label: "💸 Remit" },
      { href: "/sandbox", label: "🧪 Sandbox" },
      { href: "/profile", label: "👤 Profile" },
      { href: "/legal", label: "⚖️ Legal" },
      // Add Admin links if user is admin
      ...(isAdmin ? [
        { href: "/admin/withdrawals", label: "💰 Withdrawals" },
        { href: "/admin", label: "⚙️ Admin" }
      ] : []),
    ]
    : [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How It Works" },
      { href: "/legal", label: "Legal" },
      { href: "#faq", label: "FAQ" },
    ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="rounded-lg bg-primary p-2">
              <div className="h-6 w-6 bg-primary-foreground rounded" />
            </div>
            <span className="text-xl font-bold text-foreground">SaloneVest</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:gap-8">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4">
            {/* API Connection Status */}
            <ApiConnectionStatus />
            
            {/* Wallet and user menu */}
            {isConnected ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Wallet className="h-4 w-4" />
                    {/* {publicKey?.slice(0, 4)}...{publicKey?.slice(-4)} */}
                    <span className="text-sm font-medium">
                      {loading ? "..." : formatted}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>
                    <Link href="/profile" className="w-full">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDisconnect}>
                    Disconnect
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <WalletConnect isConnected={isConnected} />
            )}
            {/* <ModeToggle /> */} {/* Placeholder for ModeToggle */}
            {isConnected && walletAddress && <Notifications walletAddress={walletAddress} />}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* <NotificationCenter /> */} {/* Placeholder for NotificationCenter */}
            {/* <ModeToggle /> */} {/* Placeholder for ModeToggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-2">
            {navigationLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="px-4 pt-2 sm:hidden">
              <WalletConnect isConnected={isConnected} />
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
