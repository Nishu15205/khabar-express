import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error'],
    // Fallback keeps the client constructible — and the Vercel build passing —
    // even if DATABASE_URL is not configured. Queries then self-heal on /tmp.
    datasourceUrl: process.env.DATABASE_URL || 'file:/tmp/khabar.db',
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db