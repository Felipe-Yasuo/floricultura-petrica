import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { AppError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'

interface AuthRequest {
    email: string
    password: string
}

export class AuthUserService {
    async execute({ email, password }: AuthRequest) {
        const user = await prismaClient.user.findUnique({
            where: { email }
        })

        if (!user) {
            throw new AppError('Email ou senha inválidos', 401)
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new AppError('Email ou senha inválidos', 401)
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            process.env.JWT_SECRET!,
            { expiresIn: '1d' }
        )

        return {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }
    }
}