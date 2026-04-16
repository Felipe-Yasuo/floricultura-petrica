'use client'

import { useEffect, useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import CategoryForm from './CategoryForm'
import CategoryTable from './CategoryTable'

interface Category {
    id: string
    name: string
    slug: string
    image: string | null
    disabled: boolean
}

export default function AdminCategories() {
    const { token } = useAuth()
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [editingCategory, setEditingCategory] = useState<Category | null>(null)

    useEffect(() => {
        if (token) {
            fetchCategories()
        }
    }, [token])

    const fetchCategories = async () => {
        try {
            const data = await api('/categories')
            setCategories(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleEdit = (category: Category) => {
        setEditingCategory(category)
        setShowForm(true)
    }

    const handleFormClose = () => {
        setShowForm(false)
        setEditingCategory(null)
    }

    const handleFormSaved = () => {
        setShowForm(false)
        setEditingCategory(null)
        fetchCategories()
    }

    const handleToggleDisable = async (category: Category) => {
        try {
            await api(`/categories/${category.id}/disable`, {
                method: 'PATCH',
                token: token!,
            })
            await fetchCategories()
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
                <h1 className="font-serif text-2xl lg:text-3xl">Categorias</h1>
                <button
                    onClick={() => { setEditingCategory(null); setShowForm(true) }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                >
                    <Plus size={16} />
                    Nova Categoria
                </button>
            </div>

            {showForm && (
                <CategoryForm
                    category={editingCategory}
                    onClose={handleFormClose}
                    onSaved={handleFormSaved}
                />
            )}

            <CategoryTable
                categories={categories}
                onEdit={handleEdit}
                onToggleDisable={handleToggleDisable}
            />
        </div>
    )
}