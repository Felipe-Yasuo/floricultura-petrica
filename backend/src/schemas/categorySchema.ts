import { z } from 'zod'

export const createCategorySchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, 'Nome deve ter no mínimo 2 caracteres')
            .max(100, 'Nome deve ter no máximo 100 caracteres'),
        image: z
            .string()
            .url('URL da imagem inválida')
            .optional(),
    }),
})

export const updateCategorySchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, 'Nome deve ter no mínimo 2 caracteres')
            .max(100, 'Nome deve ter no máximo 100 caracteres')
            .optional(),
        image: z
            .string()
            .url('URL da imagem inválida')
            .optional(),
    }),
})

export const categoryParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})