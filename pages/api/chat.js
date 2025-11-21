// pages/api/chat.js
// This is your secure backend that calls Claude API
// Users can NEVER see your API key because this runs on the server

import Anthropic from '@anthropic-ai/sdk';
import { getAuth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Initialize Anthropic client with YOUR API key (secure)
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // STEP 1: Verify user is logged in
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: 'You must be logged in' });
    }

    // STEP 2: Get user from database
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('clerk_id', userId)
      .single();

    if (userError || !user) {
      // First time user - create their record
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert([
          {
            clerk_id: userId,
            subscription_status: 'free',
            requests_today: 0,
            total_requests: 0,
            last_request_date: new Date().toISOString().split('T')[0],
          },
        ])
        .select()
        .single();

      if (createError) {
        console.error('Error creating user:', createError);
        return res.status(500).json({ error: 'Database error' });
      }

      // Use the newly created user
      user.subscription_status = 'free';
      user.requests_today = 0;
    }

    // STEP 3: Check if user has an active subscription
    if (user.subscription_status !== 'active' && user.subscription_status !== 'free') {
      return res.status(403).json({ 
        error: 'Subscription required',
        message: 'Please subscribe to continue using the service' 
      });
    }

    // STEP 4: Reset daily counter if it's a new day
    const today = new Date().toISOString().split('T')[0];
    if (user.last_request_date !== today) {
      await supabase
        .from('users')
        .update({ 
          requests_today: 0, 
          last_request_date: today 
        })
        .eq('clerk_id', userId);
      user.requests_today = 0;
    }

    // STEP 5: Check rate limits
    const limits = {
      free: 10,
      active: 100,
    };
    const userLimit = limits[user.subscription_status] || 10;

    if (user.requests_today >= userLimit) {
      return res.status(429).json({
        error: 'Rate limit exceeded',
        message: `You've used all ${userLimit} requests today. ${
          user.subscription_status === 'free' 
            ? 'Upgrade to Pro for more requests!' 
            : 'Your limit resets tomorrow.'
        }`,
        limit: userLimit,
        used: user.requests_today,
      });
    }

    // STEP 6: Make the actual Claude API call
    const { messages, max_tokens = 1024 } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Invalid request format' });
    }

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: max_tokens,
      messages: messages,
    });

    // STEP 7: Track usage and costs
    const inputTokens = response.usage.input_tokens;
    const outputTokens = response.usage.output_tokens;
    
    // Calculate cost (Claude Sonnet 4.5 pricing)
    const inputCost = (inputTokens / 1000000) * 3; // $3 per 1M input tokens
    const outputCost = (outputTokens / 1000000) * 15; // $15 per 1M output tokens
    const totalCost = inputCost + outputCost;

    // Update usage in database
    await supabase.from('users').update({
      requests_today: user.requests_today + 1,
      total_requests: user.total_requests + 1,
    }).eq('clerk_id', userId);

    // Log the request for cost tracking
    await supabase.from('usage_logs').insert([
      {
        user_id: userId,
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        cost: totalCost,
        model: 'claude-sonnet-4-20250514',
        created_at: new Date().toISOString(),
      },
    ]);

    // STEP 8: Return the response
    return res.status(200).json({
      content: response.content,
      usage: {
        input_tokens: inputTokens,
        output_tokens: outputTokens,
        requests_remaining: userLimit - (user.requests_today + 1),
      },
    });

  } catch (error) {
    console.error('Error in chat endpoint:', error);
    
    // Handle rate limiting from Anthropic
    if (error.status === 429) {
      return res.status(429).json({
        error: 'Service temporarily busy',
        message: 'Please try again in a moment',
      });
    }

    return res.status(500).json({
      error: 'Internal server error',
      message: 'Something went wrong processing your request',
    });
  }
}
