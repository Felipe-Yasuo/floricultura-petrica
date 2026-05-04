import { env } from '../config/env'
import { PrismaClient } from '../generated/prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({ connectionString: env.DATABASE_URL })

export const prisma = new PrismaClient({
    adapter,
    log: env.NODE_ENV === 'development' ? ['query', 'warn', 'error'] : ['warn', 'error'],
})

export async function connectDatabase() {
    await prisma.$connect()
}

export async function disconnectDatabase() {
    await prisma.$disconnect()
}

export default prisma
