'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { mockProducts } from '@/constants/products'
import { formatPrice } from '@/lib/utils'

const categories = ['Todos', 'Flores Cortadas', 'Plantas em Vaso', 'Suculentas e Cactos']

export default function Products() {
    const [activeCategory, setActiveCategory] = useState('Todos')
    const sectionRef = useScrollAnimation([activeCategory])

    const filtered = activeCategory === 'Todos'
        ? mockProducts
        : mockProducts.filter((p) => p.category === activeCategory)

    return (
        <section ref={sectionRef} className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="animate-on-scroll opacity-0 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-12">
                <div>
                    <h2 className="text-3xl lg:text-4xl leading-[1.1] mb-3">
                        Destaques da Estação
                    </h2>
                    <p className="text-[var(--color-foreground-muted)]">
                        Os favoritos da nossa curadoria editorial.
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    VER TODOS
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>

            {/* Category Filter */}
            <div
                className="animate-on-scroll opacity-0 flex gap-2 mb-10 overflow-x-auto pb-2"
                style={{ transitionDelay: '0.1s' }}
            >
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setActiveCategory(cat)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategory === cat
                            ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                            : 'bg-[var(--color-surface-container)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container-high)]'
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {filtered.map((product, index) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="animate-on-scroll opacity-0 group"
                        style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
                    >
                        {/* Image */}
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

                        {/* Info */}
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
        </section>
    )
}