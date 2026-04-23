'use client'

import { useState } from 'react'
import { Check } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'

export default function Newsletter() {
    const sectionRef = useScrollAnimation()
    const [email, setEmail] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setSubmitted(true)
    }

    return (
        <section
            ref={sectionRef}
            className="py-24 px-6 lg:px-8"
        >
            <div className="max-w-7xl mx-auto rounded-3xl bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-primary)] px-6 py-20 lg:px-16 lg:py-24 text-center relative overflow-hidden">
                <img
                    src="/images/textures/botanical-texture.png"
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 w-full h-full object-cover opacity-20 pointer-events-none"
                />
                <h2
                    className="animate-on-scroll opacity-0 relative z-10 font-serif text-3xl lg:text-5xl text-[var(--color-on-primary)] leading-[1.1] max-w-lg mx-auto mb-6"
                >
                    Junte-se à nossa curadoria botânica
                </h2>

                {/* Subtext */}
                <p
                    className="animate-on-scroll opacity-0 relative z-10 text-[rgba(255,255,255,0.7)] max-w-md mx-auto mb-10 leading-relaxed"
                    style={{ transitionDelay: '0.1s' }}
                >
                    Receba dicas de cuidado, lançamentos antecipados e histórias inspiradoras
                    diretamente no seu e-mail.
                </p>

                {/* Form */}
                <div
                    className="animate-on-scroll opacity-0 relative z-10 max-w-md mx-auto"
                    style={{ transitionDelay: '0.2s' }}
                >
                    {submitted ? (
                        <div className="flex items-center justify-center gap-3 py-4">
                            <div className="w-10 h-10 rounded-full bg-[var(--color-secondary-light)] flex items-center justify-center">
                                <Check size={20} className="text-[var(--color-primary)]" />
                            </div>
                            <p className="text-[var(--color-on-primary)] font-medium">
                                Bem-vindo à nossa curadoria!
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                            <label htmlFor="newsletter-email" className="sr-only">Seu e-mail</label>
                            <input
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                                required
                                className="flex-1 px-6 py-4 rounded-full bg-[rgba(255,255,255,0.15)] backdrop-blur-sm text-[var(--color-on-primary)] placeholder:text-[rgba(255,255,255,0.4)] outline-none focus:ring-2 focus:ring-[var(--color-secondary-light)] transition-all duration-300"
                            />
                            <button
                                type="submit"
                                className="px-8 py-4 rounded-full bg-[var(--color-surface-white)] text-[var(--color-primary)] font-medium text-sm hover:scale-[1.02] transition-all duration-300"
                            >
                                Assinar Journal
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    )
}