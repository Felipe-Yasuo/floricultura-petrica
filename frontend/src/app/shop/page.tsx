import type { Metadata } from 'next'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ShopContent from '@/components/shop/ShopContent'

export const metadata: Metadata = {
  title: "Nossa Coleção",
  description: "Explore nossa coleção completa de flores frescas, arranjos exclusivos e plantas. Curadoria botânica inspirada pela efemeridade das estações.",
  openGraph: {
    title: "Nossa Coleção | Pétrica",
    description: "Explore nossa coleção completa de flores frescas, arranjos exclusivos e plantas. Curadoria botânica inspirada pela efemeridade das estações.",
    type: "website",
  },
}

export default function ShopPage() {
    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto w-full">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="text-4xl lg:text-6xl leading-[1.1] mb-4">
                        Nossa Coleção Completa
                    </h1>
                    <p className="text-[var(--color-foreground-muted)] max-w-xl leading-relaxed">
                        Curadoria botânica inspirada pela efemeridade das estações e o rigor da estética editorial.
                    </p>
                </div>

                <ShopContent />
            </main>
            <Footer />
        </>
    )
}