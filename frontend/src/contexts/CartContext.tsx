'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { api } from '@/lib/api'
import { useAuth } from './AuthContext'
import { Cart, CartItem } from '@/types/cart'

interface CartContextData {
    cart: Cart
    itemCount: number
    isLoading: boolean
    fetchCart: () => Promise<void>
    addItem: (productId: string, quantity: number) => Promise<void>
    updateItem: (itemId: string, quantity: number) => Promise<void>
    removeItem: (itemId: string) => Promise<void>
    clearCart: () => Promise<void>
}

const CartContext = createContext({} as CartContextData)

const emptyCart: Cart = { items: [], total: 0 }

export function CartProvider({ children }: { children: ReactNode }) {
    const { token, isAuthenticated } = useAuth()
    const [cart, setCart] = useState<Cart>(emptyCart)
    const [isLoading, setIsLoading] = useState(false)

    const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0)

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated || !token) {
            setCart(emptyCart)
            return
        }

        setIsLoading(true)
        try {
            const data = await api('/cart', { token })
            setCart(data)
        } catch {
            setCart(emptyCart)
        } finally {
            setIsLoading(false)
        }
    }, [isAuthenticated, token])

    const addItem = async (productId: string, quantity: number) => {
        if (!token) return

        await api('/cart/items', {
            method: 'POST',
            token,
            body: JSON.stringify({ product_id: productId, quantity }),
        })

        await fetchCart()
    }

    const updateItem = async (itemId: string, quantity: number) => {
        if (!token) return

        await api(`/cart/items/${itemId}`, {
            method: 'PATCH',
            token,
            body: JSON.stringify({ quantity }),
        })

        await fetchCart()
    }

    const removeItem = async (itemId: string) => {
        if (!token) return

        await api(`/cart/items/${itemId}`, {
            method: 'DELETE',
            token,
        })

        await fetchCart()
    }

    const clearCart = async () => {
        if (!token) return

        await api('/cart', {
            method: 'DELETE',
            token,
        })

        setCart(emptyCart)
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                itemCount,
                isLoading,
                fetchCart,
                addItem,
                updateItem,
                removeItem,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    return useContext(CartContext)
}