import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { authConfig } from "./auth.config";

/**
 * Full NextAuth configuration with providers
 * 
 * This file runs in Node.js runtime only (NOT Edge).
 * It imports Prisma and bcrypt for actual authentication.
 * 
 * The middleware uses auth.config.ts instead (Edge-compatible).
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
    // Spread the Edge-compatible config
    ...authConfig,

    // Providers with database access (Node.js only)
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const admin = await db.admin.findUnique({
                        where: { email: credentials.email as string },
                    });

                    if (!admin) {
                        return null;
                    }

                    const passwordMatch = await bcrypt.compare(
                        credentials.password as string,
                        admin.password
                    );

                    if (!passwordMatch) {
                        return null;
                    }

                    return {
                        id: String(admin.id),
                        email: admin.email,
                        name: admin.name,
                    };
                } catch (error) {
                    console.error("Auth error:", error);
                    return null;
                }
            },
        }),
    ],
});
