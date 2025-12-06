# 🚀 SaloneVest Quick Start Guide

This guide will help you set up and run the SaloneVest platform locally in minutes.

## Prerequisites Checklist

- [ ] Node.js 18.0.0 or higher installed
- [ ] MongoDB installed and running (or MongoDB Atlas account)
- [ ] Phantom Wallet browser extension installed
- [ ] Git installed

Check your Node.js version:
```bash
node --version  # Should be v18.0.0 or higher
```

## Step 1: Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/SaloneVest--main.git
cd SaloneVest--main
```

## Step 2: Setup Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Create environment file
copy .env.example .env  # Windows
# OR
cp .env.example .env    # Mac/Linux
```

Edit `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/salonevest
PORT=5000
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=http://localhost:3000
```

```bash
# Seed the database with sample investments
npm run seed

# Start backend server
npm run dev
```

✅ Backend should be running on `http://localhost:5000`

## Step 3: Setup Frontend (New Terminal)

```bash
# Navigate to frontend (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
copy .env.example .env.local  # Windows
# OR
cp .env.example .env.local    # Mac/Linux
```

Edit `.env.local` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
```

```bash
# Start frontend server
npm run dev
```

✅ Frontend should be running on `http://localhost:3000`

## Step 4: Test the Platform

1. **Open browser**: Navigate to `http://localhost:3000`

2. **Connect Phantom Wallet**:
   - Click "Connect Wallet" button
   - Approve the connection in Phantom
   - Sign the authentication message

3. **Browse Investments**:
   - Go to Dashboard
   - View the 6 seeded investment opportunities
   - Filter by type, category, or risk level

4. **Make a Test Investment** (Optional - Devnet only):
   - Switch Phantom to Devnet
   - Click "Invest Now" on any investment
   - Enter amount and sign transaction

## Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB service
mongod  # Or start MongoDB through your system services
```

### Port Already in Use
```bash
# Backend (port 5000)
PORT=5001 npm run dev

# Frontend (port 3000)
# Edit package.json dev script: "dev": "next dev -p 3001"
```

### Module Not Found Errors
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

- **Add More Investments**: Use the seed script as a template
- **Configure Solana**: Set up your program ID in backend config
- **Deploy**: Follow deployment guides in backend/frontend READMEs
- **Customize**: Update branding, colors, and content

## Useful Commands

### Backend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run seed     # Seed database with sample data
```

### Frontend
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run start      # Start production server
npm run lint       # Lint code
npm run type-check # TypeScript check
```

## Support

- 📧 Email: support@salonevest.io
- 💬 Discord: https://discord.gg/salonevest
- 📖 Full Documentation: See README.md files in each folder

---

**You're all set! Happy investing! 🎉**
