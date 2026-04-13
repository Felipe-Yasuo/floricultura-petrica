import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { slugify } from '../../utils/slugify'

interface UpdateProductRequest {
    id: string
    name?: string
    description?: string
    price?: number
    stock?: number
    banner?: string
    category_id?: string
}

export class UpdateProductService {
    async execute({ id, name, description, price, stock, banner, category_id }: UpdateProductRequest) {
        const product = await prismaClient.product.findUnique({
            where: { id }
        })

        if (!product) {
            throw new AppError('Produto não encontrado', 404)
        }

        const data: Record<string, unknown> = {}

        if (name) {
            const slug = slugify(name)

            const slugExists = await prismaClient.product.findUnique({
                where: { slug }
            })

            if (slugExists && slugExists.id !== id) {
                throw new AppError('Já existe um produto com esse nome', 409)
            }

            data.name = name
            data.slug = slug
        }

        if (description !== undefined) data.description = description
        if (price !== undefined) data.price = price
        if (stock !== undefined) data.stock = stock
        if (banner !== undefined) data.banner = banner

        if (category_id) {
            const category = await prismaClient.category.findUnique({
                where: { id: category_id }
            })

            if (!category) {
                throw new AppError('Categoria não encontrada', 404)
            }

            data.category_id = category_id
        }

        const updated = await prismaClient.product.update({
            where: { id },
            data,
        })

        return updated
    }
}