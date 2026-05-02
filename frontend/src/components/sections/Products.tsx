'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Loader2 } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { api } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Product } from '@/types/product'

interface Category {
    id: string
    name: string
    slug: string
}

export default function Products() {
    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const sectionRef = useScrollAnimation([activeCategoryId, products])

    useEffect(() => {
        api('/categories')
            .then(setCategories)
            .catch(console.error)
    }, [])

    useEffect(() => {
        setIsLoading(true)
        const endpoint = activeCategoryId
            ? `/products?category_id=${activeCategoryId}&limit=4`
            : '/products?limit=4'
        api(endpoint)
            .then((res) => setProducts(res.data || res))
            .catch(console.error)
            .finally(() => setIsLoading(false))
    }, [activeCategoryId])

    return (
        <section ref={sectionRef} className="py-24 px-4 lg:px-8 max-w-7xl mx-auto w-full">
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
                className="animate-on-scroll opacity-0 flex gap-2 mb-10 overflow-x-auto pb-2 max-w-full"
                style={{ transitionDelay: '0.1s' }}
            >
                <button
                    onClick={() => setActiveCategoryId(null)}
                    className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategoryId === null
                        ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                        : 'bg-[var(--color-surface-container)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container-high)]'
                        }`}
                >
                    Todos
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setActiveCategoryId(cat.id)}
                        className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${activeCategoryId === cat.id
                            ? 'bg-[var(--color-primary)] text-[var(--color-on-primary)]'
                            : 'bg-[var(--color-surface-container)] text-[var(--color-foreground-muted)] hover:bg-[var(--color-surface-container-high)]'
                            }`}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {/* Product Grid */}
            {isLoading ? (
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-[var(--color-primary)]" />
                </div>
            ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {products.map((product, index) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="animate-on-scroll opacity-0 group"
                        style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-[var(--color-surface-container-low)]">
                            <Image
                                src={product.banner}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 50vw, 25vw"
                                className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                        </div>
                        <div>
                            <span className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)]">
                                {product.category.name}
                            </span>
                            <h3 className="font-serif text-base mt-1 group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                {product.name}
                            </h3>
                            <p className="text-sm font-medium mt-2">
                                {formatPrice(product.price)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            )}
        </section>
    )
}