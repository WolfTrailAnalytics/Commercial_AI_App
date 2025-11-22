import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div style={styles.container}>
      <SignUp />
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
  },
};