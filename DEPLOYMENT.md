# SaloneVest Deployment Guide

This guide covers deploying the SaloneVest platform to production.

## Pre-Deployment Checklist

- [ ] Environment variables configured in `.env.local`
- [ ] Solana RPC endpoint set (mainnet or testnet)
- [ ] Phantom app registered
- [ ] GitHub repository set up
- [ ] Domain name secured
- [ ] SSL certificate ready
- [ ] Analytics and monitoring configured
- [ ] Legal pages reviewed

## Environment Setup

### 1. Set Environment Variables

Create `.env.local` with production values:

\`\`\`env
# Solana Network (use mainnet-beta for production)
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta

# Phantom Wallet
NEXT_PUBLIC_PHANTOM_APP_URL=https://phantom.app

# SaloneVest Configuration
NEXT_PUBLIC_SALONESVEST_PROGRAM_ID=<deployed_program_id>
NEXT_PUBLIC_API_URL=https://api.salonevest.io

# Production domain
NEXT_PUBLIC_DEV_SALONESVEST_REDIRECT_URL=https://saloneVest.io

# Analytics
NEXT_PUBLIC_ANALYTICS_ID=<your_analytics_id>
\`\`\`

### 2. Verify Build Configuration

\`\`\`bash
# Test build locally
npm run build

# Check for build errors
npm run type-check
npm run lint
\`\`\`

## Deployment to Vercel (Recommended)

### 1. Connect GitHub Repository

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Select GitHub repository
5. Vercel auto-detects Next.js configuration

### 2. Configure Project Settings

In Vercel dashboard:

1. **Environment Variables**
   - Add all variables from `.env.local`
   - Set for Production, Preview, Development as needed

2. **Domains**
   - Add custom domain: `saloneVest.io`
   - Configure DNS records
   - Enable auto-renewal

3. **Build & Output**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install`

4. **Function Concurrency**
   - Set for serverless functions (if needed)

### 3. Deploy

\`\`\`bash
# Option 1: Deploy via Git
# Push to main branch, Vercel deploys automatically

# Option 2: Deploy via CLI
npm install -g vercel
vercel --prod
\`\`\`

### 4. Post-Deployment

1. Run health checks
2. Test wallet connection
3. Verify blockchain transactions
4. Check analytics integration
5. Monitor error logs

## Manual Deployment

### 1. Build for Production

\`\`\`bash
npm run build
npm run type-check
npm run lint
\`\`\`

### 2. Deploy to Server

\`\`\`bash
# Using PM2 for process management
npm install -g pm2

pm2 start npm --name "saloneVest" -- start
pm2 save
pm2 startup

# Or using systemd
# Copy saloneVest.service to /etc/systemd/system/
systemctl enable saloneVest
systemctl start saloneVest
\`\`\`

### 3. Configure Reverse Proxy

Using Nginx:

\`\`\`nginx
server {
    listen 80;
    server_name saloneVest.io www.saloneVest.io;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### 4. SSL Certificate

\`\`\`bash
# Using Let's Encrypt
sudo apt install certbot python3-certbot-nginx
sudo certbot certonly --nginx -d saloneVest.io

# Auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer
\`\`\`

## Performance Optimization

### 1. Enable Caching

\`\`\`bash
# Browser cache headers (set in next.config.mjs)
Cache-Control: public, max-age=3600
\`\`\`

### 2. CDN Configuration

For Vercel:
- Automatic global CDN
- Edge caching enabled
- ISR (Incremental Static Regeneration)

### 3. Database Optimization

When adding database:
- Add connection pooling
- Enable read replicas
- Monitor slow queries
- Set up automated backups

### 4. Monitoring

\`\`\`bash
# Monitor server resources
pm2 monitor

# Check Vercel Analytics
# Dashboard → Analytics tab

# Enable Sentry for error tracking
npm install @sentry/nextjs
\`\`\`

## Security Checklist

- [ ] HTTPS enabled (SSL certificate)
- [ ] Security headers configured
- [ ] CORS properly set
- [ ] Environment variables not exposed
- [ ] Rate limiting enabled
- [ ] DDoS protection active
- [ ] Regular backups scheduled
- [ ] Security updates applied

## Monitoring & Logging

### 1. Application Monitoring

\`\`\`bash
# View Vercel logs
vercel logs saloneVest

# Local logging
tail -f ~/.pm2/logs/saloneVest-out.log
\`\`\`

### 2. Error Tracking

Set up Sentry:
1. Create account at sentry.io
2. Create project for Next.js
3. Add DSN to `.env.local`

\`\`\`
NEXT_PUBLIC_SENTRY_DSN=<your_sentry_dsn>
\`\`\`

### 3. Analytics

Track user behavior:
- Google Analytics (implemented)
- Custom events for investments
- Portfolio performance metrics
- Transaction success rates

## Rollback Procedure

### Vercel Rollback

1. Go to Deployments tab
2. Select previous deployment
3. Click "Rollback"

### Manual Rollback

\`\`\`bash
# Revert to previous commit
git revert <commit_hash>
git push

# Or checkout specific version
git checkout v1.0.0
\`\`\`

## Scaling Strategy

### 1. Database Scaling

- Use read replicas for portfolio queries
- Cache frequently accessed data
- Implement query optimization

### 2. API Rate Limiting

\`\`\`bash
# Implement in API routes
const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
})
\`\`\`

### 3. Load Balancing

- Vercel handles automatically
- Configure multiple regions for redundancy

## Maintenance

### Weekly Tasks
- Review error logs
- Check performance metrics
- Verify backups

### Monthly Tasks
- Security updates
- Dependency updates
- Performance review

### Quarterly Tasks
- Capacity planning
- Disaster recovery drill
- Security audit

## Support & Troubleshooting

### Common Issues

**"Phantom not detected"**
- Check browser extension installation
- Verify NEXT_PUBLIC_PHANTOM_APP_URL
- Clear browser cache

**"Transaction failed"**
- Check Solana RPC endpoint
- Verify sufficient SOL for fees
- Check network status

**"Slow performance"**
- Check Vercel analytics
- Review database queries
- Clear Next.js cache

### Contact Support

- Vercel Support: https://vercel.com/help
- Solana Foundation: https://solana.com
- Discord: https://discord.gg/saloneVest

---

For questions or issues, contact: deploy@saloneVest.io
