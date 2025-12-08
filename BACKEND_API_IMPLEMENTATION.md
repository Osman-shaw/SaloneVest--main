# 🔌 Backend API Implementation Guide

## Overview

To fully enable the enhanced dashboard, implement these two API endpoints in your backend:

1. **GET `/api/portfolio`** - Get user's portfolio summary
2. **GET `/api/transactions`** - Get user's transaction history

---

## 1. Portfolio Endpoint

### Route Definition

**File:** `/backend/src/routes/portfolio.ts` (or add to existing routes)

```typescript
import express, { Router, Request, Response } from "express"
import { Portfolio } from "../models/Portfolio"
import { Investment } from "../models/Investment"

const router = Router()

// GET /api/portfolio?walletAddress={address}
router.get("/portfolio", async (req: Request, res: Response) => {
  try {
    const { walletAddress } = req.query

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({
        success: false,
        error: "walletAddress query parameter is required"
      })
    }

    // Fetch user's portfolio
    const portfolio = await Portfolio.findOne({ userId: walletAddress })

    if (!portfolio) {
      // Return default values for new users
      return res.status(200).json({
        success: true,
        data: {
          totalBalance: 0,
          totalInvested: 0,
          activeInvestments: 0,
          expectedReturns: 0
        }
      })
    }

    // Calculate totals from investments
    let totalInvested = 0
    let activeInvestments = 0
    let expectedReturns = 0

    if (portfolio.investments && portfolio.investments.length > 0) {
      activeInvestments = portfolio.investments.length

      for (const investmentId of portfolio.investments) {
        const investment = await Investment.findById(investmentId)
        if (investment) {
          const amount = portfolio.amounts?.[investmentId.toString()] || 0
          totalInvested += amount

          // Calculate expected returns based on ROI
          const roi = parseFloat(investment.expectedYield) / 100
          expectedReturns += amount * roi
        }
      }
    }

    // Get total balance (you might fetch this from Solana blockchain)
    const totalBalance = portfolio.balance || (totalInvested + expectedReturns)

    res.status(200).json({
      success: true,
      data: {
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        totalInvested: parseFloat(totalInvested.toFixed(2)),
        activeInvestments,
        expectedReturns: parseFloat(expectedReturns.toFixed(2))
      }
    })
  } catch (error) {
    console.error("Portfolio fetch error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch portfolio data"
    })
  }
})

export default router
```

### Integration in Server

**File:** `/backend/src/server.ts`

```typescript
import portfolioRoutes from "./routes/portfolio"

// ... other imports

app.use("/api", portfolioRoutes)
```

### Response Format

**Success (200)**
```json
{
  "success": true,
  "data": {
    "totalBalance": 5234.50,
    "totalInvested": 3500.00,
    "activeInvestments": 4,
    "expectedReturns": 892.50
  }
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "walletAddress query parameter is required"
}
```

**Error (500)**
```json
{
  "success": false,
  "error": "Failed to fetch portfolio data"
}
```

---

## 2. Transactions Endpoint

### Route Definition

**File:** `/backend/src/routes/transactions.ts` (or add to existing routes)

```typescript
import express, { Router, Request, Response } from "express"
import { Investment } from "../models/Investment"
import { Portfolio } from "../models/Portfolio"
import { Withdrawal } from "../models/Withdrawal"

interface Transaction {
  id: string
  investmentName: string
  amount: number
  date: string
  status: "pending" | "completed" | "failed"
  type: "investment" | "withdrawal" | "dividend"
}

const router = Router()

// GET /api/transactions?walletAddress={address}&limit=50
router.get("/transactions", async (req: Request, res: Response) => {
  try {
    const { walletAddress, limit = "50" } = req.query

    if (!walletAddress || typeof walletAddress !== "string") {
      return res.status(400).json({
        success: false,
        error: "walletAddress query parameter is required"
      })
    }

    const limitNum = Math.min(parseInt(limit as string) || 50, 100)
    const transactions: Transaction[] = []

    // 1. Fetch investment transactions
    const portfolio = await Portfolio.findOne({ userId: walletAddress })
      .populate("investments")

    if (portfolio?.investments) {
      for (const investment of portfolio.investments) {
        // Get transaction records if you have them
        // For now, we'll create a transaction record from investment data
        transactions.push({
          id: `inv_${investment._id}`,
          investmentName: investment.name,
          amount: portfolio.amounts?.[investment._id?.toString()] || 100,
          date: investment.createdAt || new Date().toISOString(),
          status: "completed",
          type: "investment"
        })
      }
    }

    // 2. Fetch withdrawal transactions
    const withdrawals = await Withdrawal.find({
      userId: walletAddress
    }).sort({ createdAt: -1 }).limit(limitNum)

    for (const withdrawal of withdrawals) {
      transactions.push({
        id: `wd_${withdrawal._id}`,
        investmentName: `Withdrawal to ${withdrawal.paymentMethod}`,
        amount: withdrawal.amount,
        date: withdrawal.createdAt?.toISOString() || new Date().toISOString(),
        status: withdrawal.status as "pending" | "completed" | "failed",
        type: "withdrawal"
      })
    }

    // 3. Add dividend transactions (if you have dividend history)
    // Example structure - adjust based on your schema
    // const dividends = await DividendRecord.find({ userId: walletAddress })

    // 4. Sort all transactions by date (newest first)
    transactions.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Return limited set
    const paginatedTransactions = transactions.slice(0, limitNum)

    res.status(200).json({
      success: true,
      data: {
        transactions: paginatedTransactions,
        total: transactions.length,
        limit: limitNum
      }
    })
  } catch (error) {
    console.error("Transactions fetch error:", error)
    res.status(500).json({
      success: false,
      error: "Failed to fetch transaction history"
    })
  }
})

export default router
```

