import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/product/ProductDetail'
import RelatedProducts from '@/components/product/RelatedProducts'
import { api } from '@/lib/api'
import { notFound } from 'next/navigation'
import { Product } from '@/types/product'

interface ProductPageProps {
    params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params

    let product: Product | null = null
    let related: Product[] = []

    try {
        const res = await api('/products')
        const products: Product[] = res.data || res
        product = products.find((p) => p.slug === slug) || null

        if (product) {
            related = products
                .filter((p) => p.category_id === product!.category_id && p.id !== product!.id)
                .slice(0, 4)
        }
    } catch {
        notFound()
    }

    if (!product) {
        notFound()
    }

    return (
        <>
            <Navbar />
            <main className="pt-28 pb-24 px-6 lg:px-8 max-w-7xl mx-auto">
                <ProductDetail product={product} />
                <RelatedProducts products={related} />
            </main>
            <Footer />
        </>
    )
}