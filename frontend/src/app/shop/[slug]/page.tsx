import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ProductDetail from '@/components/product/ProductDetail'
import RelatedProducts from '@/components/product/RelatedProducts'
import { mockProducts } from '@/constants/products'
import { notFound } from 'next/navigation'

interface ProductPageProps {
    params: Promise<{ slug: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params
    const product = mockProducts.find((p) => p.slug === slug)

    if (!product) {
        notFound()
    }

    const related = mockProducts
        .filter((p) => p.category === product.category && p.id !== product.id)
        .slice(0, 4)

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