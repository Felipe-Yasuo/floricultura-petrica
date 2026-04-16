'use client'

interface CheckoutDetailsStepProps {
    deliveryDate: string
    onChangeDeliveryDate: (value: string) => void
    notes: string
    onChangeNotes: (value: string) => void
}

export default function CheckoutDetailsStep({
    deliveryDate,
    onChangeDeliveryDate,
    notes,
    onChangeNotes,
}: CheckoutDetailsStepProps) {
    // Data mínima: amanhã
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const minDate = tomorrow.toISOString().split('T')[0]

    return (
        <div className="rounded-3xl bg-[var(--color-surface-white)] p-6 lg:p-8 shadow-ambient flex flex-col gap-6">
            <div>
                <h2 className="font-serif text-xl mb-2">Data de Entrega</h2>
                <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                    Escolha a partir de quando você quer receber seu pedido.
                </p>
                <input
                    type="date"
                    value={deliveryDate}
                    min={minDate}
                    onChange={(e) => onChangeDeliveryDate(e.target.value)}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300"
                />
            </div>

            <div>
                <h2 className="font-serif text-xl mb-2">Observações</h2>
                <p className="text-sm text-[var(--color-foreground-muted)] mb-4">
                    Alguma instrução especial para a entrega? (opcional)
                </p>
                <textarea
                    value={notes}
                    onChange={(e) => onChangeNotes(e.target.value)}
                    placeholder="Ex: mensagem no cartão, horário preferido, ponto de referência..."
                    rows={4}
                    maxLength={500}
                    className="w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-container)] text-sm outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-300 resize-none"
                />
                <p className="text-xs text-[var(--color-foreground-subtle)] mt-2 text-right">
                    {notes.length}/500
                </p>
            </div>
        </div>
    )
}