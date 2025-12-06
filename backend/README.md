# SaloneVest Backend

Backend API server for SaloneVest - A diaspora investment platform for Sierra Leone opportunities using USDC on Solana blockchain.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Blockchain**: Solana Web3.js
- **Authentication**: Phantom Wallet signature verification with tweetnacl

## Features

- 🔐 Wallet-based authentication (non-custodial)
- 💼 Investment opportunity management
- 📊 Portfolio tracking and performance
- 💰 Transaction recording and verification
- 🔗 Solana blockchain integration

## Quick Start

### Prerequisites

- Node.js >= 18.0.0
- MongoDB running locally or connection URI
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# MONGODB_URI, SOLANA_RPC_URL, etc.
```

### Running the Server

```bash
# Development mode (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/connect` - Connect and authenticate wallet

### User Management
- `GET /api/user/:walletAddress` - Get user profile
- `PUT /api/user/:walletAddress` - Update user profile

### Investments
- `GET /api/investments` - List all investments (with filters)
- `GET /api/investments/:id` - Get specific investment
- `POST /api/investments/transaction` - Create investment transaction

### Portfolio
- `GET /api/portfolio/:walletAddress` - Get user portfolio
- `GET /api/portfolio/:walletAddress/performance` - Get performance data
- `GET /api/portfolio/:walletAddress/transactions` - Get transaction history

### Health Check
- `GET /health` - Server health status

## Environment Variables

```env
MONGODB_URI=mongodb://localhost:27017/salonevest
PORT=5000
SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
FRONTEND_URL=http://localhost:3000
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Database and blockchain config
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── controllers/     # Business logic
│   ├── middleware/      # Auth and validation
│   ├── utils/          # Helper functions
│   └── server.ts        # Express server entry
├── package.json
├── tsconfig.json
└── .env.example
```

## License

MIT
