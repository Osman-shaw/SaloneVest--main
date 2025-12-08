# Solana Environment Configuration

Add these variables to your `frontend/.env.local` file:

```env
# Existing
NEXT_PUBLIC_API_URL=http://localhost:5000

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=
NEXT_PUBLIC_USDC_MINT=EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
```

**Note**: `NEXT_PUBLIC_PROGRAM_ID` will be filled in after deploying the Anchor smart contract.

For production (mainnet-beta):
```env
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```
