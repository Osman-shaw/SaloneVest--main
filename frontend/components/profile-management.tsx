"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, LogOut, Shield } from "lucide-react"

export function ProfileManagement() {
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    location: "New York, USA",
    investmentGoal: "Balanced Growth",
    riskTolerance: "Moderate",
  })

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleDisconnect = () => {
    localStorage.removeItem("walletConnected")
    localStorage.removeItem("publicKey")
    router.push("/")
  }

  const publicKey = typeof window !== "undefined" ? localStorage.getItem("publicKey") || "0x..." : "0x..."

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
      <div className="space-y-6 md:space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Profile Settings</h1>
          <p className="text-base md:text-lg text-muted-foreground">Manage your account and investment preferences</p>
        </div>

        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>Your Phantom wallet information</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Public Key</label>
              <div className="bg-muted px-4 py-3 rounded-lg font-mono text-xs md:text-sm text-muted-foreground break-all">
                {publicKey}
              </div>
            </div>
            <Button onClick={handleDisconnect} variant="destructive" className="rounded-lg h-10 md:h-11 gap-2">
              <LogOut className="h-4 w-4" />
              Disconnect Wallet
            </Button>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your profile details</CardDescription>
              </div>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                variant={isEditing ? "destructive" : "outline"}
                className="rounded-lg h-10 md:h-11 w-full md:w-auto"
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Full Name</label>
              <Input
                type="text"
                value={profile.fullName}
                onChange={(e) => handleInputChange("fullName", e.target.value)}
                disabled={!isEditing}
                className="rounded-lg h-10 md:h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Email</label>
              <Input
                type="email"
                value={profile.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                disabled={!isEditing}
                className="rounded-lg h-10 md:h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Location</label>
              <Input
                type="text"
                value={profile.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                disabled={!isEditing}
                className="rounded-lg h-10 md:h-11"
              />
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg h-11"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Preferences</CardTitle>
            <CardDescription>Customize your investment strategy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Investment Goal</label>
              <select
                value={profile.investmentGoal}
                onChange={(e) => handleInputChange("investmentGoal", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option>Conservative</option>
                <option>Balanced Growth</option>
                <option>Aggressive Growth</option>
                <option>Income Generation</option>
                <option>Impact Investing</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Risk Tolerance</label>
              <select
                value={profile.riskTolerance}
                onChange={(e) => handleInputChange("riskTolerance", e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 md:px-4 py-2.5 md:py-3 rounded-lg border border-border bg-background text-foreground text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <option>Low</option>
                <option>Moderate</option>
                <option>High</option>
              </select>
            </div>

            {isEditing && (
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full bg-primary hover:bg-accent text-primary-foreground font-semibold rounded-lg h-11"
              >
                {isSaving ? "Saving..." : "Save Preferences"}
              </Button>
            )}
          </CardContent>
        </Card>

        {/* Account Security */}
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950/30">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-1 flex-shrink-0" />
              <div>
                <CardTitle className="text-yellow-900 dark:text-yellow-100">Account Security</CardTitle>
                <CardDescription className="text-yellow-800 dark:text-yellow-200">
                  Manage your account security
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-100">
              Account security on SaloneVest is managed by your Phantom wallet. Since we are non-custodial, all security
              measures are handled by your wallet provider.
            </p>
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/50 border border-yellow-300 dark:border-yellow-700 p-3">
              <p className="text-xs md:text-sm text-yellow-900 dark:text-yellow-200">
                <span className="font-semibold">Security Tip:</span> Never share your Phantom wallet seed phrase or
                private key with anyone, including SaloneVest staff.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
