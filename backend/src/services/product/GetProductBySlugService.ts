import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class GetProductBySlugService {
    async execute(slug: string) {
        const product = await prismaClient.product.findUnique({
            where: { slug },
            include: {
                category: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                    }
                },
                images: {
                    orderBy: { position: 'asc' }
                }
            }
        })

        if (!product) {
            throw new AppError('Produto não encontrado', 404)
        }

        return product
    }
}