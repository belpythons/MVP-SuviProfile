import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

/**
 * Edge Middleware for route protection
 * 
 * Uses ONLY the Edge-compatible auth config (no Prisma/bcrypt).
 * This keeps the middleware bundle size under Vercel's 1MB limit.
 */
export default NextAuth(authConfig).auth;

export const config = {
    matcher: [
        // Match all admin routes
        "/admin/:path*",
        // Match auth routes
        "/auth/:path*",
    ],
};
