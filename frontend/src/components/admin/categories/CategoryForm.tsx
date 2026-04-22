'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

interface Category {
    id: string
    name: string
    slug: string
    image: string | null
    disabled: boolean
}

interface CategoryFormProps {
    category: Category | null
    onClose: () => void
    onSaved: () => void
}

export default function CategoryForm({ category, onClose, onSaved }: CategoryFormProps) {
    const { token } = useAuth()
    const [name, setName] = useState('')
    const [saving, setSaving] = useState(false)
    const [fieldError, setFieldError] = useState('')

    useEffect(() => {
        if (category) {
            setName(category.name)
        }
    }, [category])

    const handleSubmit = async () => {
        if (!name.trim()) {
            setFieldError('Nome é obrigatório')
            return
        }
        if (name.trim().length < 2) {
            setFieldError('Nome deve ter no mínimo 2 caracteres')
            return
        }

        setFieldError('')
        setSaving(true)

        try {
            if (category) {
                await api(`/categories/${category.id}`, {
                    method: 'PUT',
                    token: token!,
                    body: JSON.stringify({ name }),
                })
                toast.success('Categoria atualizada com sucesso!')
            } else {
                await api('/categories', {
                    method: 'POST',
                    token: token!,
                    body: JSON.stringify({ name }),
                })
                toast.success('Categoria criada com sucesso!')
            }
            onSaved()
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient mb-6">
            <h2 className="font-serif text-xl mb-6">
                {category ? 'Editar Categoria' : 'Nova Categoria'}
            </h2>

            <div>
                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={name}
                    onChange={(e) => { setName(e.target.value); setFieldError('') }}
                    className={`w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 transition-all duration-300 ${fieldError ? 'ring-2 ring-red-400 focus:ring-red-400' : 'focus:ring-[var(--color-primary)]'
                        }`}
                />
                {fieldError && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldError}</p>}
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : category ? 'Salvar Alterações' : 'Criar Categoria'}
                </button>
                <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-2xl bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}