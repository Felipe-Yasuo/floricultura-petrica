import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface RemoveCartItemRequest {
    id: string
    user_id: string
}

export class RemoveCartItemService {
    async execute({ id, user_id }: RemoveCartItemRequest) {
        const item = await prismaClient.cartItem.findUnique({
            where: { id },
            include: { cart: true }
        })

        if (!item || item.cart.user_id !== user_id) {
            throw new AppError('Item não encontrado', 404)
        }

        await prismaClient.cartItem.delete({
            where: { id }
        })
    }
}

