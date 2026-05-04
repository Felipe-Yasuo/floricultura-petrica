import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { UnauthorizedError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { env } from '../../config/env'

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
            throw new UnauthorizedError('Email ou senha inválidos')
        }

        if (!user.password) {
            throw new UnauthorizedError('Esta conta foi criada com Google. Entre com o botão do Google.')
        }

        const passwordMatch = await bcrypt.compare(password, user.password)

        if (!passwordMatch) {
            throw new UnauthorizedError('Email ou senha inválidos')
        }

        const token = jwt.sign(
            { sub: user.id, role: user.role },
            env.JWT_SECRET,
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