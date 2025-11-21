# COMPLETE SETUP GUIDE - Phase 1 & 2

This is a complete commercial AI application with:
- Secure Claude API integration
- User authentication (Clerk)
- Database (Supabase)
- Payment processing (Stripe)
- Rate limiting
- Usage tracking

## WHAT YOU NEED BEFORE STARTING

1. **Anthropic API Key**
   - Go to: https://console.anthropic.com
   - Sign up / Log in
   - Go to "API Keys" and create a new key
   - Copy it - you'll need it later

2. **Clerk Account** (Authentication)
   - Go to: https://clerk.com
   - Sign up for free
   - Create a new application
   - You'll get publishable and secret keys

3. **Supabase Account** (Database)
   - Go to: https://supabase.com
   - Sign up for free
   - Create a new project
   - You'll get URL and keys

4. **Stripe Account** (Payments)
   - Go to: https://stripe.com
   - Sign up
   - Get API keys from Dashboard

## STEP 1: SET UP SUPABASE DATABASE

1. **Log into Supabase**
2. **Go to SQL Editor**
3. **Run this SQL to create your tables:**

```sql
-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  clerk_id TEXT UNIQUE NOT NULL,
  email TEXT,
  subscription_status TEXT DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  requests_today INTEGER DEFAULT 0,
  total_requests INTEGER DEFAULT 0,
  last_request_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Usage logs table (tracks every API call)
CREATE TABLE usage_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  cost DECIMAL(10, 6),
  model TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_users_clerk_id ON users(clerk_id);
CREATE INDEX idx_users_stripe_customer ON users(stripe_customer_id);
CREATE INDEX idx_usage_logs_user ON usage_logs(user_id);
CREATE INDEX idx_usage_logs_created ON usage_logs(created_at);
```

4. **Get your Supabase credentials:**
   - Go to Settings → API
   - Copy your Project URL
   - Copy your `anon` public key
   - Copy your `service_role` secret key (under "Project API keys")

## STEP 2: SET UP CLERK AUTHENTICATION

1. **Log into Clerk Dashboard**
2. **Create a new application** (or select existing)
3. **Go to "API Keys"**
4. **Copy these values:**
   - Publishable Key (starts with `pk_test_...`)
   - Secret Key (starts with `sk_test_...`)

## STEP 3: SET UP STRIPE

1. **Log into Stripe Dashboard**
2. **Turn on Test Mode** (toggle in top-right)
3. **Go to Developers → API Keys**
4. **Copy:**
   - Publishable Key (starts with `pk_test_...`)
   - Secret Key (starts with `sk_test_...`)

5. **Create Products:**
   - Go to Products → Add Product
   - Create "Pro Plan" - $29/month recurring
   - Copy the Price ID (starts with `price_...`)
   - Create "Enterprise Plan" - $99/month recurring
   - Copy the Price ID

6. **Set up Webhook:**
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - Enter: `https://your-app.vercel.app/api/stripe-webhook`
   - Select these events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_failed`
   - Click "Add endpoint"
   - Copy the "Signing secret" (starts with `whsec_...`)

## STEP 4: CONFIGURE ENVIRONMENT VARIABLES

Create a file called `.env.local` in your project root:

```env
# Anthropic
ANTHROPIC_API_KEY=sk-ant-your-key-here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your-key
CLERK_SECRET_KEY=sk_test_your-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Stripe
STRIPE_SECRET_KEY=sk_test_your-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## STEP 5: INSTALL AND RUN LOCALLY

1. **Open Command Prompt**
2. **Navigate to project folder:**
   ```
   cd path\to\commercial-ai-app
   ```

3. **Install dependencies:**
   ```
   npm install
   ```

4. **Run the development server:**
   ```
   npm run dev
   ```

5. **Open browser:**
   ```
   http://localhost:3000
   ```

You should see your landing page!

## STEP 6: TEST THE APPLICATION

1. **Click "Get Started" to sign up**
2. **Create an account** (Clerk handles this)
3. **Go to the app** at http://localhost:3000/app
4. **Try sending a message to Claude**
5. **Check that it works!**

## STEP 7: DEPLOY TO VERCEL

1. **Push your code to GitHub:**
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-github-repo-url
   git push -u origin main
   ```

2. **Go to Vercel.com and log in**

3. **Click "Add New Project"**

4. **Import your GitHub repository**

5. **Add ALL environment variables:**
   - Go to project settings
   - Add each variable from your `.env.local` file
   - **IMPORTANT:** Change `NEXT_PUBLIC_BASE_URL` to your Vercel URL

6. **Deploy!**

## STEP 8: UPDATE STRIPE WEBHOOK (After Deployment)

1. **Go back to Stripe Dashboard**
2. **Go to Developers → Webhooks**
3. **Edit your webhook endpoint**
4. **Change URL to:** `https://your-app.vercel.app/api/stripe-webhook`
5. **Save**

## TESTING PAYMENTS

In test mode, use these test cards:
- Success: `4242 4242 4242 4242`
- Decline: `4000 0000 0000 0002`
- Expiry: Any future date
- CVC: Any 3 digits

## WHAT YOU HAVE NOW

✅ Landing page at `/`
✅ Pricing page at `/pricing`
✅ Sign up / Sign in (handled by Clerk)
✅ AI chat app at `/app`
✅ Secure Claude API backend
✅ User database with usage tracking
✅ Rate limiting (10/day free, 100/day paid)
✅ Subscription payments via Stripe
✅ Automatic subscription management

## MONITORING YOUR COSTS

1. **Check Supabase:**
   - Go to your Supabase dashboard
   - Table Editor → usage_logs
   - See every API call and its cost

2. **Query total costs:**
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as requests,
  SUM(cost) as daily_cost
FROM usage_logs
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## NEXT STEPS (Phase 3 & 4)

- Add customer portal for managing subscriptions
- Add email notifications
- Build admin dashboard
- Add more features to justify pricing
- Implement prompt caching to reduce costs
- Add conversation history
- Add team features

## TROUBLESHOOTING

**"Unauthorized" error when calling API:**
- Make sure you're signed in
- Check Clerk keys are correct

**"Database error":**
- Check Supabase tables were created
- Check Supabase keys are correct

**Stripe checkout not working:**
- Make sure you're in test mode
- Check Stripe keys are correct
- Check price IDs match your Stripe products

**Styling looks plain:**
- Make sure styles/globals.css exists
- Clear browser cache

## NEED HELP?

If you get stuck, check:
1. Browser console for errors (F12)
2. Vercel deployment logs
3. Supabase logs
4. Stripe logs

The most common issue is missing or incorrect environment variables. Double-check ALL of them.
