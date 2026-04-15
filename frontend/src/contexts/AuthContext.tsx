'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { api } from '@/lib/api'
import { User, AuthResponse } from '@/types/user'

interface AuthContextData {
    user: User | null
    token: string | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
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

    const login = async (email: string, password: string) => {
        const data: AuthResponse = await api('/users/session', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        })

        setToken(data.token)
        setUser(data.user)
        window.localStorage.setItem('@petrica:token', data.token)
        window.localStorage.setItem('@petrica:user', JSON.stringify(data.user))
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
        <AuthContext.Provider
            value={{
                user,
                token,
                isAuthenticated: !!user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}