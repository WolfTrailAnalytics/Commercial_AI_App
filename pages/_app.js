// pages/_app.js
// Main app wrapper - sets up authentication

import { ClerkProvider } from '@clerk/nextjs';
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  return (
    <ClerkProvider {...pageProps}>
      <Component {...pageProps} />
    </ClerkProvider>
  );
}

export default MyApp;
