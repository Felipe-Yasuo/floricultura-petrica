import type { Metadata } from 'next'
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

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
    const { slug } = await params
    try {
        const product: Product = await api(`/products/slug/${slug}`)
        return {
            title: product.name,
            description: product.description,
            openGraph: {
                title: `${product.name} | Pétrica`,
                description: product.description,
                type: "website",
                images: [
                    {
                        url: product.banner,
                        width: 1200,
                        height: 630,
                        alt: product.name,
                    },
                ],
            },
            twitter: {
                card: "summary_large_image",
                title: `${product.name} | Pétrica`,
                description: product.description,
                images: [product.banner],
            },
        }
    } catch {
        return { title: "Produto não encontrado" }
    }
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { slug } = await params

    let product: Product | null = null
    let related: Product[] = []

    try {
        product = await api(`/products/slug/${slug}`)

        const allRes = await api('/products')
        const allProducts: Product[] = allRes.data || allRes
        related = allProducts
            .filter((p) => p.category_id === product!.category_id && p.id !== product!.id)
            .slice(0, 4)
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