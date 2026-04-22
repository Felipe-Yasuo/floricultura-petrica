'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
    const sectionRef = useScrollAnimation()

    return (
        <section
            ref={sectionRef}
            className="relative min-h-screen flex items-end pb-24 lg:items-center lg:pb-0"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/hero/hero-bg.jpg"
                    alt="Arranjo floral elegante"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary)] via-[var(--color-primary)]/60 to-transparent" />
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 w-full">
                <div className="max-w-2xl">
                    {/* Label */}
                    <span
                        className="animate-on-scroll opacity-0 inline-block text-xs tracking-[0.3em] uppercase text-[var(--color-secondary-light)] mb-6"
                        style={{ transitionDelay: '0.2s' }}
                    >
                        Curadoria Botânica Editorial
                    </span>

                    {/* Headline */}
                    <h1
                        className="animate-on-scroll opacity-0 font-serif text-5xl lg:text-7xl text-[var(--color-on-primary)] leading-[1.1] text-balance mb-6"
                        style={{ transitionDelay: '0.4s' }}
                    >
                        Flores frescas que contam a sua história
                    </h1>

                    {/* Subheadline */}
                    <p
                        className="animate-on-scroll opacity-0 text-base lg:text-lg text-[rgba(255,255,255,0.75)] max-w-lg mb-10 leading-relaxed"
                        style={{ transitionDelay: '0.6s' }}
                    >
                        Entregamos beleza e afeto em cada detalhe. Escolha o arranjo perfeito
                        para transformar o dia de quem você ama.
                    </p>

                    {/* CTAs */}
                    <div
                        className="animate-on-scroll opacity-0 flex flex-wrap gap-4"
                        style={{ transitionDelay: '0.8s' }}
                    >
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-2 px-8 py-4 bg-[var(--color-on-primary)] text-[var(--color-primary)] rounded-full text-sm font-medium hover:scale-[1.02] transition-all duration-300"
                        >
                            Explorar Coleções
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                        <Link
                            href="/about"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-[rgba(255,255,255,0.15)] text-[var(--color-on-primary)] rounded-full text-sm font-medium backdrop-blur-sm hover:bg-[rgba(255,255,255,0.25)] transition-all duration-300"
                        >
                            Nossa História
                        </Link>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
                <span className="text-xs tracking-[0.2em] uppercase text-[rgba(255,255,255,0.5)]">
                    Scroll
                </span>
                <div className="w-px h-8 bg-[rgba(255,255,255,0.3)] relative overflow-hidden">
                    <div className="w-full h-1/2 bg-[rgba(255,255,255,0.7)] animate-pulse" />
                </div>
            </div>
        </section>
    )
}