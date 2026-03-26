import { Auth0Client } from '@auth0/nextjs-auth0/server';

export const auth0 = new Auth0Client({
  authorizationParameters: {
    // CRITICAL: This guarantees the token is valid for your Spring Boot backend
    audience: process.env.AUTH0_AUDIENCE,
    scope: 'openid profile email'
  }
});