"use client"

import { UserProvider } from "@/context/user-context"
import { Toaster } from "sonner"

export function AppProviders({ children }: { children: React.ReactNode }) {
    return (
        <>
            <UserProvider>{children}</UserProvider>
            <Toaster closeButton position="top-center" richColors />
        </>
    )
}
