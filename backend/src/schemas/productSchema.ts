import { z } from 'zod'

export const createProductSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, 'Nome deve ter no mínimo 2 caracteres')
            .max(100, 'Nome deve ter no máximo 100 caracteres'),
        description: z
            .string()
            .trim()
            .min(10, 'Descrição deve ter no mínimo 10 caracteres')
            .max(1000, 'Descrição deve ter no máximo 1000 caracteres'),
        price: z
            .number()
            .int('Preço deve ser em centavos (número inteiro)')
            .positive('Preço deve ser maior que zero'),
        stock: z
            .number()
            .int('Estoque deve ser número inteiro')
            .min(0, 'Estoque não pode ser negativo')
            .default(0),
        banner: z
            .string()
            .url('URL da imagem inválida'),
        category_id: z
            .string()
            .uuid('ID da categoria inválido'),
    }),
})

export const updateProductSchema = z.object({
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
        description: z
            .string()
            .trim()
            .min(10, 'Descrição deve ter no mínimo 10 caracteres')
            .max(1000, 'Descrição deve ter no máximo 1000 caracteres')
            .optional(),
        price: z
            .number()
            .int('Preço deve ser em centavos (número inteiro)')
            .positive('Preço deve ser maior que zero')
            .optional(),
        stock: z
            .number()
            .int('Estoque deve ser número inteiro')
            .min(0, 'Estoque não pode ser negativo')
            .optional(),
        banner: z
            .string()
            .url('URL da imagem inválida')
            .optional(),
        category_id: z
            .string()
            .uuid('ID da categoria inválido')
            .optional(),
    }),
})

export const productParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})