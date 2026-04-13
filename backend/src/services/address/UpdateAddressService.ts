import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface UpdateAddressRequest {
    id: string
    user_id: string
    label?: string
    street?: string
    number?: string
    complement?: string
    neighborhood?: string
    city?: string
    state?: string
    zipCode?: string
    isDefault?: boolean
}

export class UpdateAddressService {
    async execute({ id, user_id, isDefault, ...data }: UpdateAddressRequest) {
        const address = await prismaClient.address.findUnique({
            where: { id }
        })

        if (!address || address.user_id !== user_id) {
            throw new AppError('Endereço não encontrado', 404)
        }

        if (isDefault) {
            await prismaClient.address.updateMany({
                where: { user_id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const updated = await prismaClient.address.update({
            where: { id },
            data: {
                ...data,
                ...(isDefault !== undefined && { isDefault }),
            }
        })

        return updated
    }
}