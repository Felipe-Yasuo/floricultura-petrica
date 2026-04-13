import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class GetProductService {
    async execute(id: string) {
        const product = await prismaClient.product.findUnique({
            where: { id },
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