export function formatPrice(priceInCents: number): string {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(priceInCents / 100)
}