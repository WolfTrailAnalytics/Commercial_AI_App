# Commercial AI Application Starter

A complete, production-ready foundation for building a commercial AI application with Claude API integration.

## What This Is

This is a **complete starter template** for a commercial AI SaaS application. It includes everything you need to:

1. Accept user signups
2. Charge for subscriptions
3. Securely call Claude API from the backend
4. Track usage and costs
5. Enforce rate limits
6. Handle payments automatically

## Tech Stack

- **Frontend:** Next.js 14 + React
- **Backend:** Next.js API Routes (serverless)
- **Authentication:** Clerk
- **Database:** Supabase (PostgreSQL)
- **Payments:** Stripe
- **AI:** Anthropic Claude API
- **Hosting:** Vercel

## Architecture

```
User Browser
    ↓
  Your Frontend (React)
    ↓
  Your Backend API (Next.js API Routes)
    ↓
  Anthropic Claude API
    
Your Backend also talks to:
- Clerk (verify user identity)
- Supabase (check subscription, track usage)
- Stripe (handle payments)
```

## Key Features

### Security
- ✅ API key never exposed to frontend
- ✅ All Claude API calls go through your backend
- ✅ User authentication required
- ✅ Subscription verification on every request

### Rate Limiting
- ✅ Track requests per user per day
- ✅ Free tier: 10 requests/day
- ✅ Paid tier: 100 requests/day
- ✅ Automatic daily reset

### Cost Tracking
- ✅ Log every API call with token counts
- ✅ Calculate cost per request
- ✅ Track total costs per user
- ✅ Admin queries to monitor spending

### Business Logic
- ✅ Free tier for user acquisition
- ✅ Paid subscriptions via Stripe
- ✅ Automatic subscription management
- ✅ Handle failed payments
- ✅ Cancellation handling

## File Structure

```
commercial-ai-app/
├── pages/
│   ├── index.js              # Landing page
│   ├── app.js                # Main AI chat application
│   ├── pricing.js            # Pricing page with subscription tiers
│   ├── _app.js               # App wrapper (Clerk provider)
│   └── api/
│       ├── chat.js           # Secure Claude API proxy
│       ├── create-checkout-session.js  # Stripe checkout
│       └── stripe-webhook.js # Handle Stripe events
├── middleware.js             # Route protection (Clerk)
├── styles/
│   └── globals.css          # Global styles
├── package.json             # Dependencies
├── .env.local               # Environment variables (YOU CREATE THIS)
├── SETUP-GUIDE.md           # Detailed setup instructions
└── README.md                # This file
```

## Quick Start

1. **Read SETUP-GUIDE.md first** - It walks you through everything
2. Install dependencies: `npm install`
3. Set up environment variables (see SETUP-GUIDE.md)
4. Run locally: `npm run dev`
5. Deploy to Vercel

## Environment Variables Needed

You'll need accounts and API keys from:
- Anthropic (Claude API)
- Clerk (Authentication)
- Supabase (Database)
- Stripe (Payments)

All explained in detail in SETUP-GUIDE.md.

## Business Model

This starter implements a **freemium model**:

- **Free:** 10 requests/day (your API costs)
- **Pro:** $29/month for 100 requests/day
- **Enterprise:** $99/month for unlimited with BYOK

You can change these limits and prices in the code.

## Cost Economics

**Example for 100 paying users at $29/month:**

Revenue: $2,900/month

Costs:
- Vercel: $0 (free tier sufficient initially)
- Clerk: $0 (free up to 10k users)
- Supabase: $0 (free tier sufficient initially)
- Stripe fees: ~$90/month (2.9% + $0.30 per transaction)
- Claude API: ~$300-600/month (depends on usage)

**Profit: ~$2,200/month**

This assumes users average 30 requests/month (well below the 3,000/month limit).

## Scaling Considerations

**If users hit their limits hard:**
- 100 users × 100 requests/day = 10,000 requests/day
- At $0.01 per request = $100/day = $3,000/month
- Revenue = $2,900/month
- **You lose money**

**Solutions:**
1. Reduce free tier to 5 requests/day
2. Increase paid tier to $49/month
3. Implement prompt caching (reduce costs 90%)
4. Add value beyond just API access
5. Monitor power users and adjust limits

## What's Next

After you get this running, you can add:

**Phase 3 - Enhancements:**
- Customer portal for subscription management
- Email notifications
- Conversation history storage
- User dashboard with usage stats
- Team/organization features

**Phase 4 - Optimization:**
- Prompt caching to reduce costs
- Request queuing during peak times
- A/B testing different pricing
- Analytics and user insights
- Custom integrations

## Important Notes

1. **Start in test mode** for everything (Stripe, etc.)
2. **Monitor costs daily** when you launch
3. **Set up billing alerts** in your Anthropic console
4. **Test the payment flow** thoroughly before going live
5. **Have a support plan** for when users have payment issues

## Getting Help

If you get stuck:
1. Check the SETUP-GUIDE.md
2. Look at browser console errors (F12)
3. Check Vercel deployment logs
4. Check Supabase table editor
5. Test API endpoints directly

Common issues are almost always:
- Missing environment variables
- Wrong environment variable values
- Database tables not created
- Webhook URLs not updated after deployment

## License

This is a starter template for you to build on. Modify as needed for your business.

---

**Ready to start?** Open SETUP-GUIDE.md and follow the steps!
