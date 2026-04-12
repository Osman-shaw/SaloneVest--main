# SaloneVest Monolithic Deployment - Quick Reference

## 🚀 60-Second Startup

```powershell
cd D:\SaloneVest--main
Copy-Item .env.example .env
notepad .env                           # Configure
.\deploy-monolithic.ps1                # Deploy
```

Done! Services start at:
- 🌐 Frontend: https://localhost:3000
- 🔌 Backend: https://localhost:5000
- 📊 Database: localhost:27017

## 📋 Command Cheat Sheet

```powershell
# Navigation
cd D:\SaloneVest--main

# Deployment Commands
.\deploy-monolithic.ps1                  # Start all services
.\deploy-monolithic.ps1 up -Build        # Build & start
.\deploy-monolithic.ps1 status           # Check status
.\deploy-monolithic.ps1 logs             # View logs
.\deploy-monolithic.ps1 down             # Stop services
.\deploy-monolithic.ps1 clean            # Remove everything

# Docker Compose Direct (if needed)
docker-compose ps                        # List services
docker-compose logs backend              # Backend logs
docker-compose restart mongodb           # Restart MongoDB
docker-compose exec backend bash         # SSH into container
```

## 🔗 Service URLs

| Service | URL | Use Case |
|---------|-----|----------|
| Frontend | https://localhost:3000 | Access dApp |
| Backend | https://localhost:5000 | API testing |
| Database | localhost:27017 | MongoDB admin |
| Proxy | https://localhost | General access |

## 📝 Configuration Quick Start

### Minimum .env Setup

```env
# These MUST be configured
PROGRAM_ID=YOUR_DEPLOYED_PROGRAM_ID
SOLANA_RPC_URL=https://api.devnet.solana.com
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_SECRET

# Database (must match docker-compose / Mongo init)
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=CHANGE_ME_STRONG_RANDOM_PASSWORD
NODE_ENV=development
```

### Full .env Template

```env
# Environment
NODE_ENV=development
NETWORK=devnet

# Database
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=CHANGE_ME_STRONG_RANDOM_PASSWORD

# Blockchain
SOLANA_RPC_URL=https://api.devnet.solana.com
SOLANA_NETWORK=devnet
PROGRAM_ID=YOUR_PROGRAM_ID

# API
API_PORT=5000
JWT_SECRET=CHANGE_ME_GENERATE_RANDOM_SECRET
CORS_ORIGIN=http://localhost:3000

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_NETWORK=devnet
```

## 🐛 Common Issues & Fixes

### Issue: "Docker not found"
```powershell
# Install Docker Desktop
https://docker.com/products/docker-desktop
```

### Issue: Port already in use
```powershell
# Find process using port 3000
Get-NetTCPConnection -LocalPort 3000
# Kill process
Stop-Process -Id [PID] -Force
```

### Issue: Container won't start
```powershell
# Check logs
docker-compose logs [service]
# Rebuild
docker-compose build --no-cache [service]
```

### Issue: "SSL certificate error"
```powershell
# Regenerate certificate
openssl req -x509 -newkey rsa:4096 -keyout nginx\ssl\key.pem -out nginx\ssl\cert.pem -days 365 -nodes
docker-compose restart nginx
```

### Issue: Database connection fails
```powershell
# Restart MongoDB
docker-compose restart mongodb
# Check logs
docker-compose logs mongodb
```

## 📊 File Structure

```
D:\SaloneVest--main/
├── docker-compose.yml          ← Service definitions
├── deploy-monolithic.ps1       ← Deployment script
├── .env.example                ← Configuration template
├── DEPLOYMENT_GUIDE.md         ← Full documentation
│
├── frontend/
│   └── Dockerfile              ← Frontend image
├── backend/
│   └── Dockerfile              ← Backend image
├── anchor/                     ← Smart contracts
└── nginx/
    └── nginx.conf              ← Reverse proxy
```

## 🔐 Security Checklist

- [ ] Changed MONGO_ROOT_PASSWORD
- [ ] Generated strong JWT_SECRET (32+ chars)
- [ ] Set PROGRAM_ID for smart contract
- [ ] Updated CORS_ORIGIN for domain
- [ ] Generated SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Updated SOLANA_RPC_URL for mainnet (if production)

