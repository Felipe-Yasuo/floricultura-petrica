'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { api } from '@/lib/api'
import { User, AuthResponse } from '@/types/user'

interface AuthContextData {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    loginWithGoogle: (accessToken: string) => Promise<void>
    register: (name: string, email: string, password: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext({} as AuthContextData)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const savedToken = typeof window !== 'undefined' ? window.localStorage.getItem('@petrica:token') : null
        const savedUser = typeof window !== 'undefined' ? window.localStorage.getItem('@petrica:user') : null

        if (savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }

        setIsLoading(false)
    }, [])

    const persistSession = (data: AuthResponse) => {
        setToken(data.token)
        setUser(data.user)
        window.localStorage.setItem('@petrica:token', data.token)
        window.localStorage.setItem('@petrica:user', JSON.stringify(data.user))
    }

    const login = async (email: string, password: string) => {
        const data: AuthResponse = await api('/users/session', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        persistSession(data)
    }

    const loginWithGoogle = async (accessToken: string) => {
        const data: AuthResponse = await api('/users/session/google', {
            method: 'POST',
            body: JSON.stringify({ accessToken }),
        })

        persistSession(data)
    }

    const register = async (name: string, email: string, password: string) => {
        await api('/users', {
            method: 'POST',
            body: JSON.stringify({ name, email, password }),
        })

        await login(email, password)
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        window.localStorage.removeItem('@petrica:token')
        window.localStorage.removeItem('@petrica:user')
    }

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
            <AuthContext.Provider
                value={{
                    user,
                    token,
                    isAuthenticated: !!user,
                    isLoading,
                    login,
                    loginWithGoogle,
                    register,
                    logout,
                }}
            >
                {children}
            </AuthContext.Provider>
        </GoogleOAuthProvider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}