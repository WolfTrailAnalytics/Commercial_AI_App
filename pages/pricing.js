// pages/pricing.js
// Pricing page showing subscription tiers

import { useUser } from '@clerk/nextjs';

export default function Pricing() {
  const { isSignedIn } = useUser();

  const handleSubscribe = async (priceId) => {
    if (!isSignedIn) {
      window.location.href = '/sign-up';
      return;
    }

    try {
      // Call your backend to create Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to start checkout');
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>YourAI App</h1>
        <a href="/" style={styles.backLink}>← Back to Home</a>
      </header>

      <main style={styles.main}>
        <h1 style={styles.title}>Simple, Transparent Pricing</h1>
        <p style={styles.subtitle}>Choose the plan that's right for you</p>

        <div style={styles.plans}>
          {/* Free Plan */}
          <div style={styles.plan}>
            <div style={styles.planHeader}>
              <h3 style={styles.planName}>Free</h3>
              <div style={styles.price}>
                <span style={styles.priceAmount}>$0</span>
                <span style={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul style={styles.features}>
              <li>✓ 10 requests per day</li>
              <li>✓ Access to Claude AI</li>
              <li>✓ No credit card required</li>
              <li>✓ Email support</li>
            </ul>
            <a href="/sign-up" style={styles.planButton}>
              Get Started Free
            </a>
          </div>

          {/* Pro Plan */}
          <div style={{...styles.plan, ...styles.planPopular}}>
            <div style={styles.popularBadge}>MOST POPULAR</div>
            <div style={styles.planHeader}>
              <h3 style={styles.planName}>Pro</h3>
              <div style={styles.price}>
                <span style={styles.priceAmount}>$29</span>
                <span style={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul style={styles.features}>
              <li>✓ 100 requests per day</li>
              <li>✓ Access to Claude AI</li>
              <li>✓ Priority support</li>
              <li>✓ Advanced features</li>
              <li>✓ Conversation history</li>
            </ul>
            <button 
                          onClick={() => handleSubscribe('price_1SVuksC54uwcxVNRWfiD1VfG')} 
              style={{...styles.planButton, ...styles.planButtonPrimary}}
            >
              Subscribe to Pro
            </button>
          </div>

          {/* Enterprise Plan */}
          <div style={styles.plan}>
            <div style={styles.planHeader}>
              <h3 style={styles.planName}>Enterprise</h3>
              <div style={styles.price}>
                <span style={styles.priceAmount}>$99</span>
                <span style={styles.pricePeriod}>/month</span>
              </div>
            </div>
            <ul style={styles.features}>
              <li>✓ Unlimited requests</li>
              <li>✓ Bring your own API key</li>
              <li>✓ Team collaboration</li>
              <li>✓ Custom integrations</li>
              <li>✓ Dedicated support</li>
            </ul>
            <button 
                          onClick={() => handleSubscribe('price_1SVuqLC54uwcxVNRqwIwl2p9')} 
              style={styles.planButton}
            >
              Subscribe to Enterprise
            </button>
          </div>
        </div>

        <div style={styles.faq}>
          <h2>Frequently Asked Questions</h2>
          <div style={styles.faqItem}>
            <h4>Can I cancel anytime?</h4>
            <p>Yes! Cancel your subscription at any time from your account settings.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>What happens when I reach my daily limit?</h4>
            <p>Your limit resets every 24 hours. Upgrade to a higher tier for more requests.</p>
          </div>
          <div style={styles.faqItem}>
            <h4>Do you offer refunds?</h4>
            <p>Yes, we offer a 14-day money-back guarantee on all paid plans.</p>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  backLink: {
    color: 'white',
    textDecoration: 'none',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '60px 20px',
  },
  title: {
    fontSize: '3rem',
    fontWeight: 'bold',
    textAlign: 'center',
    color: 'white',
    marginBottom: '10px',
  },
  subtitle: {
    fontSize: '1.2rem',
    textAlign: 'center',
    color: 'rgba(255,255,255,0.9)',
    marginBottom: '60px',
  },
  plans: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    marginBottom: '80px',
  },
  plan: {
    background: 'white',
    borderRadius: '16px',
    padding: '40px 30px',
    position: 'relative',
    boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
  },
  planPopular: {
    transform: 'scale(1.05)',
    border: '3px solid #FFD700',
  },
  popularBadge: {
    position: 'absolute',
    top: '-15px',
    left: '50%',
    transform: 'translateX(-50%)',
    background: '#FFD700',
    color: '#333',
    padding: '6px 20px',
    borderRadius: '20px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  planHeader: {
    marginBottom: '30px',
  },
  planName: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    marginBottom: '10px',
    color: '#333',
  },
  price: {
    display: 'flex',
    alignItems: 'baseline',
    gap: '5px',
  },
  priceAmount: {
    fontSize: '3rem',
    fontWeight: 'bold',
    color: '#667eea',
  },
  pricePeriod: {
    fontSize: '1rem',
    color: '#999',
  },
  features: {
    listStyle: 'none',
    padding: 0,
    marginBottom: '30px',
  },
  planButton: {
    width: '100%',
    padding: '14px',
    background: '#f5f5f5',
    color: '#333',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'block',
    textAlign: 'center',
    transition: 'all 0.2s',
  },
  planButtonPrimary: {
    background: '#667eea',
    color: 'white',
    border: 'none',
  },
  faq: {
    background: 'rgba(255,255,255,0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    padding: '40px',
    color: 'white',
  },
  faqItem: {
    marginBottom: '30px',
  },
};
