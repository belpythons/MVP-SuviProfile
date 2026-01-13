import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
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
    pages: {
        signIn: "/auth/login",
    },
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
            }
            return session;
        },
        async authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isOnAdmin = nextUrl.pathname.startsWith("/admin");
            const isOnAuth = nextUrl.pathname.startsWith("/auth");

            if (isOnAdmin) {
                if (isLoggedIn) return true;
                return false; // Redirect to login
            }

            if (isOnAuth && isLoggedIn) {
                return Response.redirect(new URL("/admin/dashboard", nextUrl));
            }

            return true;
        },
    },
});
