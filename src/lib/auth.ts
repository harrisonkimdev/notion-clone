import { PrismaAdapter } from "@auth/prisma-adapter"
import type { Account, Profile, Session, User } from "next-auth"
import NextAuth, { NextAuthOptions } from "next-auth"
import type { JWT } from "next-auth/jwt"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "./prisma"

// Basic env checks to make debugging easier during development
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    "Warning: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set. Google provider will fail."
  )
}
const secretValue = process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET
if (!secretValue) {
  console.warn(
    "Warning: NEXTAUTH_SECRET or AUTH_SECRET is not set. NextAuth may throw MissingSecret errors in production environments."
  )
} else if (!process.env.NEXTAUTH_SECRET && process.env.AUTH_SECRET) {
  console.warn(
    "Note: using AUTH_SECRET as a fallback for NEXTAUTH_SECRET. Consider setting NEXTAUTH_SECRET for clarity."
  )
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // prefer NEXTAUTH_SECRET, fallback to AUTH_SECRET for compatibility
  secret: secretValue,
  // log NextAuth internals and events to the server console for debugging
  logger: {
    error(code: string | Error, ...rest: unknown[]) {
      console.error("nextauth:logger:error", code, ...rest)
    },
    warn(code: string | Error, ...rest: unknown[]) {
      console.warn("nextauth:logger:warn", code, ...rest)
    },
    debug(code: string | Error, ...rest: unknown[]) {
      console.debug("nextauth:logger:debug", code, ...rest)
    },
  },
  events: {
    async signIn(message: { user: User; account: Account | null; profile?: Profile; isNewUser?: boolean }) {
      console.log("nextauth:event:signIn", message)
    },
    async createUser(message: { user: User }) {
      console.log("nextauth:event:createUser", message)
    },
  },
  callbacks: {
    // attach prisma user id to session for client-side usage
    session: ({ session, token }: { session: Session; token: JWT }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
      },
    }),
    // debug: log signIn callback data to diagnose callback failures
    async signIn({ user, account, profile }: { user: User; account: Account | null; profile?: Profile }) {
      console.log("NEXTAUTH signIn callback:", { user, account, profile })
      return true
    },
    // jwt callback to add user id to token
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
