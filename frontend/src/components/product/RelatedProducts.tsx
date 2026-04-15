'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Product } from '@/constants/products'
import { formatPrice } from '@/lib/utils'

interface RelatedProductsProps {
    products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
    const sectionRef = useScrollAnimation()

    if (products.length === 0) return null

    return (
        <section ref={sectionRef} className="mt-24 pt-24 border-t border-[var(--color-surface-container-high)]">
            {/* Header */}
            <div className="animate-on-scroll opacity-0 flex items-end justify-between mb-10">
                <div>
                    <h2 className="text-2xl lg:text-3xl leading-[1.1] mb-2">
                        Você também pode gostar
                    </h2>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                        Sugestões curadas para complementar seu ambiente.
                    </p>
                </div>
                <Link
                    href="/shop"
                    className="group hidden sm:inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    VER TODOS
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                {products.map((product, index) => (
                    <Link
                        key={product.id}
                        href={`/shop/${product.slug}`}
                        className="animate-on-scroll opacity-0 group"
                        style={{ transitionDelay: `${0.1 * (index + 1)}s` }}
                    >
                        <div className="relative aspect-square rounded-3xl overflow-hidden mb-4 bg-[var(--color-surface-container-low)]">
                            <img
                                src={product.banner}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500"
                            />
                        </div>
                        <div>
                            <h3 className="font-serif text-base group-hover:text-[var(--color-primary)] transition-colors duration-300">
                                {product.name}
                            </h3>
                            <p className="text-xs text-[var(--color-foreground-muted)] mt-0.5">
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