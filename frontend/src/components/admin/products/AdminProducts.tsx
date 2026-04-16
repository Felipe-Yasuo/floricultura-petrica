'use client'

import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { Product } from '@/types/product'
import ProductForm from './ProductForm'
import ProductTable from './ProductTable'

export default function AdminProducts() {
    const { token } = useAuth()
    const [products, setProducts] = useState<Product[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    useEffect(() => {
        if (token) {
            fetchProducts()
        }
    }, [token])

    const fetchProducts = async () => {
        try {
            const res = await api('/products/all', { token: token! })
            setProducts(res.data || res)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setEditingProduct(null)
    }

    const handleFormSaved = () => {
        setShowForm(false)
        setEditingProduct(null)
        fetchProducts()
    }

    const handleToggleDisable = async (product: Product) => {
        try {
            await api(`/products/${product.id}/disable`, {
                method: 'PATCH',
                token: token!,
            })
            await fetchProducts()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-32">
                <Loader2 size={32} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                <h1 className="font-serif text-2xl lg:text-3xl">Produtos</h1>
                <button
                    onClick={() => { setEditingProduct(null); setShowForm(true) }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                >
                    <Plus size={16} />
                    Novo Produto
                </button>
            </div>

            {showForm && (
                <ProductForm
                    product={editingProduct}
                    onClose={handleFormClose}
                    onSaved={handleFormSaved}
                />
            )}

            <ProductTable
                products={products}
                onEdit={handleEdit}
                onToggleDisable={handleToggleDisable}
            />
        </div>
    )
}