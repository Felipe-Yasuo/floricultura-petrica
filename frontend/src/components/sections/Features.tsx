'use client'

import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { Truck, ArrowRight, Gift } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Features() {
    const sectionRef = useScrollAnimation()

    return (
        <section ref={sectionRef} className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 auto-rows-[300px]">
                {/* Large Block - Left */}
                <div className="animate-on-scroll opacity-0 lg:row-span-2 rounded-3xl p-8 lg:p-10 flex flex-col justify-between relative overflow-hidden">
                    <Image
                        src="/images/features/spring-collection.png"
                        alt="Coleção Despertar da Primavera"
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-surface-container-low)] via-[var(--color-surface-container-low)]/80 to-[var(--color-surface-container-low)]/30" />
                    <div className="relative z-10">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs tracking-[0.2em] uppercase mb-6">
                            Edição Limitada
                        </span>
                        <h2 className="text-3xl lg:text-4xl leading-[1.1] max-w-sm">
                            O Despertar da Primavera
                        </h2>
                    </div>
                    <div className="relative z-10">
                        <p className="text-[var(--color-foreground-muted)] mb-6 max-w-sm leading-relaxed">
                            Descubra arranjos inspirados no renascimento da natureza, com espécies raras de produtores locais.
                        </p>
                        <Link
                            href="/shop"
                            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors duration-300"
                        >
                            Ver Coleção
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </Link>
                    </div>
                </div>

                {/* Top Right - Entrega Premium */}
                <div
                    className="animate-on-scroll opacity-0 rounded-3xl bg-[var(--color-surface-container)] p-8 flex flex-col justify-center"
                    style={{ transitionDelay: '0.1s' }}
                >
                    <div className="w-12 h-12 rounded-2xl bg-[var(--color-surface-white)] flex items-center justify-center mb-4 shadow-ambient">
                        <Truck size={22} className="text-[var(--color-primary)]" />
                    </div>
                    <h3 className="text-xl font-serif mb-2">Entrega Premium</h3>
                    <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                        Transporte climatizado garantindo frescor absoluto. Agende a data e horário da entrega.
                    </p>
                </div>

                {/* Bottom Right - Split into two */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Workshops */}
                    <div
                        className="animate-on-scroll opacity-0 rounded-3xl relative overflow-hidden"
                        style={{ transitionDelay: '0.2s' }}
                    >
                        <Image
                            src="/images/features/workshop.png"
                            alt="Workshop de arranjos florais"
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <span className="absolute bottom-4 left-4 px-4 py-1.5 rounded-full bg-[rgba(255,255,255,0.2)] backdrop-blur-sm text-white text-xs tracking-[0.15em] uppercase">
                            Workshops
                        </span>
                    </div>

                    {/* Presentes */}
                    <div
                        className="animate-on-scroll opacity-0 rounded-3xl relative overflow-hidden"
                        style={{ transitionDelay: '0.3s' }}
                    >
                        <Image
                            src="/images/features/gifts.png"
                            alt="Cestas e presentes com flores"
                            fill
                            sizes="(max-width: 1024px) 50vw, 25vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-4 left-4">
                            <div className="flex items-center gap-2 mb-1">
                                <Gift size={14} className="text-white" />
                                <span className="text-white text-xs tracking-[0.15em] uppercase">
                                    Presentes
                                </span>
                            </div>
                            <p className="text-[rgba(255,255,255,0.7)] text-xs">
                                Cestas e arranjos especiais
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}