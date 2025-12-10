# SaloneVest Monolithic Deployment Guide

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Internet (HTTPS)                    │
└────────────────────────┬────────────────────────────────┘
                         │
                    ┌────▼────┐
                    │  Nginx   │ (Reverse Proxy, SSL/TLS)
                    │ Port 443 │ (Load Balancer)
                    └────┬─────┘
         ┌──────────────┬┴┬──────────────┐
         │              │ │              │
    ┌────▼────┐   ┌────▼─▼──┐   ┌────┐
    │Frontend  │   │  Backend │   │    │
    │Next.js   │   │ Express  │   │    │
    │Port 3000 │   │Port 5000 │   │    │
    └────┬─────┘   └─────┬────┘   │    │
         │               │         │    │
         └───────────────┼─────────┼─┬──┘
                         │         │ │
                         │    ┌────▼─▼──┐
                         │    │ MongoDB  │
                         │    │Port 27017│
                         │    └──────────┘
                         │
            ┌────────────▼──────────────┐
            │   Solana Blockchain       │
            │   (Devnet/Mainnet)        │
            │   Smart Contracts         │
            └───────────────────────────┘
```

## System Requirements

- **Docker Desktop** (or Docker Engine on Linux)
- **Docker Compose** v1.29+
- **4GB RAM** minimum (8GB recommended)
- **10GB disk space** minimum
- **Internet connection** (for Solana RPC)

## Project Structure

```
D:\SaloneVest--main/
├── frontend/                 # Next.js application
│   ├── Dockerfile           # Frontend container build
│   ├── package.json
│   ├── next.config.mjs
│   └── src/
├── backend/                 # Express.js API
│   ├── Dockerfile           # Backend container build
│   ├── package.json
│   ├── src/
│   │   ├── server.ts
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── routes/
│   │   └── services/
│   └── tsconfig.json
├── anchor/                  # Solana smart contract
│   ├── programs/
│   ├── tests/
│   └── Anchor.toml
├── nginx/                   # Reverse proxy configuration
│   └── nginx.conf
├── docker-compose.yml       # Orchestration configuration
├── .env.example             # Environment variables template
└── README.md
```

## Deployment Steps

### Step 1: Prepare Environment

```powershell
# Navigate to project root
cd D:\SaloneVest--main

# Copy environment template
Copy-Item .env.example .env

# Edit .env with your configuration
# Important: Update PROGRAM_ID and SECRET_KEY for production
notepad .env
```

### Step 2: Build Smart Contract (If Not Done)

```powershell
cd anchor

# Using Docker extension or local Anchor
pwsh build-anchor.ps1 build
pwsh build-anchor.ps1 compile

# Verify output
ls target/deploy/

# Back to root
cd ..
```

### Step 3: Generate SSL Certificates (Development)

```powershell
# Create SSL directory
mkdir nginx\ssl -ErrorAction SilentlyContinue

# Generate self-signed certificate (valid for 365 days)
openssl req -x509 -newkey rsa:4096 -keyout nginx\ssl\key.pem -out nginx\ssl\cert.pem -days 365 -nodes -subj "/CN=localhost"
```

If OpenSSL is not available, download from: https://slproweb.com/products/Win32OpenSSL.html

### Step 4: Build and Deploy Services

```powershell
# From project root (D:\SaloneVest--main)

# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check service status
docker-compose ps
```

### Step 5: Verify Deployment

```powershell
# Check if services are running
docker-compose ps

# Test Frontend
Start-Process https://localhost:3000

# Test Backend API
Invoke-RestMethod -Uri https://localhost:5000/health -SkipCertificateCheck

# Check MongoDB
docker-compose exec mongodb mongosh -u admin -p salonevest123
```

## Post-Deployment Configuration

### 1. Set Up Solana Wallet

```powershell
# Inside backend container
docker-compose exec backend bash

# Create wallet
solana-keygen new --outfile ~/.config/solana/id.json

# Configure network
solana config set --url https://api.devnet.solana.com

# Get airdrop (devnet only)
solana airdrop 2

# Exit container
exit
```

### 2. Deploy Smart Contract to Devnet

```powershell
cd anchor

# Deploy
pwsh build-anchor.ps1 deploy

# Get program ID from output
# Update .env with PROGRAM_ID

cd ..
docker-compose restart backend
```

### 3. Update Frontend Configuration

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=https://localhost:5000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_NETWORK=devnet
NEXT_PUBLIC_PROGRAM_ID=YOUR_PROGRAM_ID
```

## Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | https://localhost:3000 | SaloneVest dApp |
| **Backend API** | https://localhost:5000 | REST API endpoints |
| **MongoDB** | localhost:27017 | Database (internal) |
| **Nginx** | https://localhost | Load balancer/proxy |

## Common Commands

```powershell
# View all services
docker-compose ps

# View logs
docker-compose logs -f [service_name]
# service_name: frontend, backend, mongodb, nginx

# Restart services
docker-compose restart [service_name]

# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes data)
docker-compose down -v

# Rebuild specific service
docker-compose build --no-cache [service_name]

# Execute command in container
docker-compose exec [service_name] [command]

# View service logs
docker-compose logs --tail=100 backend
```

## Troubleshooting

### Issue: Container fails to start

```powershell
# Check logs
docker-compose logs [service_name]

# Rebuild and restart
docker-compose build --no-cache [service_name]
docker-compose up -d [service_name]
```

### Issue: MongoDB connection fails

```powershell
# Verify MongoDB is running
docker-compose ps mongodb

# Check MongoDB logs
docker-compose logs mongodb

# Restart MongoDB
docker-compose restart mongodb
```

### Issue: SSL certificate error

```powershell
# Regenerate self-signed certificate
rm nginx\ssl\cert.pem nginx\ssl\key.pem
openssl req -x509 -newkey rsa:4096 -keyout nginx\ssl\key.pem -out nginx\ssl\cert.pem -days 365 -nodes
docker-compose restart nginx
```

### Issue: API returns 502 Bad Gateway

```powershell
# Check backend health
docker-compose exec backend curl http://localhost:5000/health

# Check backend logs
docker-compose logs backend

# Verify environment variables
docker-compose config
```

### Issue: Port already in use

```powershell
# Find process using port
Get-NetTCPConnection -LocalPort 3000
netstat -ano | findstr :3000

# Kill process (replace PID)
Stop-Process -Id [PID] -Force

# Or use different ports in docker-compose.yml
```

## Production Deployment

### 1. Environment Variables

Update `.env` for production:

```env
NODE_ENV=production
NETWORK=mainnet

SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
SOLANA_NETWORK=mainnet-beta

JWT_SECRET=generate-strong-random-key
MONGO_ROOT_PASSWORD=generate-strong-random-password

# Production domain
API_CORS_ORIGIN=https://salonevest.com
```

### 2. SSL Certificates

Use proper SSL certificates from Let's Encrypt or your CA:

```powershell
# Replace self-signed certs with production certs
copy C:\path\to\cert.pem nginx\ssl\cert.pem
copy C:\path\to\key.pem nginx\ssl\key.pem

docker-compose restart nginx
```

### 3. Database Backup

```powershell
# Create backup
docker-compose exec mongodb mongodump --out /backup

# Restore backup
docker-compose exec mongodb mongorestore /backup
```

### 4. Health Monitoring

```powershell
# Monitor services (runs every 5s)
while ($true) {
    docker-compose ps
    Start-Sleep -Seconds 5
    Clear-Host
}
```

## Performance Optimization

### Nginx Caching

Edit `nginx/nginx.conf` to enable caching:

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### MongoDB Indexing

```powershell
docker-compose exec mongodb mongosh -u admin -p salonevest123 << 'EOF'
use salonevest
db.users.createIndex({ email: 1 })
db.investments.createIndex({ category: 1 })
db.portfolios.createIndex({ userId: 1 })
EOF
```

### Auto-restart on Failure

Services automatically restart on failure (configured in docker-compose.yml):

```yaml
restart: unless-stopped
```

## Scaling

For horizontal scaling, use Docker Swarm or Kubernetes:

### Docker Swarm

```powershell
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml salonevest

# Scale service
docker service scale salonevest_backend=3
```

## Security Checklist

- [ ] Change all default passwords in `.env`
- [ ] Use strong JWT_SECRET
- [ ] Enable HTTPS with valid certificates
- [ ] Set CORS_ORIGIN to production domain
- [ ] Use mainnet Solana RPC in production
- [ ] Enable MongoDB authentication
- [ ] Rotate API keys regularly
- [ ] Set up database backups
- [ ] Monitor logs and health checks
- [ ] Keep Docker images updated

## Support

For issues or questions:
1. Check logs: `docker-compose logs -f`
2. Review this guide
3. Check individual service documentation:
   - Frontend: `frontend/README.md`
   - Backend: `backend/README.md`
   - Smart Contract: `anchor/README.md`

---

**Deployment Date:** December 9, 2025  
**Version:** 1.0.0  
**Status:** Production Ready
