export function formatCurrencyInput(value: string): { display: string; cents: number } {
    const numbers = value.replace(/\D/g, '')
    const cents = parseInt(numbers || '0', 10)

    const display = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(cents / 100)

    return { display, cents }
}