### Integration in Server

**File:** `/backend/src/server.ts`

```typescript
import transactionRoutes from "./routes/transactions"

// ... other imports

app.use("/api", transactionRoutes)
```

### Response Format

**Success (200)**
```json
{
  "success": true,
  "data": {
    "transactions": [
      {
        "id": "inv_1",
        "investmentName": "Sierra Leone Growth Fund",
        "amount": 500,
        "date": "2025-12-08T14:30:00Z",
        "status": "completed",
        "type": "investment"
      },
      {
        "id": "wd_1",
        "investmentName": "Withdrawal to bank_transfer",
        "amount": 1000,
        "date": "2025-12-05T10:15:00Z",
        "status": "completed",
        "type": "withdrawal"
      },
      {
        "id": "inv_2",
        "investmentName": "Easy Solar Distribution",
        "amount": 150,
        "date": "2025-12-03T08:45:00Z",
        "status": "completed",
        "type": "investment"
      }
    ],
    "total": 47,
    "limit": 50
  }
}
```

**Error (400)**
```json
{
  "success": false,
  "error": "walletAddress query parameter is required"
}
```

---

## 3. Alternative: Minimal Implementation

If you want a quick version without full database integration:

### Simple Portfolio Endpoint

```typescript
router.get("/portfolio", (req: Request, res: Response) => {
  const { walletAddress } = req.query

  // Return mock data for now
  res.status(200).json({
    success: true,
    data: {
      totalBalance: 5234.50,
      totalInvested: 3500.00,
      activeInvestments: 4,
      expectedReturns: 892.50
    }
  })
})
```

### Simple Transactions Endpoint

```typescript
router.get("/transactions", (req: Request, res: Response) => {
  const { walletAddress } = req.query

  // Return mock transactions
  res.status(200).json({
    success: true,
    data: {
      transactions: [
        {
          id: "tx_1",
          investmentName: "Sierra Leone Growth Fund",
          amount: 500,
          date: new Date().toISOString(),
          status: "completed",
          type: "investment"
        }
      ],
      total: 1,
      limit: 50
    }
  })
})
```

---

## 4. Database Models Needed

### Portfolio Model

```typescript
// /backend/src/models/Portfolio.ts
import mongoose from "mongoose"

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    investments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Investment"
      }
    ],
    amounts: {
      type: Map,
      of: Number,
      default: new Map()
    },
    balance: {
      type: Number,
      default: 0
    },
    totalReturns: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
)

export const Portfolio = mongoose.model("Portfolio", portfolioSchema)
```

### Withdrawal Model (Already Created)

Already exists at `/backend/src/models/Withdrawal.ts`

---

## 5. Testing the Endpoints

### Using cURL

```bash
# Test Portfolio Endpoint
curl "http://localhost:5000/api/portfolio?walletAddress=EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn"

# Test Transactions Endpoint
curl "http://localhost:5000/api/transactions?walletAddress=EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn&limit=10"
```

### Using Postman

1. **Create Collection:** SaloneVest API
2. **Add Request 1:**
   - Method: GET
   - URL: `http://localhost:5000/api/portfolio?walletAddress=EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn`
   - Test and verify response

3. **Add Request 2:**
   - Method: GET
   - URL: `http://localhost:5000/api/transactions?walletAddress=EPjFWaYbxUqkfJzaGEHqJpzUa8CJe3Rbn`
   - Test and verify response

### Using Frontend

The dashboard will automatically fetch these endpoints when you connect your wallet.

---

## 6. Error Handling

### Implement Error Responses

```typescript
// Generic error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err)
  res.status(err.status || 500).json({
    success: false,
    error: err.message || "Internal server error"
  })
})
```

### Common Status Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (missing walletAddress) |
| 401 | Unauthorized (invalid wallet) |
| 404 | Not found |
| 500 | Server error |

---

## 7. Performance Optimization

### Add Caching

```typescript
import redis from "redis"

const client = redis.createClient()

router.get("/portfolio", async (req: Request, res: Response) => {
  const { walletAddress } = req.query
  const cacheKey = `portfolio:${walletAddress}`

  // Check cache
  const cached = await client.get(cacheKey)
  if (cached) {
    return res.json(JSON.parse(cached))
  }

  // Fetch from DB
  const data = await fetchPortfolioData(walletAddress as string)

  // Cache for 5 minutes
  await client.setEx(cacheKey, 300, JSON.stringify(data))

  res.json(data)
})
```

### Add Rate Limiting

```typescript
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // 100 requests per window
})

app.use("/api/", limiter)
```

---

## 8. Deployment Checklist

- ✅ Create `/api/portfolio` endpoint
- ✅ Create `/api/transactions` endpoint
- ✅ Add error handling
- ✅ Test with sample data
- ✅ Verify CORS headers (allow frontend origin)
- ✅ Add rate limiting
- ✅ Add caching for performance
- ✅ Deploy to production
- ✅ Monitor for errors

---

## 📚 Related Files

- **DASHBOARD_FEATURES.md** - Dashboard feature documentation
- **DASHBOARD_QUICK_START.md** - Dashboard quick start guide
- **Dashboard Page:** `/frontend/app/dashboard/page.tsx`
- **Components:**
  - `/frontend/components/account-summary.tsx`
  - `/frontend/components/portfolio-summary.tsx`
  - `/frontend/components/recent-transactions.tsx`

---

## 🚀 Quick Start

1. **Copy portfolio endpoint code** into your backend
2. **Copy transactions endpoint code** into your backend
3. **Update server.ts** to import routes
4. **Test endpoints** with cURL or Postman
5. **Start backend** and frontend
6. **Connect wallet** on dashboard
7. **Verify data** displays correctly

**Status:** Ready to implement! 🎉

