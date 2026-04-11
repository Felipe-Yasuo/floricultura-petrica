import prismaClient from '../../lib/prisma'

export class ListCategoriesService {
    async execute() {
        const categories = await prismaClient.category.findMany({
            where: { disabled: false },
            orderBy: { name: 'asc' }
        })

        return categories
    }
}