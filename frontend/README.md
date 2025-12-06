# SaloneVest Frontend

Modern, mobile-first web application for diaspora investment into Sierra Leone opportunities using USDC on Solana blockchain.

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **UI Library**: React 19
- **Styling**: Tailwind CSS v4
- **Components**: Shadcn/UI
- **Language**: TypeScript
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Blockchain**: Solana Web3.js + Phantom Wallet

## Features

- 🔐 Non-custodial Phantom wallet authentication
- 💼 Investment discovery and filtering
- 📊 Real-time portfolio tracking
- 💰 USDC-based transactions
- 📱 Mobile-first responsive design
- 🌐 Offline support with IndexedDB

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- Backend API running on port 5000
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local with your configuration
# NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Running the App

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The app will be available at `http://localhost:3000`

## Environment Variables

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

## Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
├── components/          # React components
├── hooks/              # Custom React hooks
├── lib/                # Utilities and API client
├── public/             # Static assets
├── styles/             # Global styles
├── package.json
├── next.config.mjs
└── tsconfig.json
```

## Key Pages

- `/` - Landing page with wallet connection
- `/dashboard` - Investment discovery and browsing
- `/portfolio` - Portfolio holdings and performance
- `/profile` - User settings and preferences
- `/legal` - Terms and risk disclosure

## Development

```bash
# Run development server
npm run dev

# Type checking
npm run type-check

# Lint code
npm run lint

# Format code
npm run format
```

## Deployment

This app is optimized for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

Alternatively, you can deploy to any Node.js hosting platform.

## License

MIT
