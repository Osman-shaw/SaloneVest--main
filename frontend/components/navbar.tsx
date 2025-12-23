"use client"

import Link from "next/link"
import { useState } from "react"
import { WalletConnect } from "./wallet-connect"
import { Menu, X, Wallet } from "lucide-react"
import { useBalance } from "@/hooks/use-balance"
import { Notifications } from "@/components/notifications"

interface NavbarProps {
  isConnected: boolean
  walletAddress?: string | null
}

export function Navbar({ isConnected, walletAddress }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { formatted, loading } = useBalance(walletAddress || null)

  const navigationLinks = isConnected
    ? [
      { href: "/dashboard", label: "Discover" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/profile", label: "Profile" },
      { href: "/legal", label: "Legal" },
      // Add Admin link if wallet matches admin (hardcoded for demo)
      ...(walletAddress === 'AdminWalletAddress' ? [{ href: "/admin", label: "Admin" }] : []),
    ]
    : [
      { href: "#features", label: "Features" },
      { href: "#how-it-works", label: "How It Works" },
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

          <div className="flex items-center gap-4">
            {isConnected && walletAddress && (
              <>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                  <Wallet className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    {loading ? "..." : formatted}
                  </span>
                </div>
                <Notifications walletAddress={walletAddress} />
              </>
            )}
            <div className="hidden sm:block">
              <WalletConnect isConnected={isConnected} />
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-muted rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
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
