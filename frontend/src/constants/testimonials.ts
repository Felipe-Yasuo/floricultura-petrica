export interface Testimonial {
    id: string
    name: string
    city: string
    rating: number
    quote: string
    product: string
    color: string
}

export const mockTestimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Mariana S.',
        city: 'São Paulo',
        rating: 5,
        quote: 'O arranjo chegou impecável. O perfume tomou conta da sala inteira. Nunca vi nada tão delicado.',
        product: 'Arranjo Especial',
        color: '#2B694D',
    },
    {
        id: '2',
        name: 'Ricardo F.',
        city: 'Curitiba',
        rating: 5,
        quote: 'A assinatura mensal mudou a energia do meu escritório. Flores frescas toda segunda é um luxo acessível.',
        product: 'Buquê de Rosas',
        color: '#1B4332',
    },
    {
        id: '3',
        name: 'Lucas M.',
        city: 'Rio de Janeiro',
        rating: 5,
        quote: 'Surpreendi minha esposa com o Poesia Escarlate. A qualidade das rosas colombianas é absurda.',
        product: 'Rosas Colombianas',
        color: '#F08080',
    },
    {
        id: '4',
        name: 'Ana Clara B.',
        city: 'Belo Horizonte',
        rating: 5,
        quote: 'Comprei o kit de suculentas pro meu apartamento. Chegou super bem embalado e as plantas estavam perfeitas.',
        product: 'Kit Suculentas',
        color: '#2B694D',
    },
    {
        id: '5',
        name: 'Fernando T.',
        city: 'Florianópolis',
        rating: 4,
        quote: 'Presente de aniversário pra minha mãe. Ela amou! A entrega foi pontual e o arranjo lindo.',
        product: 'Arranjo de Aniversário',
        color: '#1B4332',
    },
    {
        id: '6',
        name: 'Juliana R.',
        city: 'Porto Alegre',
        rating: 5,
        quote: 'As orquídeas da Pétrica são de outro nível. Já faz 3 meses e continua florescendo linda.',
        product: 'Orquídea Phalaenopsis',
        color: '#F08080',
    },
    {
        id: '7',
        name: 'Carlos H.',
        city: 'Brasília',
        rating: 5,
        quote: 'Usei pra decoração do casamento. A equipe foi super atenciosa e os arranjos ficaram impecáveis.',
        product: 'Decoração de Casamento',
        color: '#2B694D',
    },
    {
        id: '8',
        name: 'Beatriz L.',
        city: 'Recife',
        rating: 5,
        quote: 'Melhor floricultura online que já comprei. Embalagem premium, flores frescas e entrega rápida.',
        product: 'Buquê Misto',
        color: '#1B4332',
    },
    {
        id: '9',
        name: 'Pedro A.',
        city: 'Londrina',
        rating: 4,
        quote: 'O bonsai chegou em perfeito estado. Veio com um guia de cuidados que achei muito útil.',
        product: 'Bonsai',
        color: '#F08080',
    },
]