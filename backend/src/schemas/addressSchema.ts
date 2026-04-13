import { z } from 'zod'

export const createAddressSchema = z.object({
    body: z.object({
        label: z
            .string()
            .trim()
            .max(50, 'Label deve ter no máximo 50 caracteres')
            .optional(),
        street: z
            .string()
            .trim()
            .min(2, 'Rua deve ter no mínimo 2 caracteres'),
        number: z
            .string()
            .trim()
            .min(1, 'Número é obrigatório'),
        complement: z
            .string()
            .trim()
            .optional(),
        neighborhood: z
            .string()
            .trim()
            .min(2, 'Bairro deve ter no mínimo 2 caracteres'),
        city: z
            .string()
            .trim()
            .min(2, 'Cidade deve ter no mínimo 2 caracteres'),
        state: z
            .string()
            .trim()
            .length(2, 'Estado deve ter 2 caracteres (ex: SP, RJ)'),
        zipCode: z
            .string()
            .trim()
            .regex(/^\d{5}-?\d{3}$/, 'CEP inválido (ex: 86000-000)'),
        isDefault: z
            .boolean()
            .optional(),
    }),
})

export const updateAddressSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
    body: z.object({
        label: z.string().trim().max(50).optional(),
        street: z.string().trim().min(2).optional(),
        number: z.string().trim().min(1).optional(),
        complement: z.string().trim().optional(),
        neighborhood: z.string().trim().min(2).optional(),
        city: z.string().trim().min(2).optional(),
        state: z.string().trim().length(2).optional(),
        zipCode: z.string().trim().regex(/^\d{5}-?\d{3}$/).optional(),
        isDefault: z.boolean().optional(),
    }),
})

export const addressParamsSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido'),
    }),
})