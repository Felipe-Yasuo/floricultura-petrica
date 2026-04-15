'use client'

import { useEffect, useRef } from 'react'

export function useScrollAnimation(deps: unknown[] = []) {
    const ref = useRef<HTMLElement>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-visible')
                    }
                })
            },
            { threshold: 0.1 }
        )

        const elements = ref.current?.querySelectorAll('.animate-on-scroll')
        elements?.forEach((el) => {
            el.classList.remove('animate-visible')
            observer.observe(el)
        })

        return () => observer.disconnect()
    }, deps)

    return ref
}