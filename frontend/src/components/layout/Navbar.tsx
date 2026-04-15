'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, ShoppingBag, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <nav className="fixed top-4 left-4 right-4 z-50 h-[68px] flex items-center justify-between px-6 lg:px-8 rounded-3xl bg-[rgba(255,255,255,0.4)] backdrop-blur-md border border-[rgba(255,255,255,0.32)] shadow-layered">
            {/* Logo - Left */}
            <Link
                href="/"
                className="font-serif text-2xl italic text-[var(--color-foreground)]"
            >
                Pétrica
            </Link>

            {/* Links - Center */}
            <div className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
                <Link
                    href="/shop"
                    className="text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Shop
                </Link>
                <Link
                    href="/shop?category=bouquets"
                    className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Bouquets
                </Link>
                <Link
                    href="/about"
                    className="text-sm font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                >
                    Sobre
                </Link>
            </div>

            {/* Icons - Right */}
            <div className="hidden md:flex items-center gap-4">
                <button
                    aria-label="Buscar"
                    className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300"
                >
                    <Search size={20} className="text-[var(--color-foreground)]" />
                </button>
                <Link
                    href="/cart"
                    aria-label="Carrinho"
                    className="p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors duration-300 relative"
                >
                    <ShoppingBag size={20} className="text-[var(--color-foreground)]" />
                </Link>
            </div>

            {/* Mobile - Hamburger */}
            <div className="md:hidden flex items-center gap-3">
                <Link
                    href="/cart"
                    aria-label="Carrinho"
                    className="p-2 rounded-full"
                >
                    <ShoppingBag size={20} className="text-[var(--color-foreground)]" />
                </Link>
                <button
                    aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-full"
                >
                    {isOpen ? (
                        <X size={22} className="text-[var(--color-foreground)]" />
                    ) : (
                        <Menu size={22} className="text-[var(--color-foreground)]" />
                    )}
                </button>
            </div>

            {/* Mobile Menu */}
            <div
                className={`absolute top-full left-0 right-0 mt-2 rounded-3xl bg-[rgba(255,255,255,0.85)] backdrop-blur-md border border-[rgba(255,255,255,0.32)] shadow-layered overflow-hidden transition-all duration-300 ease-out md:hidden ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0 border-transparent'
                    }`}
            >
                <div className="flex flex-col p-6 gap-4">
                    <Link
                        href="/shop"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Shop
                    </Link>
                    <Link
                        href="/shop?category=bouquets"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Bouquets
                    </Link>
                    <Link
                        href="/about"
                        onClick={() => setIsOpen(false)}
                        className="text-base font-medium text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors"
                    >
                        Sobre
                    </Link>
                </div>
            </div>
        </nav>
    )
}