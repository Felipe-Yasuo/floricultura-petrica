export interface FieldErrors {
    name?: string
    description?: string
    price?: string
    stock?: string
    banner?: string
    category_id?: string
}

interface FormData {
    name: string
    description: string
    priceCents: number
    stock: string
    banner: string
    category_id: string
}

export function validateProductForm(form: FormData): FieldErrors {
    const errors: FieldErrors = {}

    if (!form.name.trim()) errors.name = 'Nome é obrigatório'
    else if (form.name.trim().length < 2) errors.name = 'Nome deve ter no mínimo 2 caracteres'

    if (!form.description.trim()) errors.description = 'Descrição é obrigatória'
    else if (form.description.trim().length < 10) errors.description = 'Descrição deve ter no mínimo 10 caracteres'

    if (form.priceCents <= 0) errors.price = 'Preço deve ser maior que zero'

    if (!form.stock) errors.stock = 'Estoque é obrigatório'
    else if (Number(form.stock) < 0) errors.stock = 'Estoque não pode ser negativo'

    if (!form.banner) errors.banner = 'Imagem é obrigatória'

    if (!form.category_id) errors.category_id = 'Selecione uma categoria'

    return errors
}