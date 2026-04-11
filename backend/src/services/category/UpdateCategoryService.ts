import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { slugify } from '../../utils/slugify'

interface UpdateCategoryRequest {
    id: string
    name?: string
    image?: string
}

export class UpdateCategoryService {
    async execute({ id, name, image }: UpdateCategoryRequest) {
        const category = await prismaClient.category.findUnique({
            where: { id }
        })

        if (!category) {
            throw new AppError('Categoria não encontrada', 404)
        }

        const data: { name?: string; slug?: string; image?: string } = {}

        if (name) {
            const slug = slugify(name)

            const slugExists = await prismaClient.category.findUnique({
                where: { slug }
            })

            if (slugExists && slugExists.id !== id) {
                throw new AppError('Já existe uma categoria com esse nome', 409)
            }

            data.name = name
            data.slug = slug
        }

        if (image !== undefined) {
            data.image = image
        }

        const updated = await prismaClient.category.update({
            where: { id },
            data,
        })

        return updated
    }
}