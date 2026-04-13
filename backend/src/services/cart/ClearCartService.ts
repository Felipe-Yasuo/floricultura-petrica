import prismaClient from '../../lib/prisma'

export class ClearCartService {
    async execute(user_id: string) {
        const cart = await prismaClient.cart.findUnique({
            where: { user_id }
        })

        if (!cart) return

        await prismaClient.cartItem.deleteMany({
            where: { cart_id: cart.id }
        })
    }
}