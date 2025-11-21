import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div style={styles.container}>
      <SignIn 
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-white shadow-xl"
          }
        }}
        routing="path"
        path="/sign-in"
        signUpUrl="/sign-up"
      />
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