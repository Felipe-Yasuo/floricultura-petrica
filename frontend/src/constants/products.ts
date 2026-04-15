export interface Product {
    id: string
    name: string
    slug: string
    description: string
    price: number
    banner: string
    category: string
    badge?: string
}

export const mockProducts: Product[] = [
    {
        id: '1',
        name: 'Buquê de Rosas Vermelhas',
        slug: 'buque-de-rosas-vermelhas',
        description: 'Rosas colombianas frescas',
        price: 28900,
        banner: '/images/products/redroses.jpeg',
        category: 'Flores Cortadas',
        badge: 'Mais Vendido',
    },
    {
        id: '2',
        name: 'Orquídea Phalaenopsis',
        slug: 'orquidea-phalaenopsis',
        description: 'Elegância em vaso de cerâmica',
        price: 18900,
        banner: '/images/products/whiteflower.jpeg',
        category: 'Plantas em Vaso',
    },
    {
        id: '3',
        name: 'Kit Suculentas',
        slug: 'kit-suculentas',
        description: 'Mix de suculentas em caixa artesanal',
        price: 9500,
        banner: '/images/products/succulent.jpeg',
        category: 'Suculentas e Cactos',
        badge: 'Novo',
    },
    {
        id: '4',
        name: 'Buquê de Girassóis',
        slug: 'buque-de-girassois',
        description: 'Alegria em forma de flores',
        price: 15900,
        banner: '/images/products/sunflower.jpeg',
        category: 'Flores Cortadas',
    },
]