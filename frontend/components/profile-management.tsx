"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AlertCircle, LogOut, Shield, Save, User, Wallet } from "lucide-react"
import { toast } from "sonner"
import { useUser } from "@/context/user-context"
import { ReferralSystem } from "@/components/referral/referral-system"

export function ProfileManagement() {
  const { user, updateProfile, logout } = useUser()

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    location: "",
    investmentGoal: "",
    riskTolerance: "",
  })

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        location: (user as any).location || "", // Add location to UserRecord type if needed
        investmentGoal: (user as any).investmentGoal || "",
        riskTolerance: (user as any).riskTolerance || "",
      })
    }
  }, [user])

  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await updateProfile(formData)
    setIsEditing(false)
    setIsSaving(false)
  }

  const handleDisconnect = () => {
    logout()
    router.push("/")
  }

  const publicKey = user?.publicKey || "0x..."

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground text-pretty">Profile Settings</h1>
        <p className="text-base md:text-lg text-muted-foreground">Manage your account, investment preferences, and security.</p>
      </div>

      <div className="grid gap-6">
        {/* Wallet Connection */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Wallet Connection</CardTitle>
                <CardDescription>Your connected Phantom wallet</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Public Key</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-muted px-4 py-3 rounded-lg font-mono text-xs md:text-sm text-muted-foreground break-all border border-border">
                  {publicKey}
                </div>
                <Button onClick={handleDisconnect} variant="destructive" size="icon" className="h-11 w-11 shrink-0" title="Disconnect">
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your contact details</CardDescription>
                </div>
              </div>
              <Button
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                variant={isEditing ? "ghost" : "outline"}
                size="sm"
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-foreground">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Investment Preferences */}
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <CardTitle>Investment Profile</CardTitle>
                <CardDescription>Customize your strategy and risk tolerance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Investment Goal</label>
                <Select
                  disabled={!isEditing}
                  value={formData.investmentGoal}
                  onValueChange={(value) => handleInputChange("investmentGoal", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="Balanced Growth">Balanced Growth</SelectItem>
                    <SelectItem value="Aggressive Growth">Aggressive Growth</SelectItem>
                    <SelectItem value="Income Generation">Income Generation</SelectItem>
                    <SelectItem value="Impact Investing">Impact Investing</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Risk Tolerance</label>
                <Select
                  disabled={!isEditing}
                  value={formData.riskTolerance}
                  onValueChange={(value) => handleInputChange("riskTolerance", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {isEditing && (
              <div className="pt-4 flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="gap-2">
                  {isSaving ? (
                    "Saving..."
                  ) : (
                    <>
                      <Save className="h-4 w-4" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>



        {/* Referral Program */}
        <ReferralSystem />

        {/* Account Security */}
        <Card className="border-yellow-200 dark:border-yellow-800 bg-yellow-50/50 dark:bg-yellow-950/20">
          <CardHeader>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/40 rounded-lg">
                <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <CardTitle className="text-yellow-900 dark:text-yellow-100">Security Information</CardTitle>
                <CardDescription className="text-yellow-800 dark:text-yellow-200">
                  Important security details for your account
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-yellow-900 dark:text-yellow-100 leading-relaxed">
              Your security on SaloneVest is tied directly to your Phantom wallet. As a non-custodial platform, we never have access to your private keys or funds directly.
            </p>
            <div className="rounded-lg bg-yellow-100 dark:bg-yellow-900/40 border border-yellow-200 dark:border-yellow-800 p-4">
              <div className="flex gap-2">
                <Shield className="h-5 w-5 text-yellow-700 dark:text-yellow-300 shrink-0" />
                <p className="text-sm text-yellow-900 dark:text-yellow-100 font-medium">
                  Never share your wallet's seed phrase with anyone. SaloneVest support will never ask for it.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div >
  )
}
