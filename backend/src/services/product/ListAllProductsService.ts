import prismaClient from '../../lib/prisma'

export class ListAllProductsService {
    async execute() {
        const products = await prismaClient.product.findMany({
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                }
            },
            orderBy: { name: 'asc' }
        })

        return products
    }
}