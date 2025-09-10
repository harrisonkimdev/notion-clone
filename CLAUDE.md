# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Pile Hive is a document organization workspace built with Next.js 15, featuring pile-based organization with drag-and-drop functionality. The application allows users to organize documents into smart piles using a file explorer-style interface.

## Tech Stack

- **Framework**: Next.js 15 (App Router with Server Actions)
- **Database**: SQLite with Prisma ORM (configured for local dev, can switch to PostgreSQL for production)
- **Authentication**: NextAuth.js v4 with Google OAuth and Prisma adapter
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives with shadcn/ui patterns
- **Drag & Drop**: react-dnd with HTML5 backend
- **TypeScript**: Full TypeScript support with strict configuration
- **Fonts**: Geist Sans and Geist Mono from next/font/google

## Common Commands

```bash
# Development
npm run dev              # Start development server with Turbo
npm run build            # Production build with Turbo
npm start               # Start production server
npm run lint            # Run ESLint

# Database
npx prisma generate     # Generate Prisma client (runs on postinstall)
npx prisma migrate dev  # Run database migrations
npx prisma studio       # Open Prisma Studio GUI
npx prisma db push      # Push schema changes to database

# Deployment
npm run vercel-build    # Build command used by Vercel (includes prisma generate)
```

## Architecture & Code Organization

### Directory Structure
```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/[...nextauth]/  # NextAuth.js API route
│   ├── privacy/           # Static pages
│   ├── terms/
│   ├── layout.tsx         # Root layout with auth provider
│   └── page.tsx          # Home page
├── components/
│   ├── ui/               # Reusable UI components (shadcn/ui style)
│   ├── providers/        # React context providers (session, etc.)
│   └── LandingPage.tsx   # Main drag-and-drop interface
└── lib/
    ├── auth.ts          # NextAuth configuration
    ├── prisma.ts        # Prisma client setup
    └── utils.ts         # Utility functions
```

### Database Schema
The Prisma schema uses SQLite for development and includes:
- NextAuth.js tables (User, Account, Session, VerificationToken)
- Document model with hierarchical relationships (parent/children)
- User-document associations with proper indexing

### Authentication Flow
- Google OAuth via NextAuth.js
- JWT session strategy with custom callbacks
- User ID attached to session for client-side usage
- Comprehensive logging for debugging auth issues

## Key Architectural Patterns

### Component Patterns
- UI components follow shadcn/ui conventions with class-variance-authority
- Drag-and-drop implemented with react-dnd using type-safe patterns
- Server and client components properly separated

### Database Patterns
- Global Prisma client with development singleton pattern
- Query logging enabled for debugging
- Proper Cascade deletion relationships

### Environment Configuration
Required environment variables:
- `DATABASE_URL`: SQLite file path or PostgreSQL connection string
- `NEXTAUTH_SECRET` (or `AUTH_SECRET` as fallback)
- `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` for OAuth
- `NEXTAUTH_URL`: Application base URL

## Development Notes

- Uses Turbo for fast builds and development
- ESLint configured with Next.js and Prettier rules
- PostCSS with Tailwind CSS v4
- TypeScript strict mode enabled
- The database schema shows SQLite is used for local development but can be switched to PostgreSQL for production by changing the provider in schema.prisma