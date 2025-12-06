import { toast } from "sonner"

export const EmailService = {
    send: async (to: string, subject: string, body: string) => {
        console.log(`[EmailService] Sending email to ${to}`)
        console.log(`[EmailService] Subject: ${subject}`)
        console.log(`[EmailService] Body: ${body}`)

        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 800))
        return true
    },

    sendInvestmentConfirmation: async (email: string, amount: number, asset: string) => {
        await EmailService.send(
            email,
            "Investment Confirmation - SaloneVest",
            `Thank you for your investment of $${amount} in ${asset}.`
        )
        toast.success("Confirmation Email Sent", {
            description: `Receipt sent to ${email}`
        })
    },

    sendDividendNotification: async (email: string, amount: number, source: string) => {
        await EmailService.send(
            email,
            "You received a dividend!",
            `You have received a dividend payment of $${amount} from ${source}.`
        )
    },

    sendSecurityAlert: async (email: string, device: string) => {
        await EmailService.send(
            email,
            "New Login Detected",
            `We detected a new login from ${device}. If this wasn't you, please contact support.`
        )
    }
}
