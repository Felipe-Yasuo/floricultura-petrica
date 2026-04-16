import prismaClient from '../../lib/prisma'

export class ListProductImagesService {
    async execute(productId: string) {
        const images = await prismaClient.productImage.findMany({
            where: { product_id: productId },
            orderBy: { position: 'asc' }
        })

        return images
    }
}