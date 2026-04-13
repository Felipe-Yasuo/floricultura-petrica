interface PaginationQuery {
    page?: string
    limit?: string
}

interface PaginationResult {
    skip: number
    take: number
    page: number
    limit: number
}

export function parsePagination(query: PaginationQuery): PaginationResult {
    const page = Math.max(1, Number(query.page) || 1)
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10))
    const skip = (page - 1) * limit

    return { skip, take: limit, page, limit }
}

interface PaginationMeta {
    page: number
    limit: number
    total: number
    totalPages: number
}

export function buildPaginationMeta(page: number, limit: number, total: number): PaginationMeta {
    return {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
    }
}