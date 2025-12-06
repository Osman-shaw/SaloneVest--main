"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@/context/user-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Upload, CheckCircle, Shield, FileText, User, Image as ImageIcon, X } from "lucide-react"

export function KYCWizard() {
    const router = useRouter()
    const { updateProfile, user } = useUser()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        dob: "",
        nationality: "",
        tin: "",
        sourceOfFunds: "",
        idFront: null as File | null,
        idBack: null as File | null,
        idFrontPreview: "",
        idBackPreview: "",
        agreedToTerms: false,
    })

    const handleInputChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleFileUpload = async (field: "idFront" | "idBack", file: File) => {
        if (file.size > 5 * 1024 * 1024) {
            toast.error("File too large", { description: "Max 5MB allowed." })
            return
        }

        const reader = new FileReader()
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                [field]: file,
                [`${field}Preview`]: reader.result as string
            }))
            toast.success("File attached", { description: `${field === "idFront" ? "Front" : "Back"} side uploaded.` })
        }
        reader.readAsDataURL(file)
    }

    const removeFile = (field: "idFront" | "idBack") => {
        setFormData((prev) => ({
            ...prev,
            [field]: null,
            [`${field}Preview`]: ""
        }))
    }

    const nextStep = () => {
        if (step === 1) {
            if (!formData.fullName || !formData.dob || !formData.nationality) {
                toast.error("Please fill in all fields")
                return
            }
        }
        if (step === 2) {
            if (!formData.tin || !formData.idFront || !formData.idBack || !formData.sourceOfFunds) {
                toast.error("Please complete all document requirements")
                return
            }
        }
        setStep((prev) => prev + 1)
    }

    const prevStep = () => setStep((prev) => prev - 1)

    const handleSubmit = async () => {
        if (!formData.agreedToTerms) {
            toast.error("Please agree to the terms")
            return
        }

        setLoading(true)
        try {
            // Update user profile with Real KYC data (Base64 content)
            await updateProfile({
                fullName: formData.fullName,
                nationality: formData.nationality,
                tin: formData.tin,
                sourceOfFunds: formData.sourceOfFunds,
                kycStatus: "pending",
                documents: [
                    {
                        type: "ID_Front",
                        name: formData.idFront?.name || "front.jpg",
                        date: new Date().toISOString(),
                        content: formData.idFrontPreview
                    },
                    {
                        type: "ID_Back",
                        name: formData.idBack?.name || "back.jpg",
                        date: new Date().toISOString(),
                        content: formData.idBackPreview
                    }
                ]
            })

            toast.success("Registration Submitted", { description: "Your documents have been securely stored." })
            router.push("/dashboard")
        } catch (error) {
            console.error("KYC Error:", error)
            toast.error("Submission Failed", { description: "Could not save documents." })
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl mx-auto">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8 relative">
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-muted -z-10" />
                {[1, 2, 3].map((s) => (
                    <div key={s} className={`flex flex-col items-center gap-2 bg-background px-2 ${step >= s ? "text-primary" : "text-muted-foreground"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= s ? "border-primary bg-primary text-primary-foreground" : "border-muted bg-background"}`}>
                            {step > s ? <CheckCircle className="w-5 h-5" /> : s}
                        </div>
                        <span className="text-xs font-medium">
                            {s === 1 ? "Personal" : s === 2 ? "Documents" : "Review"}
                        </span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Personal Information"}
                        {step === 2 && "Legal Documents"}
                        {step === 3 && "Review & Submit"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Tell us about yourself to get started."}
                        {step === 2 && "Upload valid ID (Front & Back) and TIN."}
                        {step === 3 && "Review your details and sign."}
                    </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6">
                    {step === 1 && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        value={formData.fullName}
                                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Date of Birth</Label>
                                    <Input
                                        type="date"
                                        value={formData.dob}
                                        onChange={(e) => handleInputChange("dob", e.target.value)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nationality</Label>
                                    <Select onValueChange={(val) => handleInputChange("nationality", val)} value={formData.nationality}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Sierra Leonean">Sierra Leonean</SelectItem>
                                            <SelectItem value="Dual Citizen">Dual Citizen</SelectItem>
                                            <SelectItem value="Foreign Investor">Foreign Investor</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label>Tax Identification Number (TIN)</Label>
                                <div className="relative">
                                    <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Enter your Sierra Leone TIN"
                                        value={formData.tin}
                                        onChange={(e) => handleInputChange("tin", e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* ID Front Upload */}
                                <div className="space-y-2">
                                    <Label>ID Front</Label>
                                    {formData.idFrontPreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                            <img src={formData.idFrontPreview} alt="ID Front" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeFile("idFront")}
                                                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer h-32 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="front-upload"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload("idFront", e.target.files[0])}
                                            />
                                            <label htmlFor="front-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-xs font-medium">Upload Front</span>
                                            </label>
                                        </div>
                                    )}
                                </div>

                                {/* ID Back Upload */}
                                <div className="space-y-2">
                                    <Label>ID Back</Label>
                                    {formData.idBackPreview ? (
                                        <div className="relative aspect-video rounded-lg overflow-hidden border bg-muted">
                                            <img src={formData.idBackPreview} alt="ID Back" className="w-full h-full object-cover" />
                                            <button
                                                onClick={() => removeFile("idBack")}
                                                className="absolute top-2 right-2 p-1 bg-background/80 rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border-2 border-dashed border-muted rounded-lg p-4 text-center hover:bg-muted/50 transition-colors cursor-pointer h-32 flex flex-col items-center justify-center">
                                            <input
                                                type="file"
                                                className="hidden"
                                                id="back-upload"
                                                accept="image/*"
                                                onChange={(e) => e.target.files?.[0] && handleFileUpload("idBack", e.target.files[0])}
                                            />
                                            <label htmlFor="back-upload" className="cursor-pointer flex flex-col items-center gap-2 w-full h-full justify-center">
                                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                                <span className="text-xs font-medium">Upload Back</span>
                                            </label>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Source of Funds</Label>
                                <Select onValueChange={(val) => handleInputChange("sourceOfFunds", val)} value={formData.sourceOfFunds}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Employment">Employment Income</SelectItem>
                                        <SelectItem value="Business">Business Profits</SelectItem>
                                        <SelectItem value="Inheritance">Inheritance</SelectItem>
                                        <SelectItem value="Savings">Savings</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="bg-muted p-4 rounded-lg space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Name:</span>
                                    <span className="font-medium">{formData.fullName}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Nationality:</span>
                                    <span className="font-medium">{formData.nationality}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">TIN:</span>
                                    <span className="font-medium">{formData.tin}</span>
                                </div>
                                <div className="space-y-2 pt-2 border-t">
                                    <span className="text-muted-foreground block mb-2">Documents:</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        {formData.idFrontPreview && (
                                            <div className="relative aspect-video rounded overflow-hidden border">
                                                <img src={formData.idFrontPreview} alt="Front" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 text-center">Front</div>
                                            </div>
                                        )}
                                        {formData.idBackPreview && (
                                            <div className="relative aspect-video rounded overflow-hidden border">
                                                <img src={formData.idBackPreview} alt="Back" className="w-full h-full object-cover" />
                                                <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-[10px] p-1 text-center">Back</div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-2">
                                <Checkbox
                                    id="terms"
                                    checked={formData.agreedToTerms}
                                    onCheckedChange={(checked) => handleInputChange("agreedToTerms", checked)}
                                />
                                <div className="grid gap-1.5 leading-none">
                                    <label
                                        htmlFor="terms"
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    >
                                        I certify that the information provided is true and accurate.
                                    </label>
                                    <p className="text-xs text-muted-foreground">
                                        I agree to SaloneVest's Terms of Service and Privacy Policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={prevStep} disabled={step === 1 || loading}>
                        Back
                    </Button>
                    {step < 3 ? (
                        <Button onClick={nextStep}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={loading} className="gap-2">
                            {loading ? "Submitting..." : (
                                <>
                                    <Shield className="h-4 w-4" /> Submit Application
                                </>
                            )}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    )
}
