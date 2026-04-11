import { z } from 'zod'

// login
export const authUserSchema = z.object({
    body: z.object({
        email: z.string()
            .email('Email inválido')
            .trim()
            .toLowerCase(),
        password: z.string()
            .min(6, 'Senha deve ter no mínimo 6 caracteres')
            .trim()
    })
})

// cadastro
export const createUserSchema = z.object({
    body: z.object({
        name: z
            .string()
            .trim()
            .min(2, 'Nome deve ter no mínimo 2 caracteres')
            .max(100, 'Nome deve ter no máximo 100 caracteres'),
        email: z
            .string()
            .trim()
            .email('Email inválido')
            .toLowerCase(),
        password: z
            .string()
            .min(6, 'Senha deve ter no mínimo 6 caracteres')
            .max(100, 'Senha deve ter no máximo 100 caracteres'),
    }),
})
// atualizar usuário
export const updateUserSchema = z.object({
    params: z.object({
        id: z.string().uuid('ID inválido')
    }),
    body: z.object({
        name: z.string().min(2).trim().optional(),
        email: z.string().email().trim().toLowerCase().optional(),
        password: z.string().min(6).trim().optional()
    })
})

