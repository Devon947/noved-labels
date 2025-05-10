# NOVEDLabels Shipping Platform

A modern shipping label generation platform with multi-carrier support and cryptocurrency payments.

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

## Production Setup

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- A Stripe account
- A Coinbase Commerce account
- A Shippo account
- A domain name with SSL certificate

### Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in all required environment variables in `.env`:
- Stripe API keys from your Stripe Dashboard
- Coinbase Commerce API keys from your Coinbase Commerce Dashboard
- Shippo API key from your Shippo Dashboard
- Other configuration values as needed

### Installation

1. Install dependencies:
```bash
npm install
# or
yarn install
```

2. Build the application:
```bash
npm run build
# or
yarn build
```

3. Start the production server:
```bash
npm start
# or
yarn start
```

### API Endpoints

The following API endpoints need to be configured in your production environment:

1. Stripe Webhook:
- URL: `https://your-domain.com/api/webhook`
- Events to listen for: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

2. Coinbase Commerce Webhook:
- URL: `https://your-domain.com/api/crypto-webhook`
- Events to listen for: `charge:confirmed`, `charge:failed`

### Security Considerations

1. Ensure all API keys are properly secured and never exposed in client-side code
2. Set up proper CORS policies in your production environment
3. Configure rate limiting for API endpoints
4. Set up proper SSL/TLS certificates
5. Implement proper error logging and monitoring

### Monitoring

1. Set up error tracking (e.g., Sentry)
2. Configure application monitoring
3. Set up uptime monitoring
4. Configure payment processing monitoring

### Backup and Recovery

1. Set up regular database backups
2. Configure backup storage
3. Test recovery procedures regularly

## Support

For support, please contact support@your-domain.com

## License

[Your License]

## Additional Resources

- [API Documentation](https://goshippo.com/docs/api)
- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)