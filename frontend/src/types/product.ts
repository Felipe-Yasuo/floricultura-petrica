export interface ProductCategory {
    id: string
    name: string
    slug: string
}

export interface ProductImage {
    id: string
    url: string
    position: number
    product_id: string
    createdAt: string
}

export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    stock: number
    banner: string
    disabled: boolean
    category_id: string
    category: ProductCategory
    images?: ProductImage[]
    createdAt: string
    updatedAt: string
}

export interface ProductsResponse {
    data: Product[]
    meta: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}