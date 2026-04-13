import { z } from 'zod'

export const addCartItemSchema = z.object({
    body: z.object({
        product_id: z
            .string()
            .uuid('ID do produto inválido'),
        quantity: z
            .number()
            .int('Quantidade deve ser número inteiro')
            .positive('Quantidade deve ser maior que zero'),
    }),
})

export const updateCartItemSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
        quantity: z
            .number()
            .int('Quantidade deve ser número inteiro')
            .positive('Quantidade deve ser maior que zero'),
    }),
})

export const cartItemParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})