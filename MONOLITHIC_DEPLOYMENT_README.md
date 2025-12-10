# SaloneVest - Monolithic Deployment

Production-ready Docker deployment for SaloneVest with integrated frontend, backend, database, and blockchain integration.

## 🚀 Quick Start (2 minutes)

```powershell
cd D:\SaloneVest--main

# Configure environment (first time only)
Copy-Item .env.example .env
notepad .env  # Edit with your settings

# Deploy all services
.\deploy-monolithic.ps1

# View status
.\deploy-monolithic.ps1 status
```

## 📦 What Gets Deployed

| Service | Container | Port | Purpose |
|---------|-----------|------|---------|
| **Frontend** | Next.js | 3000 | SaloneVest dApp |
| **Backend** | Express.js | 5000 | REST API |
| **Database** | MongoDB | 27017 | Data persistence |
| **Proxy** | Nginx | 80/443 | Load balancer & SSL |
| **Blockchain** | Solana | RPC | Smart contracts |

## 🏗️ Architecture

```
Internet (HTTPS)
     │
     ▼
  Nginx (443)
   ├─ /api/*  → Backend (5000)
   └─ /*      → Frontend (3000)
        │
        └─ Database (MongoDB 27017)
             │
             └─ Solana Blockchain (RPC)
```

## 📋 Prerequisites

- ✅ **Docker Desktop** - https://docker.com/products/docker-desktop
- ✅ **Docker Compose** (included with Docker Desktop)
- ✅ **PowerShell 5.0+**
- ✅ **4GB RAM** minimum
- ✅ **10GB disk space**

## 🔧 Installation

### 1. Verify Docker Installation

```powershell
docker --version
docker-compose --version
```

### 2. Configure Environment

```powershell
# Navigate to project root
cd D:\SaloneVest--main

# Copy template
Copy-Item .env.example .env

# Edit configuration
notepad .env
```

**Key settings to update:**

```env
# Blockchain
PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID
SOLANA_RPC_URL=https://api.devnet.solana.com

# Security
JWT_SECRET=generate-strong-random-secret
MONGO_ROOT_PASSWORD=strong-database-password

# API
CORS_ORIGIN=http://localhost:3000
```

### 3. Deploy Services

```powershell
# Start all services (builds automatically)
.\deploy-monolithic.ps1 up

# Or with rebuild
.\deploy-monolithic.ps1 up -Build
```

### 4. Verify Deployment

```powershell
# Check status
.\deploy-monolithic.ps1 status

# View logs
.\deploy-monolithic.ps1 logs
```

## 🌐 Access Services

| Service | URL | Username | Password |
|---------|-----|----------|----------|
| Frontend | https://localhost:3000 | - | - |
| Backend | https://localhost:5000 | - | - |
| Nginx | https://localhost | - | - |
| MongoDB | mongodb://localhost:27017 | admin | salonevest123 |

## 📜 Deployment Commands

```powershell
# Start services
.\deploy-monolithic.ps1 up

# Build images
.\deploy-monolithic.ps1 build

# Show status
.\deploy-monolithic.ps1 status

# View logs (live)
.\deploy-monolithic.ps1 logs

# Restart services
.\deploy-monolithic.ps1 restart

# Stop services
.\deploy-monolithic.ps1 down

# Clean up (remove volumes)
.\deploy-monolithic.ps1 clean
```

## 🔐 SSL Certificates

Development uses self-signed certificates. For production:

```powershell
# Generate self-signed certificate (development)
openssl req -x509 -newkey rsa:4096 `
  -keyout nginx\ssl\key.pem `
  -out nginx\ssl\cert.pem `
  -days 365 -nodes `
  -subj "/CN=localhost"

# For production, replace with proper certificates from Let's Encrypt or your CA
```

## 🗄️ Database Configuration

MongoDB is automatically initialized with:
- **Database:** salonevest
- **Username:** admin
- **Password:** salonevest123 (change in .env)

### Database Operations

```powershell
# Connect to MongoDB
docker-compose exec mongodb mongosh -u admin -p salonevest123

# Create backup
docker-compose exec mongodb mongodump --out /backup

# Restore backup
docker-compose exec mongodb mongorestore /backup
```

## 🔗 Blockchain Integration

### Deploy Smart Contract

```powershell
cd anchor

# Build (using Docker or local Anchor)
pwsh build-anchor.ps1 build
pwsh build-anchor.ps1 compile
pwsh build-anchor.ps1 deploy

# Note program ID from output
cd ..

# Update .env with PROGRAM_ID
```

### Fund Test Wallet (Devnet)

```powershell
# Inside backend container
docker-compose exec backend bash

# Create wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Set network
solana config set --url https://api.devnet.solana.com

# Get free SOL
solana airdrop 2

# Check balance
solana balance

exit
```

