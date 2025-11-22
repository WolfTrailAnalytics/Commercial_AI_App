// middleware.js
// Protects routes - requires authentication for certain pages

import { authMiddleware } from '@clerk/nextjs';

export default authMiddleware({
    publicRoutes: [
        '/',
        '/pricing',
        '/api/stripe-webhook',
    ],
});

export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};