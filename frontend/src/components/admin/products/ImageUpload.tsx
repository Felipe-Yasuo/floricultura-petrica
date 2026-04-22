'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Loader2, Upload, X } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    error?: string
}

export default function ImageUpload({ value, onChange, error }: ImageUploadProps) {
    const { token } = useAuth()
    const [uploading, setUploading] = useState(false)
    const [uploadError, setUploadError] = useState('')

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setUploadError('')

        try {
            const formData = new FormData()
            formData.append('image', file)

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Erro ao fazer upload')
            }

            const data = await response.json()
            onChange(data.url)
        } catch (err) {
            setUploadError(err instanceof Error ? err.message : 'Erro ao fazer upload')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="sm:col-span-2">
            {value ? (
                <div className="flex items-center gap-4">
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[var(--color-surface-container-low)]">
                        <Image src={value} alt="Preview" fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm text-[var(--color-foreground-muted)] truncate max-w-xs">
                            Imagem carregada
                        </p>
                        <button
                            type="button"
                            onClick={() => onChange('')}
                            className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 mt-1 transition-colors duration-300"
                        >
                            <X size={12} />
                            Remover
                        </button>
                    </div>
                </div>
            ) : (
                <label className={`flex flex-col items-center justify-center gap-2 px-5 py-8 rounded-2xl cursor-pointer transition-colors duration-300 ${error
                        ? 'bg-red-50 ring-2 ring-red-400'
                        : 'bg-[var(--color-surface-container)] hover:bg-[var(--color-surface-container-high)]'
                    }`}>
                    {uploading ? (
                        <Loader2 size={24} className="animate-spin text-[var(--color-primary)]" />
                    ) : (
                        <>
                            <Upload size={24} className="text-[var(--color-foreground-muted)]" />
                            <span className="text-sm text-[var(--color-foreground-muted)]">
                                Clique para selecionar uma imagem
                            </span>
                            <span className="text-xs text-[var(--color-foreground-subtle)]">
                                JPG, PNG ou WebP (máx. 5MB)
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleUpload}
                        className="hidden"
                        disabled={uploading}
                    />
                </label>
            )}
            {(error || uploadError) && (
                <p className="text-xs text-red-500 mt-1.5 ml-1">{error || uploadError}</p>
            )}
        </div>
    )
}