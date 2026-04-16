import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class DeleteProductImageService {
    async execute(id: string) {
        const image = await prismaClient.productImage.findUnique({
            where: { id }
        })

        if (!image) {
            throw new AppError('Imagem não encontrada', 404)
        }

        await prismaClient.productImage.delete({
            where: { id }
        })
    }
}