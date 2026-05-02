'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ArrowRight, Loader2 } from 'lucide-react'
import { useGoogleLogin } from '@react-oauth/google'
import { toast } from 'sonner'
import { z } from 'zod'
import { useAuth } from '@/contexts/AuthContext'

function GoogleLoginButton({ disabled }: { disabled: boolean }) {
    const { loginWithGoogle } = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const handleGoogleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            setLoading(true)
            try {
                await loginWithGoogle(tokenResponse.access_token)
                toast.success('Login realizado com sucesso!')
                router.push('/')
            } catch (err) {
                toast.error(err instanceof Error ? err.message : 'Erro ao entrar com Google')
            } finally {
                setLoading(false)
            }
        },
        onError: () => {
            toast.error('Não foi possível entrar com Google. Tente novamente.')
            setLoading(false)
        },
    })

    return (
        <>
            <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-[var(--color-surface-container-high)]" />
                <span className="text-xs text-[var(--color-foreground-subtle)]">ou</span>
                <div className="flex-1 h-px bg-[var(--color-surface-container-high)]" />
            </div>
            <button
                type="button"
                onClick={() => { setLoading(true); handleGoogleLogin() }}
                disabled={loading || disabled}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[var(--color-surface-container)] text-sm font-medium text-[var(--color-foreground)] hover:bg-[var(--color-surface-container-high)] transition-colors duration-300 mb-8 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                ) : (
                    <>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                        </svg>
                        Continuar com Google
                    </>
                )}
            </button>
        </>
    )
}

type AuthTab = 'login' | 'register'

interface AuthFormProps {
    initialTab?: AuthTab
}

const loginSchema = z.object({
    email: z.email({ error: 'Email inválido' }),
    password: z.string().min(1, { error: 'Senha obrigatória' }),
})

