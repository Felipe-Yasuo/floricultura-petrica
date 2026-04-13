import prismaClient from '../../lib/prisma'
import { parsePagination, buildPaginationMeta } from '../../utils/pagination'
import { OrderStatus } from '../../generated/prisma/client'

interface ListOrdersRequest {
    user_id: string
    role: string
    status?: string
    page?: string
    limit?: string
}

export class ListOrdersService {
    async execute({ user_id, role, status, page, limit }: ListOrdersRequest) {
        const { skip, take, page: currentPage, limit: currentLimit } = parsePagination({ page, limit })

        const where = {
            ...(role !== 'ADMIN' && { user_id }),
            ...(status && { status: status as OrderStatus }),
        }

        const [orders, total] = await Promise.all([
            prismaClient.order.findMany({
                where,
                include: {
                    items: {
                        include: {
                            product: {
                                select: {
                                    id: true,
                                    name: true,
                                    banner: true,
                                }
                            }
                        }
                    },
                    address: true,
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take,
            }),
            prismaClient.order.count({ where })
        ])

        const meta = buildPaginationMeta(currentPage, currentLimit, total)

        return { data: orders, meta }
    }
}