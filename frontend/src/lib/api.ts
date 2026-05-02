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
        const body = await response.json().catch(() => null)
        const message = body?.error || body?.message || `Erro ${response.status}: ${response.statusText}`
        throw new Error(message)
    }

    if (response.status === 204) return null

    return response.json()
}