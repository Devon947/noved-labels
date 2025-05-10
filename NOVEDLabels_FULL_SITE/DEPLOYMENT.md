# NOVED Labels Deployment Guide

This document provides instructions for deploying the NOVED Labels application to production.

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- A Vercel account (recommended) or similar hosting service
- Shippo API key

## Environment Variables

The following environment variables must be set in your production environment:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ENCRYPTION_KEY=your-encryption-key-min-32-chars
SHIPPO_API_KEY=your-shippo-api-key
NEXT_TELEMETRY_DISABLED=1
HOST_URL=https://your-domain.com
ENABLE_ANALYTICS=true
```

## Deployment Options

### Option 1: Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the required environment variables in the Vercel project settings
3. Deploy using the Vercel dashboard or CLI:

```bash
vercel --prod
```

### Option 2: Manual Deployment

1. Clone the repository:

```bash
git clone https://github.com/your-username/novedlabels.git
cd novedlabels
```

2. Install dependencies:

```bash
npm ci
```

3. Build the application:

```bash
npm run build
```

4. Start the production server:

```bash
npm run start
```

### Option 3: Using the Deployment Script

1. Make sure the script is executable:

```bash
chmod +x deploy.sh
```

2. Run the deployment script:

```bash
./deploy.sh
```

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test shipping label generation
- [ ] Test label download functionality
- [ ] Test ticket creation
- [ ] Confirm environment variables are set properly
- [ ] Check that maintenance cron job is running

## Rollback Procedure

If issues are encountered, you can roll back to a previous version:

1. On Vercel: Use the dashboard to revert to a previous deployment
2. Manual rollback: Check out the previous tag and redeploy

```bash
git checkout v1.0.0
./deploy.sh
```

## Monitoring and Logs

- Monitor application health using Vercel Analytics
- Check logs in the Vercel dashboard

## Security Considerations

- Ensure all API keys are kept secure
- Regenerate API keys periodically
- Use HTTPS for all communications
- Keep dependencies updated

## Support

For deployment issues, contact support@novedlabels.com 