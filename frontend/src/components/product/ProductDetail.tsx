'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Minus, Plus, ShoppingBag, Truck, ShieldCheck, Leaf } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Product } from '@/constants/products'
import { formatPrice } from '@/lib/utils'

interface ProductDetailProps {
    product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
    const sectionRef = useScrollAnimation()
    const [quantity, setQuantity] = useState(1)
    const [activeImage, setActiveImage] = useState(0)

    const images = [product.banner, product.banner, product.banner, product.banner]

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(quantity - 1)
    }

    const increaseQuantity = () => {
        setQuantity(quantity + 1)
    }

    return (
        <section ref={sectionRef}>
            {/* Breadcrumb */}
            <nav className="animate-on-scroll opacity-0 flex items-center gap-2 text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)] mb-10">
                <Link href="/shop" className="hover:text-[var(--color-primary)] transition-colors duration-300">
                    Shop
                </Link>
                <span>/</span>
                <span className="text-[var(--color-foreground-muted)]">{product.category}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
                {/* Images */}
                <div className="animate-on-scroll opacity-0">
                    {/* Main Image */}
                    <div className="relative aspect-square rounded-3xl overflow-hidden bg-[var(--color-surface-container-low)] mb-4">
                        <img
                            src={images[activeImage]}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        {product.badge && (
                            <span className="absolute top-4 left-4 px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs tracking-[0.15em] uppercase">
                                {product.badge}
                            </span>
                        )}
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-3">
                        {images.map((img, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveImage(i)}
                                className={`w-20 h-20 rounded-2xl overflow-hidden transition-all duration-300 ${activeImage === i
                                        ? 'ring-2 ring-[var(--color-primary)] opacity-100'
                                        : 'opacity-50 hover:opacity-80'
                                    }`}
                            >
                                <img
                                    src={img}
                                    alt={`${product.name} - imagem ${i + 1}`}
                                    className="w-full h-full object-cover"
                                />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info */}
                <div>
                    {/* Name & Price */}
                    <h1
                        className="animate-on-scroll opacity-0 text-3xl lg:text-4xl leading-[1.1] mb-4"
                        style={{ transitionDelay: '0.1s' }}
                    >
                        {product.name}
                    </h1>
                    <div
                        className="animate-on-scroll opacity-0 flex items-baseline gap-3 mb-6"
                        style={{ transitionDelay: '0.15s' }}
                    >
                        <span className="text-2xl font-medium">{formatPrice(product.price)}</span>
                    </div>

                    {/* Description */}
                    <p
                        className="animate-on-scroll opacity-0 text-[var(--color-foreground-muted)] leading-relaxed mb-8"
                        style={{ transitionDelay: '0.2s' }}
                    >
                        {product.description}. Nossas flores são colhidas ao amanhecer em nossa fazenda botânica,
                        garantindo uma cor profunda e fragrância duradoura. Cada arranjo é finalizado com papel
                        de seda artesanal e fita de veludo.
                    </p>

                    {/* Care Tips */}
                    <div
                        className="animate-on-scroll opacity-0 rounded-2xl bg-[var(--color-surface-container-low)] p-5 mb-8"
                        style={{ transitionDelay: '0.25s' }}
                    >
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-[var(--color-surface-white)] flex items-center justify-center shrink-0 shadow-ambient">
                                <Leaf size={18} className="text-[var(--color-primary)]" />
                            </div>
                            <div>
                                <h3 className="text-sm font-medium mb-1">Cuidados & Frescor</h3>
                                <p className="text-xs text-[var(--color-foreground-muted)] leading-relaxed">
                                    Mantenha em local fresco, longe da luz direta. Troque a água a cada dois dias
                                    para manter o brilho das pétalas.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Quantity & Add to Cart */}
                    <div
                        className="animate-on-scroll opacity-0 flex flex-col sm:flex-row gap-4 mb-8"
                        style={{ transitionDelay: '0.3s' }}
                    >
                        {/* Quantity Selector */}
                        <div className="flex items-center rounded-2xl bg-[var(--color-surface-container)] overflow-hidden">
                            <button
                                onClick={decreaseQuantity}
                                className="w-12 h-12 flex items-center justify-center hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                                aria-label="Diminuir quantidade"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="w-12 text-center text-sm font-medium">{quantity}</span>
                            <button
                                onClick={increaseQuantity}
                                className="w-12 h-12 flex items-center justify-center hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                                aria-label="Aumentar quantidade"
                            >
                                <Plus size={16} />
                            </button>
                        </div>

                        {/* Add to Cart Button */}
                        <button className="flex-1 flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.01] transition-all duration-300">
                            <ShoppingBag size={18} />
                            Adicionar ao Carrinho
                        </button>
                    </div>

                    {/* Trust Badges */}
                    <div
                        className="animate-on-scroll opacity-0 flex flex-wrap gap-3"
                        style={{ transitionDelay: '0.35s' }}
                    >
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-surface-container)]">
                            <Truck size={16} className="text-[var(--color-primary)]" />
                            <span className="text-xs font-medium">Entrega Expressa</span>
                        </div>
                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[var(--color-surface-container)]">
                            <ShieldCheck size={16} className="text-[var(--color-primary)]" />
                            <span className="text-xs font-medium">Qualidade Pétrica</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}