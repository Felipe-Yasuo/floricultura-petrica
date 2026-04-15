export interface Address {
    id: string
    label: string | null
    street: string
    number: string
    complement: string | null
    neighborhood: string
    city: string
    state: string
    zipCode: string
    isDefault: boolean
}