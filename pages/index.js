// pages/index.js
// Your landing page - first thing visitors see

export default function Home() {
  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>YourAI App</h1>
        <nav style={styles.nav}>
          <a href="/pricing" style={styles.navLink}>Pricing</a>
          <a href="/sign-in" style={styles.navLink}>Sign In</a>
          <a href="/sign-up" style={styles.button}>Get Started</a>
        </nav>
      </header>

      <main style={styles.hero}>
        <h1 style={styles.heroTitle}>
          AI-Powered Assistant<br />Built for Your Needs
        </h1>
        <p style={styles.heroSubtitle}>
          Get instant answers, creative content, and problem-solving help
          powered by Claude AI
        </p>
        <a href="/sign-up" style={styles.ctaButton}>
          Start Free Trial
        </a>
        <p style={styles.freeText}>10 free requests per day • No credit card required</p>
      </main>

      <section style={styles.features}>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>⚡</div>
          <h3>Lightning Fast</h3>
          <p>Get responses in seconds, not minutes</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>🔒</div>
          <h3>Secure & Private</h3>
          <p>Your conversations are encrypted and private</p>
        </div>
        <div style={styles.feature}>
          <div style={styles.featureIcon}>💡</div>
          <h3>Smart AI</h3>
          <p>Powered by Claude, one of the most capable AI models</p>
        </div>
      </section>

      <section style={styles.cta}>
        <h2 style={styles.ctaTitle}>Ready to get started?</h2>
        <a href="/sign-up" style={styles.ctaButton}>
          Create Free Account
        </a>
      </section>

      <footer style={styles.footer}>
        <p>© 2024 YourAI App. All rights reserved.</p>
        <div style={styles.footerLinks}>
          <a href="/privacy">Privacy</a>
          <a href="/terms">Terms</a>
          <a href="/contact">Contact</a>
        </div>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '20px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    margin: 0,
  },
  nav: {
    display: 'flex',
    gap: '20px',
    alignItems: 'center',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  button: {
    padding: '10px 20px',
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '6px',
    fontWeight: '600',
  },
  hero: {
    textAlign: 'center',
    padding: '100px 20px',
    maxWidth: '800px',
    margin: '0 auto',
  },
  heroTitle: {
    fontSize: '3.5rem',
    fontWeight: 'bold',
    marginBottom: '20px',
    lineHeight: '1.2',
  },
  heroSubtitle: {
    fontSize: '1.3rem',
    marginBottom: '40px',
    opacity: 0.9,
  },
  ctaButton: {
    display: 'inline-block',
    padding: '16px 40px',
    background: 'white',
    color: '#667eea',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    transition: 'transform 0.2s',
  },
  freeText: {
    marginTop: '20px',
    fontSize: '0.9rem',
    opacity: 0.8,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '40px',
    padding: '80px 60px',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  feature: {
    textAlign: 'center',
    padding: '30px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '12px',
    backdropFilter: 'blur(10px)',
  },
  featureIcon: {
    fontSize: '3rem',
    marginBottom: '15px',
  },
  cta: {
    textAlign: 'center',
    padding: '80px 20px',
  },
  ctaTitle: {
    fontSize: '2.5rem',
    marginBottom: '30px',
  },
  footer: {
    borderTop: '1px solid rgba(255,255,255,0.2)',
    padding: '40px 60px',
    textAlign: 'center',
    marginTop: '40px',
  },
  footerLinks: {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    marginTop: '20px',
  },
};
