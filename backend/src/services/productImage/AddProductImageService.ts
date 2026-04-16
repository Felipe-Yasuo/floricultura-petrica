import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface AddProductImageRequest {
    productId: string
    url: string
}

export class AddProductImageService {
    async execute({ productId, url }: AddProductImageRequest) {
        const product = await prismaClient.product.findUnique({
            where: { id: productId }
        })

        if (!product) {
            throw new AppError('Produto não encontrado', 404)
        }

        const lastImage = await prismaClient.productImage.findFirst({
            where: { product_id: productId },
            orderBy: { position: 'desc' }
        })

        const position = lastImage ? lastImage.position + 1 : 0

        const image = await prismaClient.productImage.create({
            data: {
                url,
                position,
                product_id: productId,
            }
        })

        return image
    }
}