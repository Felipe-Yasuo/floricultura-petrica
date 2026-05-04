import { NotFoundError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class DisableCategoryService {
    async execute(id: string) {
        const category = await prismaClient.category.findUnique({
            where: { id }
        })

        if (!category) {
            throw new NotFoundError('Categoria')
        }

        const updated = await prismaClient.category.update({
            where: { id },
            data: { disabled: !category.disabled }
        })

        return updated
    }
}