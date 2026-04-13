import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class DisableProductService {
    async execute(id: string) {
        const product = await prismaClient.product.findUnique({
            where: { id }
        })

        if (!product) {
            throw new AppError('Produto não encontrado', 404)
        }

        const updated = await prismaClient.product.update({
            where: { id },
            data: { disabled: !product.disabled }
        })

        return updated
    }
}