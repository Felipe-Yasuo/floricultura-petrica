import { z } from 'zod'

export const addProductImageSchema = z.object({
    params: z.object({
        productId: z.string().uuid('ID do produto inválido'),
    }),
    body: z.object({
        url: z.string().min(1, 'URL é obrigatória'),
    }),
})

export const productImageParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})