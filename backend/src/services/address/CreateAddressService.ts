import prismaClient from '../../lib/prisma'

interface CreateAddressRequest {
    user_id: string
    label?: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isDefault?: boolean
}

export class CreateAddressService {
    async execute({ user_id, isDefault, ...data }: CreateAddressRequest) {
        if (isDefault) {
            await prismaClient.address.updateMany({
                where: { user_id, isDefault: true },
                data: { isDefault: false }
            })
        }

        const address = await prismaClient.address.create({
            data: {
                ...data,
                user_id,
                isDefault: isDefault ?? false,
            }
        })

        return address
    }
}