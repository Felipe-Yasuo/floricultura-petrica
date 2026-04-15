'use client'

import { Star } from 'lucide-react'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { mockTestimonials } from '@/constants/testimonials'

function TestimonialCard({ testimonial }: { testimonial: typeof mockTestimonials[0] }) {
    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 shadow-ambient mb-4">
            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                        key={i}
                        size={14}
                        className="fill-[var(--color-accent)] text-[var(--color-accent)]"
                    />
                ))}
            </div>

            {/* Quote */}
            <p className="font-serif text-sm leading-relaxed text-[var(--color-foreground)] mb-6">
                &ldquo;{testimonial.quote}&rdquo;
            </p>

            {/* Author */}
            <div className="flex items-center gap-3">
                <div
                    className="w-8 h-8 rounded-full"
                    style={{ backgroundColor: testimonial.color }}
                />
                <div>
                    <p className="text-sm font-medium text-[var(--color-foreground)]">
                        {testimonial.name}
                    </p>
                    <p className="text-xs text-[var(--color-foreground-subtle)]">
                        {testimonial.city}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default function Testimonials() {
    const sectionRef = useScrollAnimation()

    const col1 = mockTestimonials.slice(0, 3)
    const col2 = mockTestimonials.slice(3, 6)
    const col3 = mockTestimonials.slice(6, 9)

    return (
        <section ref={sectionRef} className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="animate-on-scroll opacity-0 text-center mb-16">
                <h2 className="text-3xl lg:text-4xl leading-[1.1]">
                    Experiências Pétrica
                </h2>
            </div>

            {/* Columns */}
            <div className="relative h-[600px] overflow-hidden">
                {/* Gradient masks */}
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-[var(--color-surface)] to-transparent z-10 pointer-events-none" />
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--color-surface)] to-transparent z-10 pointer-events-none" />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
                    {/* Column 1 - Scroll Down */}
                    <div className="animate-on-scroll opacity-0 overflow-hidden">
                        <div className="animate-scroll-down hover:[animation-duration:60s]">
                            {[...col1, ...col1].map((t, i) => (
                                <TestimonialCard key={`col1-${i}`} testimonial={t} />
                            ))}
                        </div>
                    </div>

                    {/* Column 2 - Scroll Up */}
                    <div className="animate-on-scroll opacity-0 overflow-hidden hidden md:block" style={{ transitionDelay: '0.1s' }}>
                        <div className="animate-scroll-up hover:[animation-duration:60s]">
                            {[...col2, ...col2].map((t, i) => (
                                <TestimonialCard key={`col2-${i}`} testimonial={t} />
                            ))}
                        </div>
                    </div>

                    {/* Column 3 - Scroll Down */}
                    <div className="animate-on-scroll opacity-0 overflow-hidden hidden md:block" style={{ transitionDelay: '0.2s' }}>
                        <div className="animate-scroll-down hover:[animation-duration:60s]">
                            {[...col3, ...col3].map((t, i) => (
                                <TestimonialCard key={`col3-${i}`} testimonial={t} />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}