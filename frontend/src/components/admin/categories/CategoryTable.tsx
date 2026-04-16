'use client'

import { useState, useMemo } from 'react'
import { Pencil, Power, Search } from 'lucide-react'

interface Category {
    id: string
    name: string
    slug: string
    image: string | null
    disabled: boolean
}

interface CategoryTableProps {
    categories: Category[]
    onEdit: (category: Category) => void
    onToggleDisable: (category: Category) => void
}

type FilterStatus = 'all' | 'active' | 'disabled'

export default function CategoryTable({ categories, onEdit, onToggleDisable }: CategoryTableProps) {
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<FilterStatus>('all')

    const filtered = useMemo(() => {
        let result = [...categories]

        if (search) {
            result = result.filter((c) =>
                c.name.toLowerCase().includes(search.toLowerCase())
            )
        }

        switch (filterStatus) {
            case 'active':
                result = result.filter((c) => !c.disabled)
                break
            case 'disabled':
                result = result.filter((c) => c.disabled)
                break
        }

        result.sort((a, b) => a.name.localeCompare(b.name))

        return result
    }, [categories, search, filterStatus])

    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] shadow-ambient overflow-hidden">
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 p-6 border-b border-[var(--color-surface-container)]">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-subtle)]" />
                    <input
                        type="text"
                        placeholder="Buscar categoria..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-5 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                    />
                </div>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as FilterStatus)}
                    className="px-4 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                >
                    <option value="all">Todas</option>
                    <option value="active">Ativas</option>
                    <option value="disabled">Desativadas</option>
                </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--color-surface-container)]">
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Nome</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Slug</th>
                            <th className="text-left text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Status</th>
                            <th className="text-right text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] px-6 py-4">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-sm text-[var(--color-foreground-muted)]">
                                    Nenhuma categoria encontrada.
                                </td>
                            </tr>
                        ) : (
                            filtered.map((category) => (
                                <tr
                                    key={category.id}
                                    className="border-b border-[var(--color-surface-container)] last:border-0 hover:bg-[var(--color-surface-container-low)] transition-colors duration-200"
                                >
                                    <td className="px-6 py-4 text-sm font-medium">{category.name}</td>
                                    <td className="px-6 py-4 text-sm text-[var(--color-foreground-muted)]">{category.slug}</td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${category.disabled
                                                ? 'bg-red-100 text-red-700'
                                                : 'bg-green-100 text-green-700'
                                            }`}>
                                            {category.disabled ? 'Desativada' : 'Ativa'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEdit(category)}
                                                className="p-2 rounded-xl hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                                                aria-label="Editar categoria"
                                            >
                                                <Pencil size={16} className="text-[var(--color-foreground-muted)]" />
                                            </button>
                                            <button
                                                onClick={() => onToggleDisable(category)}
                                                className={`p-2 rounded-xl transition-colors duration-300 ${category.disabled
                                                        ? 'hover:bg-green-50 text-green-600'
                                                        : 'hover:bg-red-50 text-red-500'
                                                    }`}
                                                aria-label={category.disabled ? 'Ativar categoria' : 'Desativar categoria'}
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