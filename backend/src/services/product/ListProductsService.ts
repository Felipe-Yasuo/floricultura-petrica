import prismaClient from '../../lib/prisma'
import { parsePagination, buildPaginationMeta } from '../../utils/pagination'

interface ListProductsRequest {
    category_id?: string
    search?: string
    page?: string
    limit?: string
}

export class ListProductsService {
    async execute({ category_id, search, page, limit }: ListProductsRequest) {
        const { skip, take, page: currentPage, limit: currentLimit } = parsePagination({ page, limit })

        const where = {
            disabled: false,
            ...(category_id && { category_id }),
            ...(search && {
                name: {
                    contains: search,
                    mode: 'insensitive' as const,
                }
            }),
        }

        const [products, total] = await Promise.all([
            prismaClient.product.findMany({
                where,
                include: {
                    category: {
                        select: {
                            id: true,
                            name: true,
                            slug: true,
                        }
                    }
                },
                orderBy: { name: 'asc' },
                skip,
                take,
            }),
            prismaClient.product.count({ where })
        ])

        const meta = buildPaginationMeta(currentPage, currentLimit, total)

        return { data: products, meta }
    }
}