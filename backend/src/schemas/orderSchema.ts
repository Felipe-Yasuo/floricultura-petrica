import { z } from 'zod'

export const createOrderSchema = z.object({
    body: z.object({
        address_id: z
            .string()
            .uuid('ID do endereço inválido'),
        deliveryDate: z
            .string()
            .optional(),
        notes: z
            .string()
            .trim()
            .max(500, 'Observações deve ter no máximo 500 caracteres')
            .optional(),
    }),
})

export const updateOrderStatusSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
        status: z.enum(
            ['PENDING', 'CONFIRMED', 'PREPARING', 'DELIVERING', 'DELIVERED', 'CANCELLED'],
            { message: 'Status inválido' }
        ),
    }),
})

export const orderParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})