const registerSchema = z.object({
    name: z.string().min(2, { error: 'Nome deve ter no mínimo 2 caracteres' }),
    email: z.email({ error: 'Email inválido' }),
    password: z.string().min(6, { error: 'A senha deve ter no mínimo 6 caracteres' }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
})

type FieldErrors = Partial<Record<string, string>>

const inputClass = (error?: string) =>
    `w-full px-5 py-3.5 rounded-2xl bg-[var(--color-surface-white)] text-sm text-[var(--color-foreground)] placeholder:text-[var(--color-foreground-subtle)] outline-none transition-all duration-300 focus:ring-2 ${
        error
            ? 'ring-2 ring-red-400 focus:ring-red-400'
            : 'focus:ring-[var(--color-primary)]'
    }`

function FieldError({ message }: { message?: string }) {
    if (!message) return null
    return <p className="text-xs text-red-500 mt-1 pl-1">{message}</p>
}

export default function AuthForm({ initialTab = 'login' }: AuthFormProps) {
    const router = useRouter()
    const { login, register } = useAuth()
    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const [loading, setLoading] = useState(false)
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

    const resetForm = () => {
        setName('')
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setShowPassword(false)
        setFieldErrors({})
    }

    const switchTab = (tab: AuthTab) => {
        resetForm()
        setActiveTab(tab)
    }

    const clearFieldError = (field: string) => {
        if (fieldErrors[field]) {
            setFieldErrors((prev) => ({ ...prev, [field]: undefined }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (activeTab === 'login') {
            const result = loginSchema.safeParse({ email, password })
            if (!result.success) {
                const errors: FieldErrors = {}
                for (const issue of result.error.issues) {
                    const field = issue.path[0] as string
                    if (!errors[field]) errors[field] = issue.message
                }
                setFieldErrors(errors)
                return
            }
        } else {
            const result = registerSchema.safeParse({ name, email, password, confirmPassword })
            if (!result.success) {
                const errors: FieldErrors = {}
                for (const issue of result.error.issues) {
                    const field = issue.path[0] as string
                    if (!errors[field]) errors[field] = issue.message
                }
                setFieldErrors(errors)
                return
            }
        }

        setFieldErrors({})
        setLoading(true)

        try {
            if (activeTab === 'login') {
                await login(email, password)
                toast.success('Bem-vindo de volta!')
            } else {
                await register(name, email, password)
                toast.success('Conta criada com sucesso!')
            }
            router.push('/')
        } catch (err) {
            toast.error(err instanceof Error ? err.message : 'Erro ao processar')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="w-full max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-0 rounded-3xl overflow-hidden shadow-ambient bg-[var(--color-surface-white)]">
            {/* Image - Left */}
            <div className="hidden lg:block relative">
                <img
                    src="/images/login/adao.png"
                    alt="Planta decorativa"
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Form - Right */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="font-serif text-3xl lg:text-4xl text-[var(--color-primary)] leading-[1.1] mb-3">
                        {activeTab === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h1>
                    <p className="text-sm text-[var(--color-foreground-muted)]">
                        {activeTab === 'login'
                            ? 'Acesse sua conta para gerenciar seus pedidos e coleções.'
                            : 'Cadastre-se para explorar nossa curadoria botânica.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex rounded-2xl bg-[var(--color-surface-container)] p-1 mb-6">
                    <button
                        onClick={() => switchTab('login')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'login'
                            ? 'bg-[var(--color-surface-white)] text-[var(--color-foreground)] shadow-ambient'
                            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                            }`}
                    >
                        Entrar
                    </button>
                    <button
                        onClick={() => switchTab('register')}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${activeTab === 'register'
                            ? 'bg-[var(--color-surface-white)] text-[var(--color-foreground)] shadow-ambient'
                            : 'text-[var(--color-foreground-muted)] hover:text-[var(--color-foreground)]'
                            }`}
                    >
                        Cadastrar
                    </button>
                </div>

                {/* Demo credentials card - Login only */}
                {activeTab === 'login' && (
                    <div className="rounded-2xl border border-(--color-secondary-light)/40 bg-(--color-secondary-light)/10 px-5 py-4 mb-5 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-(--color-secondary) mb-1.5">Conta de demonstração</p>
                            <p className="text-xs text-(--color-foreground-muted) font-mono truncate">admin@example.com</p>
                            <p className="text-xs text-(--color-foreground-muted) font-mono">123456789</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => { setEmail('admin@example.com'); setPassword('123456789'); setFieldErrors({}) }}
                            className="shrink-0 text-xs font-medium text-(--color-secondary) hover:text-(--color-primary) underline underline-offset-2 transition-colors duration-200"
                        >
                            Preencher
                        </button>
                    </div>
                )}

                {/* Form Fields */}
                <div className="rounded-3xl bg-[var(--color-surface-container-low)] p-6 lg:p-8 mb-6">
                    <div className="flex flex-col gap-4">
                        {/* Name - Register only */}
                        {activeTab === 'register' && (
                            <div>
                                <label htmlFor="auth-name" className="sr-only">Nome completo</label>
                                <input
                                    id="auth-name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => { setName(e.target.value); clearFieldError('name') }}
                                    placeholder="Nome completo"
                                    className={inputClass(fieldErrors.name)}
                                />
                                <FieldError message={fieldErrors.name} />
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label htmlFor="auth-email" className="sr-only">Email</label>
                            <input
                                id="auth-email"
                                type="email"
                                value={email}
                                onChange={(e) => { setEmail(e.target.value); clearFieldError('email') }}
                                placeholder="Email"
                                className={inputClass(fieldErrors.email)}
                            />
                            <FieldError message={fieldErrors.email} />
                        </div>

                        {/* Password */}
                        <div>
                            <div className="relative">
                                <label htmlFor="auth-password" className="sr-only">Senha</label>
                                <input
                                    id="auth-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => { setPassword(e.target.value); clearFieldError('password') }}
                                    placeholder={activeTab === 'register' ? 'Senha (mínimo 6 caracteres)' : 'Senha'}
                                    className={`${inputClass(fieldErrors.password)} pr-12`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-foreground-subtle)] hover:text-[var(--color-foreground)] transition-colors duration-300"
                                    aria-label={showPassword ? 'Esconder senha' : 'Mostrar senha'}
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            <FieldError message={fieldErrors.password} />
                        </div>

                        {/* Confirm Password - Register only */}
                        {activeTab === 'register' && (
                            <div>
                                <label htmlFor="auth-confirm-password" className="sr-only">Confirmar senha</label>
                                <input
                                    id="auth-confirm-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => { setConfirmPassword(e.target.value); clearFieldError('confirmPassword') }}
                                    placeholder="Confirmar senha"
                                    className={inputClass(fieldErrors.confirmPassword)}
                                />
                                <FieldError message={fieldErrors.confirmPassword} />
                            </div>
                        )}

                        {/* Remember & Forgot - Login only */}
                        {activeTab === 'login' && (
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="w-4 h-4 rounded accent-[var(--color-primary)]"
                                    />
                                    <span className="text-xs text-[var(--color-foreground-muted)]">Lembrar de mim</span>
                                </label>
                                <Link
                                    href="/forgot-password"
                                    className="text-xs text-[var(--color-foreground-muted)] hover:text-[var(--color-primary)] transition-colors duration-300"
                                >
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-[var(--color-on-primary)] font-medium hover:scale-[1.01] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mb-6"
                >
                    {loading ? (
                        <Loader2 size={18} className="animate-spin" />
                    ) : (
                        <>
                            {activeTab === 'login' ? 'Entrar na Pétrica' : 'Criar Conta'}
                            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                    )}
                </button>

                {/* Google Login */}
                <GoogleLoginButton disabled={loading} />

                {/* Switch Tab Link */}
                <p className="text-center text-sm text-[var(--color-foreground-muted)]">
                    {activeTab === 'login' ? (
                        <>
                            Ainda não tem conta?{' '}
                            <button
                                onClick={() => switchTab('register')}
                                className="text-[var(--color-primary)] font-medium hover:underline"
                            >
                                Cadastre-se
                            </button>
                        </>
                    ) : (
                        <>
                            Já tem conta?{' '}
                            <button
                                onClick={() => switchTab('login')}
                                className="text-[var(--color-primary)] font-medium hover:underline"
                            >
                                Fazer login
                            </button>
                        </>
                    )}
                </p>
            </div>
        </div>
    )
}
