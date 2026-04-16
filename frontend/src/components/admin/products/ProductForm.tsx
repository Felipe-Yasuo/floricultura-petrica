'use client'

import { useState, useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'
import { formatCurrencyInput } from '@/lib/formatCurrency'
import { Product } from '@/types/product'
import { FieldErrors, validateProductForm } from './productValidation'
import ImageUpload from './ImageUpload'

interface ProductFormProps {
    product: Product | null
    onClose: () => void
    onSaved: () => void
}

export default function ProductForm({ product, onClose, onSaved }: ProductFormProps) {
    const { token } = useAuth()
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
    const [form, setForm] = useState({
        name: '',
        description: '',
        priceDisplay: '',
        priceCents: 0,
        stock: '',
        banner: '',
        category_id: '',
    })

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        if (product) {
            const { display } = formatCurrencyInput(String(product.price))
            setForm({
                name: product.name,
                description: product.description,
                priceDisplay: display,
                priceCents: product.price,
                stock: String(product.stock),
                banner: product.banner,
                category_id: product.category_id,
            })
        }
    }, [product])

    const fetchCategories = async () => {
        try {
            const data = await api('/categories')
            setCategories(data)
        } catch (err) {
            console.error(err)
        }
    }

    const handlePriceChange = (value: string) => {
        const { display, cents } = formatCurrencyInput(value)
        setForm({ ...form, priceDisplay: display, priceCents: cents })
        if (cents > 0) setFieldErrors({ ...fieldErrors, price: undefined })
    }

    const updateField = (field: string, value: string) => {
        setForm({ ...form, [field]: value })
        if (value.trim()) setFieldErrors({ ...fieldErrors, [field]: undefined })
    }

    const handleSubmit = async () => {
        const errors = validateProductForm(form)
        setFieldErrors(errors)
        if (Object.keys(errors).length > 0) return

        setError('')
        setSaving(true)

        const body = {
            name: form.name,
            description: form.description,
            price: form.priceCents,
            stock: Number(form.stock),
            banner: form.banner,
            category_id: form.category_id,
        }

        try {
            if (product) {
                await api(`/products/${product.id}`, {
                    method: 'PUT',
                    token: token!,
                    body: JSON.stringify(body),
                })
            } else {
                await api('/products', {
                    method: 'POST',
                    token: token!,
                    body: JSON.stringify(body),
                })
            }
            onSaved()
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao salvar')
        } finally {
            setSaving(false)
        }
    }

    const inputClass = (field: keyof FieldErrors) =>
        `px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 transition-all duration-300 ${fieldErrors[field]
            ? 'ring-2 ring-red-400 focus:ring-red-400'
            : 'focus:ring-[var(--color-primary)]'
        }`

    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient mb-6">
            <h2 className="font-serif text-xl mb-6">
                {product ? 'Editar Produto' : 'Novo Produto'}
            </h2>

            {error && (
                <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                    <input
                        type="text"
                        placeholder="Nome do produto"
                        value={form.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className={`w-full ${inputClass('name')}`}
                    />
                    {fieldErrors.name && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldErrors.name}</p>}
                </div>

                <div className="sm:col-span-2">
                    <textarea
                        placeholder="Descrição"
                        value={form.description}
                        onChange={(e) => updateField('description', e.target.value)}
                        rows={3}
                        className={`w-full resize-none ${inputClass('description')}`}
                    />
                    {fieldErrors.description && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldErrors.description}</p>}
                </div>

                <div>
                    <input
                        type="text"
                        placeholder="R$ 0,00"
                        value={form.priceDisplay}
                        onChange={(e) => handlePriceChange(e.target.value)}
                        className={`w-full ${inputClass('price')}`}
                    />
                    {fieldErrors.price && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldErrors.price}</p>}
                </div>

                <div>
                    <input
                        type="number"
                        placeholder="Estoque"
                        value={form.stock}
                        onChange={(e) => updateField('stock', e.target.value)}
                        className={`w-full ${inputClass('stock')}`}
                    />
                    {fieldErrors.stock && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldErrors.stock}</p>}
                </div>

                <ImageUpload
                    value={form.banner}
                    onChange={(url) => {
                        setForm({ ...form, banner: url })
                        if (url) setFieldErrors({ ...fieldErrors, banner: undefined })
                    }}
                    error={fieldErrors.banner}
                />

                <div className="sm:col-span-2">
                    <select
                        value={form.category_id}
                        onChange={(e) => updateField('category_id', e.target.value)}
                        className={`w-full appearance-none cursor-pointer ${inputClass('category_id')}`}
                    >
                        <option value="">Selecione a categoria</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                    {fieldErrors.category_id && <p className="text-xs text-red-500 mt-1.5 ml-1">{fieldErrors.category_id}</p>}
                </div>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] text-sm font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : product ? 'Salvar Alterações' : 'Criar Produto'}
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