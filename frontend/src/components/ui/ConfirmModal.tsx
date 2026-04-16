'use client'

import { AlertTriangle } from 'lucide-react'

interface ConfirmModalProps {
    open: boolean
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    variant?: 'danger' | 'primary'
    onConfirm: () => void
    onCancel: () => void
}

export default function ConfirmModal({
    open,
    title,
    description,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    variant = 'primary',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    if (!open) return null

    const isDanger = variant === 'danger'

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="w-full max-w-md rounded-3xl bg-[var(--color-surface-white)] p-8 shadow-ambient">
                <div className="flex items-start gap-4 mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                        }`}>
                        <AlertTriangle size={22} />
                    </div>
                    <div>
                        <h3 className="font-serif text-xl mb-2">{title}</h3>
                        <p className="text-sm text-[var(--color-foreground-muted)] leading-relaxed">
                            {description}
                        </p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-6 py-3 rounded-2xl bg-[var(--color-surface-container)] text-sm font-medium hover:bg-[var(--color-surface-container-high)] transition-colors duration-300"
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-6 py-3 rounded-2xl text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] ${isDanger ? 'bg-red-500 hover:bg-red-600' : 'bg-[var(--color-primary)]'
                            }`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    )
}