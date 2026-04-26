/**
 * Peeap embed SDK (https://checkout.peeap.com/embed/peeap-sdk.js)
 * Sierra Leone: use currency SLE (New Leone), not SLL.
 */
export type PeeapCurrency = "SLE"

export interface PeeapCreatePayment {
  amount: number
  currency: PeeapCurrency
  description: string
  reference?: string
}

export interface PeeapSDKGlobal {
  init: (config: {
    publicKey: string
    baseUrl: string
    onSuccess?: (payment: { reference?: string; [k: string]: unknown }) => void
    onError?: (error: { message: string; [k: string]: unknown }) => void
    onCancel?: () => void
  }) => void
  createPayment: (opts: PeeapCreatePayment) => void
}

declare global {
  interface Window {
    PeeapSDK?: PeeapSDKGlobal
  }
}

export {}
