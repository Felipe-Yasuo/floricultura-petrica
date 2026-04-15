'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { mockProducts } from '@/constants/products'
import { formatPrice } from '@/lib/utils'

const categories = ['Flores Cortadas', 'Plantas em Vaso', 'Suculentas e Cactos']
const sortOptions = [
    { label: 'Mais Recentes', value: 'newest' },
    { label: 'Menor Preço', value: 'price-asc' },
    { label: 'Maior Preço', value: 'price-desc' },
    { label: 'Nome A-Z', value: 'name-asc' },
]

const ITEMS_PER_PAGE = 9

export default function ShopContent() {
    const [activeCategory, setActiveCategory] = useState<string | null>(null)
    const [sortBy, setSortBy] = useState('newest')
    const [priceRange, setPriceRange] = useState(50000)
    const [currentPage, setCurrentPage] = useState(1)

    const sectionRef = useScrollAnimation([activeCategory, sortBy, priceRange, currentPage])

    const filtered = useMemo(() => {
        let products = [...mockProducts]

        if (activeCategory) {
            products = products.filter((p) => p.category === activeCategory)
        }

        products = products.filter((p) => p.price <= priceRange)

        switch (sortBy) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price)
                break
            case 'price-desc':
                products.sort((a, b) => b.price - a.price)
                break
            case 'name-asc':
                products.sort((a, b) => a.name.localeCompare(b.name))
                break
            default:
                break
        }

        return products
    }, [activeCategory, sortBy, priceRange])

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
    const paginated = filtered.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    )

    const handleCategoryChange = (cat: string | null) => {
        setActiveCategory(cat)
        setCurrentPage(1)
    }

    const handleSortChange = (value: string) => {
        setSortBy(value)
        setCurrentPage(1)
    }

    return (
        <section ref={sectionRef} className="flex flex-col lg:flex-row gap-10">
            {/* Sidebar */}
            <aside className="lg:w-56 shrink-0">
                {/* Categories */}
                <div className="mb-8">
                    <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--color-foreground-subtle)] mb-4">
                        Categorias
                    </h3>
                    <ul className="flex flex-col gap-2">
                        {categories.map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => handleCategoryChange(activeCategory === cat ? null : cat)}
                                    className={`text-sm transition-colors duration-300 ${activeCategory === cat
                                            ? 'text-[var(--color-primary)] font-medium'
                                            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                                        }`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Sort */}
                <div className="mb-8">
                    <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--color-foreground-subtle)] mb-4">
                        Ordenar por
                    </h3>
                    <select
                        value={sortBy}
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-2xl bg-[var(--color-surface-container)] text-sm text-[var(--color-foreground)] outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 appearance-none cursor-pointer"
                    >
                        {sortOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="text-xs tracking-[0.2em] uppercase text-[var(--color-foreground-subtle)] mb-4">
                        Faixa de Preço
                    </h3>
                    <input
                        type="range"
                        min={5000}
                        max={50000}
                        step={1000}
                        value={priceRange}
                        onChange={(e) => {
                            setPriceRange(Number(e.target.value))
                            setCurrentPage(1)
                        }}
                        className="w-full accent-[var(--color-primary)]"
                    />
                    <div className="flex justify-between text-xs text-[var(--color-foreground-subtle)] mt-2">
                        <span>R$ 50</span>
                        <span>{formatPrice(priceRange)}</span>
                    </div>
                </div>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
                {/* Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                    {paginated.map((product, index) => (
                        <Link
                            key={product.id}
                            href={`/shop/${product.slug}`}
                            className="animate-on-scroll opacity-0 group"
                            style={{ transitionDelay: `${0.05 * (index + 1)}s` }}
                        >
                            <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-[var(--color-surface-container-low)]">
                                <img
                                    src={product.banner}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                                />
                                {product.badge && (
                                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[var(--color-accent)] text-white text-xs font-medium">
                                        {product.badge}
                                    </span>
                                )}
                            </div>
                            <div>
                                <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)]">
                                    {product.category}
                                </span>
                                <h3 className="font-serif text-base mt-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                    {product.name}
                                </h3>
                                <p className="text-sm text-[var(--color-foreground-muted)] mt-0.5">
                                    {product.description}
                                </p>
                                <p className="text-sm font-medium mt-2">
                                    {formatPrice(product.price)}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* Empty State */}
                {paginated.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-[var(--color-foreground-muted)]">
                            Nenhum produto encontrado com esses filtros.
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-16">
                        <button
                            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface-container)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Página anterior"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        {Array.from({ length: totalPages }).map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i + 1)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${currentPage === i + 1
                                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                                        : 'text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container)]'
                                    }`}
                            >
                                {i + 1}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="w-10 h-10 rounded-full flex items-center justify-center bg-[var(--color-surface-container)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
                            aria-label="Próxima página"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}