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
        banner: '/images/products/redroses.png',
        category: 'Flores Cortadas',
        badge: 'Mais Vendido',
    },
    {
        id: '2',
        name: 'Orquídea Phalaenopsis',
        slug: 'orquidea-phalaenopsis',
        description: 'Elegância em vaso de cerâmica',
        price: 18900,
        banner: '/images/products/whiteflower.png',
        category: 'Plantas em Vaso',
    },
    {
        id: '3',
        name: 'Kit Suculentas',
        slug: 'kit-suculentas',
        description: 'Mix de suculentas em caixa artesanal',
        price: 9500,
        banner: '/images/products/succulent.png',
        category: 'Suculentas e Cactos',
        badge: 'Novo',
    },
    {
        id: '4',
        name: 'Buquê de Girassóis',
        slug: 'buque-de-girassois',
        description: 'Alegria em forma de flores',
        price: 15900,
        banner: '/images/products/sunflower.png',
        category: 'Flores Cortadas',
    },
    {
        id: '5',
        name: 'Monstera Thai',
        slug: 'monstera-thai',
        description: 'Folhagem exótica e imponente',
        price: 45000,
        banner: '/images/products/whiteflower.png',
        category: 'Plantas em Vaso',
    },
    {
        id: '6',
        name: 'Poesia Silvestre',
        slug: 'poesia-silvestre',
        description: 'Arranjo com flores do campo',
        price: 31000,
        banner: '/images/products/redroses.png',
        category: 'Flores Cortadas',
    },
    {
        id: '7',
        name: 'Cascata Pérola',
        slug: 'cascata-perola',
        description: 'Suculenta pendente rara',
        price: 8800,
        banner: '/images/products/succulent.png',
        category: 'Suculentas e Cactos',
    },
    {
        id: '8',
        name: 'Samambaia Real',
        slug: 'samambaia-real',
        description: 'Folhagem volumosa e elegante',
        price: 12000,
        banner: '/images/products/whiteflower.png',
        category: 'Plantas em Vaso',
    },
    {
        id: '9',
        name: 'Protea Solar',
        slug: 'protea-solar',
        description: 'Flor exótica sul-africana',
        price: 29000,
        banner: '/images/products/sunflower.png',
        category: 'Flores Cortadas',
    },
    {
        id: '10',
        name: 'Arranjo Deserto',
        slug: 'arranjo-deserto',
        description: 'Composição de cactos variados',
        price: 9500,
        banner: '/images/products/succulent.png',
        category: 'Suculentas e Cactos',
        badge: 'Novo',
    },
    {
        id: '11',
        name: 'Ficus Lyrata',
        slug: 'ficus-lyrata',
        description: 'A queridinha da decoração',
        price: 18000,
        banner: '/images/products/whiteflower.png',
        category: 'Plantas em Vaso',
    },
    {
        id: '12',
        name: 'Tulipa Noir',
        slug: 'tulipa-noir',
        description: 'Tulipas em tom burgundy profundo',
        price: 15500,
        banner: '/images/products/redroses.png',
        category: 'Flores Cortadas',
    },
]