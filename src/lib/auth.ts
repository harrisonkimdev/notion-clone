import { PrismaAdapter } from "@auth/prisma-adapter"
import NextAuth, { NextAuthOptions } from "next-auth"
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
    error(code: any, ...rest: any[]) {
      console.error("nextauth:logger:error", code, ...rest)
    },
    warn(code: any, ...rest: any[]) {
      console.warn("nextauth:logger:warn", code, ...rest)
    },
    debug(code: any, ...rest: any[]) {
      console.debug("nextauth:logger:debug", code, ...rest)
    },
  } as any,
  events: {
    async error(message: any) {
      console.error("nextauth:event:error", message)
    },
    async signIn(message: any) {
      console.log("nextauth:event:signIn", message)
    },
    async createUser(message: any) {
      console.log("nextauth:event:createUser", message)
    },
  } as any,
  callbacks: {
    // attach prisma user id to session for client-side usage
    session: ({ session, token }) => ({
      ...session,
      user: {
        ...session.user,
        id: token.id,
      },
    }),
    // debug: log signIn callback data to diagnose callback failures
    async signIn({ user, account, profile }) {
      console.log("NEXTAUTH signIn callback:", { user, account, profile })
      return true
    },
    // jwt callback to add user id to token
    async jwt({ token, user }) {
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
