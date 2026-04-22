import { z } from 'zod'

export const productSchema = z.object({
    name: z.string().min(2, { error: 'Nome deve ter no mínimo 2 caracteres' }),
    description: z.string().min(10, { error: 'Descrição deve ter no mínimo 10 caracteres' }),
    priceCents: z.number({ error: 'Preço inválido' }).min(1, { error: 'Preço deve ser maior que zero' }),
    stock: z.string().min(1, { error: 'Estoque é obrigatório' }).refine(
        (v) => Number(v) >= 0,
        { error: 'Estoque não pode ser negativo' }
    ),
    banner: z.string().min(1, { error: 'Imagem é obrigatória' }),
    category_id: z.string().min(1, { error: 'Selecione uma categoria' }),
})

export type FieldErrors = Partial<Record<keyof z.infer<typeof productSchema>, string>>
