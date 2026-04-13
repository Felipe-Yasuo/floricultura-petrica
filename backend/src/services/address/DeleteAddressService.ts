import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

export class DeleteAddressService {
    async execute(id: string, user_id: string) {
        const address = await prismaClient.address.findUnique({
            where: { id }
        })

        if (!address || address.user_id !== user_id) {
            throw new AppError('Endereço não encontrado', 404)
        }

        const hasOrders = await prismaClient.order.findFirst({
            where: { address_id: id }
        })

        if (hasOrders) {
            throw new AppError('Endereço vinculado a pedidos não pode ser deletado', 400)
        }

        await prismaClient.address.delete({
            where: { id }
        })
    }
}