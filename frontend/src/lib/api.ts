const API_URL = process.env.NEXT_PUBLIC_API_URL

interface FetchOptions extends RequestInit {
    token?: string
}

export async function api(endpoint: string, options: FetchOptions = {}) {
    const { token, headers, ...rest } = options

    const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...headers,
        },
        ...rest,
    })

    if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
        throw new Error(error.error || 'Erro na requisição')
    }

    if (response.status === 204) return null

    return response.json()
}