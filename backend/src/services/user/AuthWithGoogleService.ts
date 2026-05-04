import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { UnauthorizedError } from '../../errors/AppError'
import prismaClient from '../../lib/prisma'
import { env } from '../../config/env'

interface AuthWithGoogleRequest {
    accessToken: string
}

interface GoogleUserInfo {
    sub: string
    email?: string
    email_verified?: boolean
    name?: string
}

const googleClient = new OAuth2Client(env.GOOGLE_CLIENT_ID)

export class AuthWithGoogleService {
    async execute({ accessToken }: AuthWithGoogleRequest) {
        const tokenInfo = await googleClient.getTokenInfo(accessToken).catch(() => {
            throw new UnauthorizedError('Token Google inválido')
        })

        if (tokenInfo.aud !== env.GOOGLE_CLIENT_ID) {
            throw new UnauthorizedError('Token Google não pertence a esta aplicação')
        }

        const response = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
            headers: { Authorization: `Bearer ${accessToken}` },
        })

        if (!response.ok) {
            throw new UnauthorizedError('Falha ao buscar perfil do Google')
        }

        const payload = (await response.json()) as GoogleUserInfo

        if (!payload.sub || !payload.email) {
            throw new UnauthorizedError('Perfil Google incompleto')
        }

        if (!payload.email_verified) {
            throw new UnauthorizedError('Email do Google não verificado')
        }

        const googleId = payload.sub
        const email = payload.email.toLowerCase()
        const name = payload.name?.trim() || email.split('@')[0] || email

        let user = await prismaClient.user.findUnique({ where: { googleId } })

        if (!user) {
            const userByEmail = await prismaClient.user.findUnique({ where: { email } })

            if (userByEmail) {
                user = await prismaClient.user.update({
                    where: { id: userByEmail.id },
                    data: { googleId },
                })
            } else {
                user = await prismaClient.user.create({
                    data: {
                        name,
                        email,
                        googleId,
                    },
                })
            }
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
                role: user.role,
            },
        }
    }
}
