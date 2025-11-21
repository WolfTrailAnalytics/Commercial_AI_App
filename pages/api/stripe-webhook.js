// pages/api/stripe-webhook.js
// Handles Stripe events (payment success, subscription cancelled, etc.)

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Disable body parsing for webhook
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const buf = await buffer(req);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    // Verify webhook signature
    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed':
      // Payment successful - activate subscription
      const session = event.data.object;
      await handleCheckoutSuccess(session);
      break;

    case 'customer.subscription.updated':
      // Subscription updated (plan change, etc.)
      const subscription = event.data.object;
      await handleSubscriptionUpdate(subscription);
      break;

    case 'customer.subscription.deleted':
      // Subscription cancelled
      const cancelledSub = event.data.object;
      await handleSubscriptionCancelled(cancelledSub);
      break;

    case 'invoice.payment_failed':
      // Payment failed - pause subscription
      const invoice = event.data.object;
      await handlePaymentFailed(invoice);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  res.status(200).json({ received: true });
}

async function handleCheckoutSuccess(session) {
  const userId = session.client_reference_id || session.metadata.userId;
  
  console.log('Checkout success for user:', userId);

  // Update user's subscription status in database
  const { error } = await supabase
    .from('users')
    .update({
      subscription_status: 'active',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_id', userId);

  if (error) {
    console.error('Error updating user subscription:', error);
  }
}

async function handleSubscriptionUpdate(subscription) {
  // Find user by Stripe customer ID
  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', subscription.customer)
    .single();

  if (error || !user) {
    console.error('User not found for subscription update');
    return;
  }

  // Update subscription status
  const status = subscription.status === 'active' ? 'active' : subscription.status;
  
  await supabase
    .from('users')
    .update({
      subscription_status: status,
      updated_at: new Date().toISOString(),
    })
    .eq('clerk_id', user.clerk_id);
}

async function handleSubscriptionCancelled(subscription) {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (user) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'cancelled',
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', user.clerk_id);
  }
}

async function handlePaymentFailed(invoice) {
  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('stripe_customer_id', invoice.customer)
    .single();

  if (user) {
    await supabase
      .from('users')
      .update({
        subscription_status: 'past_due',
        updated_at: new Date().toISOString(),
      })
      .eq('clerk_id', user.clerk_id);
  }
}
