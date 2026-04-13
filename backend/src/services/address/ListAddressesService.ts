import prismaClient from '../../lib/prisma'

export class ListAddressesService {
    async execute(user_id: string) {
        const addresses = await prismaClient.address.findMany({
            where: { user_id },
            orderBy: { isDefault: 'desc' }
        })

        return addresses
    }
}