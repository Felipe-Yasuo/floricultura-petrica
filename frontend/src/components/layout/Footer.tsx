import Link from 'next/link'
import { MessageCircle, Share2, Camera } from 'lucide-react'

const shopLinks = [
    { label: 'Novidades', href: '/shop?sort=newest' },
    { label: 'Buquês de Estação', href: '/shop?category=flores-cortadas' },
    { label: 'Plantas de Interior', href: '/shop?category=plantas-em-vaso' },
    { label: 'Edições Limitadas', href: '/shop' },
]

const supportLinks = [
    { label: 'Envio e Entregas', href: '/shipping' },
    { label: 'Contato', href: '/contact' },
    { label: 'Perguntas Frequentes', href: '/faq' },
]

const socialLinks = [
    { label: 'Instagram', href: 'https://instagram.com', icon: Camera },
    { label: 'WhatsApp', href: 'https://wa.me/5543999999999', icon: MessageCircle },
    { label: 'Facebook', href: 'https://facebook.com', icon: Share2 },
]

export default function Footer() {
    return (
        <footer className="bg-gradient-to-br from-[var(--color-primary-container)] to-[var(--color-primary)] text-[var(--color-on-primary)] relative overflow-hidden">
            {/* Watermark */}
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 font-serif italic text-[200px] md:text-[400px] leading-none text-[rgba(255,255,255,0.05)] pointer-events-none select-none whitespace-nowrap">
                Pétrica
            </span>

            <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-16 lg:py-20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="font-serif text-2xl italic">
                            Pétrica
                        </Link>
                        <p className="text-sm text-[rgba(255,255,255,0.6)] mt-3 leading-relaxed max-w-xs">
                            Cultivando momentos através da curadoria botânica editorial. Criamos momentos através das flores.
                        </p>

                        {/* Social Icons */}
                        <div className="flex gap-3 mt-6">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="w-10 h-10 rounded-full bg-[rgba(255,255,255,0.1)] flex items-center justify-center hover:bg-[rgba(255,255,255,0.2)] transition-colors duration-300"
                                >
                                    <social.icon size={18} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-[rgba(255,255,255,0.4)]">
                            Loja
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {shopLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[rgba(255,255,255,0.7)] hover:text-white transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-[rgba(255,255,255,0.4)]">
                            Suporte
                        </h4>
                        <ul className="flex flex-col gap-3">
                            {supportLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-[rgba(255,255,255,0.7)] hover:text-white transition-colors duration-300"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter Mini */}
                    <div>
                        <h4 className="text-xs tracking-[0.2em] uppercase mb-6 text-[rgba(255,255,255,0.4)]">
                            Newsletter
                        </h4>
                        <p className="text-sm text-[rgba(255,255,255,0.6)] mb-4 leading-relaxed">
                            Receba novidades e ofertas exclusivas.
                        </p>
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Email"
                                className="flex-1 px-4 py-2.5 rounded-full bg-[rgba(255,255,255,0.1)] text-sm text-white placeholder:text-[rgba(255,255,255,0.3)] outline-none focus:ring-1 focus:ring-[var(--color-secondary-light)] transition-all duration-300"
                            />
                            <button className="px-5 py-2.5 rounded-full bg-[var(--color-accent)] text-white text-sm font-medium hover:scale-[1.02] transition-all duration-300">
                                Assinar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 pt-8 border-t border-[rgba(255,255,255,0.1)] flex flex-col sm:flex-row justify-between items-center gap-4">
                    <p className="text-xs text-[rgba(255,255,255,0.4)]">
                        © 2026 Pétrica Botanical Editorial. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        <Link
                            href="/terms"
                            className="text-xs text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300"
                        >
                            Termos de Uso
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-xs text-[rgba(255,255,255,0.4)] hover:text-white transition-colors duration-300"
                        >
                            Privacidade
                        </Link>
                    </div>
                </div>
            </div>
        </footer >
    )
}