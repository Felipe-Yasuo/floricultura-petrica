import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const connectionString = `${process.env.DATABASE_URL!}`
const adapter = new PrismaPg({ connectionString })

const prismaClient = new PrismaClient({ adapter })

prismaClient.$connect()
    .then(() => console.log('✅ Banco conectado com sucesso'))
    .catch((err) => console.error('❌ Erro ao conectar no banco:', err))

export default prismaClient