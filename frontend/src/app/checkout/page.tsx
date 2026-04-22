import type { Metadata } from 'next'
import CheckoutContent from '@/components/checkout/CheckoutContent'

export const metadata: Metadata = {
  title: "Finalizar Pedido",
  description: "Confirme seu endereço e detalhes do pedido para concluir a compra.",
  robots: { index: false },
}

export default function CheckoutPage() {
    return <CheckoutContent />
}