'use client'

import { useState, useMemo } from 'react'
import { Pencil, Power, Search } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product'

interface ProductTableProps {
    products: Product[]
    onEdit: (product: Product) => void
    onToggleDisable: (product: Product) => void
}

type SortBy = 'name' | 'status' | 'stock' | 'price'

export default function ProductTable({ products, onEdit, onToggleDisable }: ProductTableProps) {
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<SortBy>('name')

    const filtered = useMemo(() => {
        let result = [...products]

        if (search) {
            result = result.filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        switch (sortBy) {
            case 'name':
                result.sort((a, b) => a.name.localeCompare(b.name))
                break
            case 'price':
                result.sort((a, b) => a.price - b.price)
                break
            case 'stock':
                result.sort((a, b) => a.stock - b.stock)
                break
            case 'status':
                result.sort((a, b) => Number(a.disabled) - Number(b.disabled))
                break
        }

        return result
    }, [products, search, sortBy])

    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] shadow-ambient overflow-hidden">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-b border-[var(--color-surface-container)]">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
                    <input
                        type="text"
                        placeholder="Buscar produto..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-5 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                    />
                </div>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as SortBy)}
                    className="px-4 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                >
                    <option value="name">Ordem Alfabética</option>
                    <option value="price">Preço</option>
                    <option value="stock">Estoque</option>
                    <option value="status">Status</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--color-surface-container)]">
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Produto</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Categoria</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Preço</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Estoque</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Status</th>
                            <th className="text-right text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                                    Nenhum produto encontrado.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((product) => (
                                <tr
                                    key={product.id}
                                    className="border-b border-[var(--color-surface-container)] last:border-0 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200"
                                >
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden bg-[var(--color-surface-container-low)] shrink-0">
                                                <img src={product.banner} alt={product.name} className="w-full h-full object-cover" />
                                            </div>
                                            <span className="text-sm font-medium">{product.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">
                                        {product.category.name}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        {formatPrice(product.price)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {product.stock}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${product.disabled
                                            ? 'bg-red-100 text-red-700'
                                            : 'bg-green-100 text-green-700'
                                            }`}>
                                            {product.disabled ? 'Desativado' : 'Ativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="p-2 rounded-xl hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                                                aria-label="Editar produto"
                                            >
                                                <Pencil size={16} className="text-[var(--color-foreground-muted)]" />
                                            </button>
                                            <button
                                                onClick={() => onToggleDisable(product)}
                                                className={`p-2 rounded-xl transition-colors duration-300 ${product.disabled
                                                    ? 'hover:bg-green-50 text-green-600'
                                                    : 'hover:bg-red-50 text-red-500'
                                                    }`}
                                                aria-label={product.disabled ? 'Ativar produto' : 'Desativar produto'}
                                            >
                                                <Power size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}