## 🐛 Troubleshooting

### Container won't start

```powershell
# Check logs
.\deploy-monolithic.ps1 logs

# Rebuild
docker-compose build --no-cache [service_name]

# Restart
docker-compose restart [service_name]
```

### Port already in use

```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 3000

# Kill the process (replace PID)
Stop-Process -Id [PID] -Force
```

### MongoDB connection errors

```powershell
# Restart MongoDB
docker-compose restart mongodb

# Check logs
docker-compose logs mongodb

# Reset (WARNING: deletes data)
docker-compose down -v
docker-compose up -d
```

### API returns 502 Bad Gateway

```powershell
# Check backend health
docker-compose exec backend curl http://localhost:5000/health

# Check backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

## 📊 Monitoring

### Real-time Status

```powershell
# Watch service status (updates every 5 seconds)
while ($true) {
    Clear-Host
    "=== SaloneVest Services ===" 
    docker-compose ps
    Start-Sleep -Seconds 5
}
```

### Health Checks

Each service has automatic health checks:

```powershell
# Check all health statuses
docker-compose ps

# Health check results shown in STATUS column
# Format: "Up X seconds (healthy)" or "Up X seconds (unhealthy)"
```

### Service Logs

```powershell
# Backend logs
docker-compose logs backend

# Frontend logs
docker-compose logs frontend

# MongoDB logs
docker-compose logs mongodb

# All logs with follow
docker-compose logs -f --tail=100
```

## 🚀 Production Deployment

### Update .env for Production

```env
NODE_ENV=production
NETWORK=mainnet

SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

# Use strong secrets
JWT_SECRET=generate-long-random-string
MONGO_ROOT_PASSWORD=generate-strong-password

# Use production domain
CORS_ORIGIN=https://salonevest.com
API_CORS_ORIGIN=https://api.salonevest.com
```

### Use Production SSL Certificates

```powershell
# Replace self-signed certs with production certs
Copy-Item C:\path\to\prod_cert.pem nginx\ssl\cert.pem
Copy-Item C:\path\to\prod_key.pem nginx\ssl\key.pem

docker-compose restart nginx
```

### Enable Database Backup

```powershell
# Create backup directory
mkdir backups -ErrorAction SilentlyContinue

# Backup script
$BackupDate = Get-Date -Format "yyyy-MM-dd-HH-mm-ss"
docker-compose exec mongodb mongodump --out "/backup_$BackupDate"
```

### Set Up Monitoring

```powershell
# Monitor resource usage
docker stats

# Monitor logs
docker-compose logs -f

# Set up alerting (requires external service)
```

## 📦 Project Structure

```
D:\SaloneVest--main/
├── docker-compose.yml          # Service orchestration
├── deploy-monolithic.ps1       # Deployment script
├── .env.example                # Configuration template
├── DEPLOYMENT_GUIDE.md         # Detailed guide
│
├── frontend/                   # Next.js application
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── src/
│   └── public/
│
├── backend/                    # Express.js API
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   └── tsconfig.json
│
├── anchor/                     # Solana smart contract
│   ├── programs/
│   ├── tests/
│   ├── Anchor.toml
│   └── build-anchor.ps1
│
└── nginx/                      # Reverse proxy
    ├── nginx.conf
    └── ssl/
```

## 🔒 Security Best Practices

- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS with valid certificates
- [ ] Set CORS_ORIGIN to your domain
- [ ] Use mainnet RPC in production
- [ ] Enable MongoDB authentication
- [ ] Regular database backups
- [ ] Monitor logs for errors
- [ ] Keep Docker images updated
- [ ] Use secrets manager for sensitive data

## 🆘 Getting Help

### Check Logs

```powershell
# Specific service
docker-compose logs backend

# All services
docker-compose logs

# Follow live
docker-compose logs -f
```

### Verify Configuration

```powershell
# Show applied config
docker-compose config
```

### Service Documentation

- **Frontend:** `frontend/README.md`
- **Backend:** `backend/README.md`
- **Smart Contract:** `anchor/README.md`
- **Full Guide:** `DEPLOYMENT_GUIDE.md`

## 📝 Version Info

| Component | Version |
|-----------|---------|
| Docker | 24.0+ |
| Node.js | 20 |
| Next.js | 16.0+ |
| Express.js | 4.21+ |
| MongoDB | 7.0 |
| Nginx | Alpine |
| Solana | 1.18+ |

## 📄 License

MIT - See LICENSE file

## 👥 Support

- Issues: GitHub Issues
- Questions: GitHub Discussions
- Docs: See `DEPLOYMENT_GUIDE.md`

---

**SaloneVest** - Diaspora Investment Platform on Solana  
**Deployment Ready:** December 9, 2025  
**Status:** Production
