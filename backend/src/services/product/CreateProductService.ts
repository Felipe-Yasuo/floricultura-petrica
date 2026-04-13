import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { slugify } from '../../utils/slugify'

interface CreateProductRequest {
    name: string
    description: string
    price: number
    stock: number
    banner: string
    category_id: string
}

export class CreateProductService {
    async execute({ name, description, price, stock, banner, category_id }: CreateProductRequest) {
        const category = await prismaClient.category.findUnique({
            where: { id: category_id }
        })

        if (!category) {
            throw new AppError('Categoria não encontrada', 404)
        }

        const slug = slugify(name)

        const productExists = await prismaClient.product.findUnique({
            where: { slug }
        })

        if (productExists) {
            throw new AppError('Produto já existe', 409)
        }

        const product = await prismaClient.product.create({
            data: {
                name,
                slug,
                description,
                price,
                stock,
                banner,
                category_id,
            }
        })

        return product
    }
}