export interface User {
    id: string
    name: string
    email: string
    role: 'CUSTOMER' | 'ADMIN'
}

export interface AuthResponse {
    token: string
    user: User
}