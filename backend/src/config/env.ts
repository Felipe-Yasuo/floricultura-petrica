import { z } from 'zod'

const envSchema = z.object({
    DATABASE_URL: z.string().url(),
    JWT_SECRET: z.string().min(32),
    PORT: z.coerce.number().default(3333),
    FRONTEND_URL: z.string().url().default('http://localhost:3000'),

    STRIPE_SECRET_KEY: z.string().startsWith('sk_', 'STRIPE_SECRET_KEY deve começar com sk_'),
    STRIPE_WEBHOOK_SECRET: z
        .string()
        .startsWith('whsec_', 'STRIPE_WEBHOOK_SECRET deve começar com whsec_')
        .optional()
        .or(z.literal('')),
    STRIPE_PAYMENT_INTENT_EXPIRATION_MINUTES: z.coerce.number().int().positive().default(30),

    CRON_SECRET: z.string().min(32, 'CRON_SECRET deve ter no mínimo 32 caracteres'),

    GOOGLE_CLIENT_ID: z.string().min(1, 'GOOGLE_CLIENT_ID é obrigatório'),
})

export const env = envSchema.parse(process.env)