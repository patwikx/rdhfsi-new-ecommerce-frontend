import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/auth/login',
    signOut: '/',
    error: '/auth/login',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnCheckout = nextUrl.pathname.startsWith('/checkout');
      const isOnOrders = nextUrl.pathname.startsWith('/orders');
      const isOnProfile = nextUrl.pathname.startsWith('/profile');
      
      if (isOnCheckout || isOnOrders || isOnProfile) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      
      return true;
    },
  },
  providers: [], // Add providers with an empty array for now
} satisfies NextAuthConfig;
