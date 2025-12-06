# Quick Start Guide - SaloneVest

Get up and running with SaloneVest in 5 minutes.

## Prerequisites

- Node.js 18+ (download from nodejs.org)
- npm or yarn package manager
- Phantom Wallet browser extension
- Solana devnet or mainnet account

## 1. Installation (1 minute)

\`\`\`bash
# Clone the repository
git clone https://github.com/saloneVest/platform.git
cd saloneVest

# Install dependencies
npm install

# Or with yarn
yarn install
\`\`\`

## 2. Environment Setup (1 minute)

\`\`\`bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local with your values
# Default values work for development
\`\`\`

## 3. Start Development Server (1 minute)

\`\`\`bash
npm run dev

# Server starts at http://localhost:3000
\`\`\`

## 4. Install Phantom Wallet (1 minute)

1. Visit [phantom.app](https://phantom.app)
2. Install browser extension
3. Create or import wallet
4. Connect to Solana devnet (or mainnet)

## 5. Connect and Explore (1 minute)

1. Go to http://localhost:3000
2. Click "Connect Phantom Wallet"
3. Approve connection in Phantom
4. Browse investment opportunities
5. Test transaction flow

## Common Commands

\`\`\`bash
# Development
npm run dev              # Start dev server

# Building
npm run build           # Build for production
npm start              # Start production server

# Code quality
npm run lint           # Check for linting errors
npm run type-check    # Check TypeScript types
npm run format        # Format code with Prettier

# Testing
npm test              # Run tests
npm run test:watch   # Watch mode
\`\`\`

## Project Structure Overview

\`\`\`
saloneVest/
├── app/                # Next.js app routes
│   ├── page.tsx       # Landing page
│   ├── dashboard/     # Investment discovery
│   ├── portfolio/     # Holdings dashboard
│   └── profile/       # User settings
├── components/        # React components
├── lib/              # Utilities and helpers
├── hooks/            # Custom React hooks
└── public/           # Static assets
\`\`\`

## Key Files to Know

- **app/globals.css** - Design tokens and theme
- **lib/solana-utils.ts** - Blockchain interactions
- **hooks/use-wallet.ts** - Phantom wallet integration
- **components/investment-dashboard.tsx** - Main discovery page

## Next Steps

1. **Explore Components**
   - Check components folder
   - Review shadcn/ui usage
   - Understand data flow

2. **Understand Blockchain Integration**
   - Read lib/solana-utils.ts
   - Review Phantom wallet integration
   - Test transactions on devnet

3. **Customize for Your Needs**
   - Update branding/colors
   - Modify investment data
   - Add your features

4. **Deploy**
   - Read DEPLOYMENT.md
   - Set up Vercel (recommended)
   - Configure environment variables

## Troubleshooting

### Phantom not detected
- Ensure extension is installed
- Refresh the page
- Check network connection

### Build fails
- Clear cache: \`rm -rf .next\`
- Reinstall deps: \`npm install\`
- Check Node.js version: \`node --version\`

### Port already in use
\`\`\`bash
# Use different port
npm run dev -- -p 3001
\`\`\`

## Get Help

- **Discord**: https://discord.gg/saloneVest
- **Email**: support@saloneVest.io
- **Docs**: https://docs.saloneVest.io
- **Issues**: https://github.com/saloneVest/platform/issues

## What's Next?

- Customize investment listings
- Integrate with backend API
- Add user authentication
- Deploy to production

---

Happy building with SaloneVest! 🚀
