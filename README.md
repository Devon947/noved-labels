# NOVED Labels

A full-featured shipping label generation platform with secure label management, ticket creation, and reporting features.

## Features

- Shipping label generation with Shippo API
- Label preview, download, and printing
- Ticket creation for support requests
- Detailed shipping history
- User authentication with Supabase
- Secure API key management

## Required API Keys and Services

To run this application successfully in production, you need:

1. **Shippo Account** - For shipping labels generation
   - Create an account at [goshippo.com](https://goshippo.com)
   - Get your API keys from the dashboard
   - For testing, use: `shippo_test_a646c6a24331882d85e232063d3a137bbbcb35ff`
   - For production, use a live API key

2. **Supabase Project** - For authentication and data storage
   - Create a project at [supabase.com](https://supabase.com)
   - Get your project URL and anon key

## Deployment

### Environment Variables

Create a `.env.production` file with these variables before deployment:

```
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
ENCRYPTION_KEY=production_key_min_32_chars_long_here
SHIPPO_API_KEY=your-shippo-api-key
NEXT_TELEMETRY_DISABLED=1
HOST_URL=https://your-domain.com
ENABLE_ANALYTICS=true
ALLOWED_ORIGINS=https://your-domain.com,https://www.your-domain.com
```

### Vercel Deployment

When deploying to Vercel, add all environment variables in the Vercel project settings.

For complete deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Local Development

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env.local` file with required environment variables
4. Run the development server:
   ```
   npm run dev
   ```

## Production Build

```bash
npm run build
npm run start
```

## Additional Resources

- [API Documentation](https://goshippo.com/docs/api)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)