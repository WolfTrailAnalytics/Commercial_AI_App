# QUICK START CHECKLIST

Use this as your step-by-step to-do list. Check off each item as you complete it.

## 📋 BEFORE YOU CODE

### Get Your API Keys
- [ ] Anthropic API key (console.anthropic.com)
- [ ] Clerk account + keys (clerk.com)
- [ ] Supabase project + keys (supabase.com)
- [ ] Stripe account + keys (stripe.com - USE TEST MODE)

## 📋 DATABASE SETUP

- [ ] Log into Supabase
- [ ] Go to SQL Editor
- [ ] Run the SQL from SETUP-GUIDE.md to create tables
- [ ] Verify tables exist in Table Editor

## 📋 ENVIRONMENT VARIABLES

- [ ] Copy `.env.local.example` to `.env.local`
- [ ] Fill in ANTHROPIC_API_KEY
- [ ] Fill in both CLERK keys
- [ ] Fill in all three SUPABASE keys
- [ ] Fill in both STRIPE keys (leave webhook secret blank for now)

## 📋 LOCAL TESTING

- [ ] Run `npm install` in project folder
- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] See the landing page
- [ ] Click "Sign Up" and create test account
- [ ] Verify you can log in
- [ ] Go to /app and send a message to Claude
- [ ] Verify you get a response

## 📋 STRIPE SETUP

- [ ] Create "Pro Plan" product in Stripe ($29/month)
- [ ] Copy the Price ID (starts with price_...)
- [ ] Update pages/pricing.js with your Price ID (line 22)
- [ ] Create "Enterprise Plan" product ($99/month)
- [ ] Copy that Price ID too
- [ ] Update pages/pricing.js with Enterprise Price ID (line 65)

## 📋 DEPLOY TO VERCEL

- [ ] Create GitHub repository
- [ ] Push code to GitHub
- [ ] Log into Vercel
- [ ] Import your GitHub repo
- [ ] Add ALL environment variables to Vercel
- [ ] Change NEXT_PUBLIC_BASE_URL to your Vercel URL
- [ ] Deploy!

## 📋 STRIPE WEBHOOK

- [ ] Go to Stripe Dashboard → Developers → Webhooks
- [ ] Click "Add endpoint"
- [ ] URL: https://YOUR-APP.vercel.app/api/stripe-webhook
- [ ] Select events (see SETUP-GUIDE.md)
- [ ] Save and copy webhook secret
- [ ] Add webhook secret to Vercel environment variables
- [ ] Redeploy on Vercel

## 📋 FINAL TESTING

- [ ] Visit your live Vercel URL
- [ ] Sign up with a new test account
- [ ] Send a message in the app
- [ ] Go to /pricing
- [ ] Click "Subscribe to Pro"
- [ ] Use test card: 4242 4242 4242 4242
- [ ] Complete checkout
- [ ] Verify you're subscribed
- [ ] Check Supabase - see your usage logged

## 📋 MONITORING

- [ ] Set up billing alerts in Anthropic console
- [ ] Check Supabase usage_logs table daily
- [ ] Monitor Stripe dashboard for subscriptions
- [ ] Run SQL query to see total costs

## 🎉 YOU'RE LIVE!

Once all checkboxes are checked, you have a working commercial AI application!

## WHAT'S YOUR COST TRACKING QUERY?

Run this in Supabase SQL Editor to see your costs:

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as requests,
  SUM(input_tokens) as total_input_tokens,
  SUM(output_tokens) as total_output_tokens,
  SUM(cost) as daily_cost
FROM usage_logs
GROUP BY DATE(created_at)
ORDER BY date DESC
LIMIT 30;
```

This shows your costs for the last 30 days.

## IMPORTANT REMINDERS

1. You're in TEST MODE for Stripe - no real charges
2. Monitor your Anthropic costs daily when you start
3. The free tier costs YOU money - watch those users
4. Consider reducing free tier from 10 to 5 requests/day
5. You can change rate limits in pages/api/chat.js (line 67-70)

## STUCK?

Most common issues:
1. Missing environment variable
2. Forgot to create Supabase tables
3. Wrong Stripe price IDs in pricing.js
4. Webhook secret not updated after deployment

Check SETUP-GUIDE.md for troubleshooting!
