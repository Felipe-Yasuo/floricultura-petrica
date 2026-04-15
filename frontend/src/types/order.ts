export interface OrderProduct {
    id: string
    name: string
    banner: string
}

export interface OrderItem {
    id: string
    quantity: number
    price: number
    product: OrderProduct
}

export interface Order {
    id: string
    status: string
    total: number
    deliveryDate: string | null
    notes: string | null
    createdAt: string
    updatedAt: string
    items: OrderItem[]
    address: {
        id: string
        street: string
        number: string
        neighborhood: string
        city: string
        state: string
    }
}