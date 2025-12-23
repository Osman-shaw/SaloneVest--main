# SaloneVest

> Diaspora investment platform for Sierra Leone opportunities using USDC on Solana blockchain

SaloneVest is a **mobile-first decentralized application (DApp)** that enables diaspora investors to fund vetted Sierra Leonean opportunities using USDC stablecoin on the Solana blockchain. The platform eliminates traditional remittance fees (from 7-10% to $0.001) and provides complete transparency through blockchain technology.

## 🎯 Key Features

- **Zero Remittance Fees**: Blockchain transactions cost less than a penny
- **Non-Custodial Security**: Your keys, your crypto - powered by Phantom Wallet
- **USDC Denominated**: Protect investments from local currency volatility
- **Vetted Opportunities**: Invest in startups, bonds, and funds
- **Real-Time Portfolio**: Track holdings and returns in real-time
- **Mobile-First**: Fully responsive design for any device

## 🏗️ Architecture

This project is split into two separate applications:

### Frontend (Next.js)
- Port: `3000`
- Mobile-first React application
- Phantom wallet integration
- Real-time portfolio tracking

### Backend (Express + MongoDB)
- Port: `5000`
- RESTful API
- MongoDB database
- Solana blockchain integration

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/SaloneVest--main.git
cd SaloneVest--main
```

2. **Setup Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI
npm run dev
```

Backend will run on `http://localhost:5000`

3. **Setup Frontend** (in a new terminal)
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with backend URL
npm run dev
```

Frontend will run on `http://localhost:3000`

## 📁 Project Structure

```
SaloneVest--main/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/      # DB and blockchain config
│   │   ├── models/      # MongoDB models
│   │   ├── routes/      # API routes
│   │   ├── controllers/ # Business logic
│   │   └── server.ts    # Entry point
│   └── package.json
│
├── frontend/            # Next.js application
│   ├── app/            # Next.js pages
│   ├── components/     # React components
│   ├── lib/           # API client & utilities
│   └── package.json
│
└── README.md           # This file
```

## 🔧 Environment Variables

### Backend (.env)
```env
MONGODB_URI=mongodb://localhost:27017/salonevest
PORT=5000
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

## 📚 API Documentation

### Authentication
- `POST /api/auth/connect` - Wallet authentication

### Investments
- `GET /api/investments` - List investments
- `GET /api/investments/:id` - Get investment details
- `POST /api/investments/transaction` - Create transaction

### Portfolio
- `GET /api/portfolio/:walletAddress` - Get portfolio
- `GET /api/portfolio/:walletAddress/performance` - Performance data
- `GET /api/portfolio/:walletAddress/transactions` - Transaction history

### User
- `GET /api/user/:walletAddress` - Get user profile
- `PUT /api/user/:walletAddress` - Update profile

## 🛠️ Tech Stack

**Frontend:**
- Next.js 16, React 19, TypeScript
- Tailwind CSS v4, Shadcn/UI
- Solana Web3.js, Phantom Wallet
- Axios, Recharts

**Backend:**
- Node.js, Express, TypeScript
- MongoDB, Mongoose
- Solana Web3.js
- TweetNaCl (signature verification)

## 🌐 Deployment

### Frontend
Deploy to Vercel (recommended):
```bash
cd frontend
vercel deploy
```

### Backend
Deploy to Railway, Render, or Heroku:
```bash
cd backend
npm run build
# Follow your platform's deployment guide
```

## 📄 License

MIT License - Open source and community-driven

## 🤝 Contributing

Contributions are welcome! Please read the contributing guidelines before submitting PRs.

## 📞 Support

- Email: support@salonevest.io
- Discord: https://discord.gg/salonevest

---

**Built with ❤️ for the Sierra Leone diaspora community**