## 🎯 Deployment Workflow

### Development (First Time)
```
1. Install Docker Desktop
2. Copy .env.example → .env
3. Configure .env
4. Run deploy script
5. Services start automatically
6. Access at localhost:3000
```

### Subsequent Deployments
```
1. Update code (if needed)
2. Run: .\deploy-monolithic.ps1 up -Build
3. Services rebuild and restart
4. Test at localhost:3000
```

### Maintenance
```
# Check status anytime
.\deploy-monolithic.ps1 status

# View logs
.\deploy-monolithic.ps1 logs

# Restart specific service
docker-compose restart [service]

# Stop everything
.\deploy-monolithic.ps1 down
```

## 📞 Getting Help

### View Documentation
- Full guide: `DEPLOYMENT_GUIDE.md`
- This guide: `MONOLITHIC_DEPLOYMENT_README.md`
- Summary: `MONOLITHIC_DEPLOYMENT_SUMMARY.md`

### Check Logs
```powershell
# All logs
.\deploy-monolithic.ps1 logs

# Specific service
docker-compose logs backend

# Follow live
docker-compose logs -f
```

### Common Checks
```powershell
# Services running?
docker-compose ps

# Can access frontend?
Invoke-WebRequest https://localhost:3000 -SkipCertificateCheck

# Can access API?
Invoke-WebRequest https://localhost:5000/health -SkipCertificateCheck

# Database responding?
docker-compose exec -it mongodb mongosh -u admin --password
```

## 🚀 Production Checklist

- [ ] Use production SSL certificates
- [ ] Set NODE_ENV=production
- [ ] Update SOLANA_RPC_URL to mainnet
- [ ] Use strong database passwords
- [ ] Configure proper CORS_ORIGIN
- [ ] Set up backups
- [ ] Configure monitoring
- [ ] Enable logging
- [ ] Test failover
- [ ] Document deployment

## 📈 Performance Tips

```powershell
# Monitor resource usage
docker stats

# Enable database indexing
docker-compose exec mongodb mongosh

# Optimize nginx caching
# Edit: nginx/nginx.conf (expires, cache headers)

# Scale services (requires Swarm/K8s)
docker service scale salonevest_backend=3
```

## 🎁 Included Components

| Component | Tech | Port | Status |
|-----------|------|------|--------|
| Frontend | Next.js 16 | 3000 | ✅ |
| Backend | Express 4.21 | 5000 | ✅ |
| Database | MongoDB 7 | 27017 | ✅ |
| Proxy | Nginx | 80/443 | ✅ |
| Blockchain | Solana | RPC | ✅ |

## 💾 Backup & Restore

```powershell
# Backup MongoDB
docker-compose exec mongodb mongodump --out /backup

# Restore MongoDB
docker-compose exec mongodb mongorestore /backup

# Backup entire system
docker-compose exec mongodb mongodump --out backup_$(Get-Date -f yyyy-MM-dd)
```

## 🔄 Service Dependencies

```
Frontend (3000)
    ├─ Nginx (443)
    │   └─ Backend (5000)
    │       └─ MongoDB (27017)
    │       └─ Solana RPC
    └─ Browser

Backend (5000)
    ├─ MongoDB (27017) [REQUIRED]
    ├─ Solana RPC [REQUIRED]
    └─ Nginx (443)

MongoDB (27017)
    └─ Backend (5000) [dependency]

Nginx (443)
    ├─ Frontend (3000)
    └─ Backend (5000)
```

## ⚡ Quick Actions

```powershell
# Emergency stop
docker-compose down

# Emergency restart
docker-compose restart

# Clear everything & start fresh
docker-compose down -v
.\deploy-monolithic.ps1

# Update single service
docker-compose up -d --build backend

# SSH into backend
docker-compose exec backend bash

# View real-time logs
docker-compose logs -f --tail=50
```

## 📱 Mobile Access

For accessing from other machines:

```powershell
# Get your IP
ipconfig

# Access from mobile/other device
https://[YOUR_IP]:3000
https://[YOUR_IP]:5000

# Note: SSL will warn (self-signed), accept warning
```

---

**Quick Reference Sheet**  
Keep this handy for daily operations!  
**Version:** 1.0.0  
**Updated:** December 9, 2025
