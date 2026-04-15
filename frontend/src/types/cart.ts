export interface CartProduct {
    id: string
    name: string
    price: number
    banner: string
}

export interface CartItem {
    id: string
    quantity: number
    product: CartProduct
}

export interface Cart {
    items: CartItem[]
    total: number
}