import prismaClient from '../../lib/prisma'

interface ListProductsRequest {
    category_id?: string
}

export class ListProductsService {
    async execute({ category_id }: ListProductsRequest) {
        const products = await prismaClient.product.findMany({
            where: {
                disabled: false,
                ...(category_id && { category_id }),
            },
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