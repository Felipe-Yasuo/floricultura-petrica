import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface UpdateCartItemRequest {
    id: string
    user_id: string
    quantity: number
}

export class UpdateCartItemService {
    async execute({ id, user_id, quantity }: UpdateCartItemRequest) {
        const item = await prismaClient.cartItem.findUnique({
            where: { id },
            include: { cart: true, product: true }
        })

        if (!item || item.cart.user_id !== user_id) {
            throw new AppError('Item não encontrado', 404)
        }

        if (item.product.stock < quantity) {
            throw new AppError('Estoque insuficiente', 400)
        }

        const updated = await prismaClient.cartItem.update({
            where: { id },
            data: { quantity },
            include: { product: true }
        })

        return updated
    }
}