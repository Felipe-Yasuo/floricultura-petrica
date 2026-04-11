import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { slugify } from '../../utils/slugify'

interface CreateCategoryRequest {
    name: string
    image?: string
}

export class CreateCategoryService {
    async execute({ name, image }: CreateCategoryRequest) {
        const slug = slugify(name)

        const categoryExists = await prismaClient.category.findUnique({
            where: { slug }
        })

        if (categoryExists) {
            throw new AppError('Categoria já existe', 409)
        }

        const category = await prismaClient.category.create({
            data: {
                name,
                slug,
                image,
            }
        })

        return category
    }
}