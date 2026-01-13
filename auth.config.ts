import type { NextAuthConfig } from "next-auth";

/**
 * Edge-compatible NextAuth configuration
 * 
 * This file contains ONLY lightweight configuration that can run in Edge Runtime.
 * DO NOT import Prisma, bcrypt, or any heavy Node.js libraries here.
 * 
 * The actual authentication providers are defined in auth.ts (Node.js runtime only).
 */
export const authConfig = {
    // Empty providers - actual providers are in auth.ts
    providers: [],

    // Custom pages
    pages: {
        signIn: "/auth/login",
    },

    // Session configuration
    session: {
        strategy: "jwt",
    },

    // Callbacks (Edge-compatible - no database access)
    callbacks: {
        // JWT callback - adds user ID to token
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },

        // Session callback - adds user ID to session
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },

        // Authorization callback - route protection logic
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnAuth = nextUrl.pathname.startsWith("/auth");

            // Protect admin routes
            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            // Redirect logged-in users away from auth pages
            if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL("/admin/dashboard", nextUrl));
            }

            return true;
        },
    },
} satisfies NextAuthConfig;
