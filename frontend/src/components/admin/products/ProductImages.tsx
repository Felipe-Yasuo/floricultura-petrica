'use client'

import { useState, useEffect } from 'react'
import { Loader2, Upload, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { api } from '@/lib/api'

interface ProductImage {
    id: string
    url: string
    position: number
}

interface ProductImagesProps {
    productId: string
}

export default function ProductImages({ productId }: ProductImagesProps) {
    const { token } = useAuth()
    const [images, setImages] = useState<ProductImage[]>([])
    const [uploading, setUploading] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        fetchImages()
    }, [productId])

    const fetchImages = async () => {
        try {
            const data = await api(`/product-images/${productId}`)
            setImages(data)
        } catch (err) {
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        setUploading(true)

        try {
            for (const file of Array.from(files)) {
                const formData = new FormData()
                formData.append('image', file)

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData,
                })

                if (!uploadRes.ok) continue

                const { url } = await uploadRes.json()

                await api(`/product-images/${productId}`, {
                    method: 'POST',
                    token: token!,
                    body: JSON.stringify({ url }),
                })
            }

            await fetchImages()
        } catch (err) {
            console.error(err)
        } finally {
            setUploading(false)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api(`/product-images/${id}`, {
                method: 'DELETE',
                token: token!,
            })
            await fetchImages()
        } catch (err) {
            console.error(err)
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-8">
                <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
            </div>
        )
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs tracking-[0.15em] uppercase text-[var(--color-foreground-subtle)]">
                    Imagens do Carrossel
                </h3>
                <label className="flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-xs font-medium cursor-pointer hover:scale-[1.02] transition-all duration-300">
                    {uploading ? (
                        <Loader2 size={14} className="animate-spin" />
                    ) : (
                        <>
                            <Upload size={14} />
                            Adicionar
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            </div>

            {images.length === 0 ? (
                <div className="text-center py-8 rounded-2xl bg-[var(--color-surface-container-low)]">
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                        Nenhuma imagem extra. Adicione imagens para o carrossel.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                    {images.map((image) => (
                        <div key={image.id} className="relative group aspect-square rounded-2xl overflow-hidden bg-[var(--color-surface-container-low)]">
                            <img src={image.url} alt="Imagem do produto" className="w-full h-full object-cover" />
                            <button
                                onClick={() => handleDelete(image.id)}
                                className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 hover:scale-110 transition-all duration-300"
                                aria-label="Remover imagem"
                            >
                                <X size={12} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}