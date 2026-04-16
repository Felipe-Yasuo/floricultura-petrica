import prismaClient from '../../lib/prisma'

export class ListAllCategoriesService {
    async execute() {
        const categories = await prismaClient.category.findMany({
            orderBy: { name: 'asc' }
        })

        return categories
    }
}