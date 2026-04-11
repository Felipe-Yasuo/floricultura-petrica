import { Request, Response, NextFunction } from 'express'
import { verify, JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken'

interface Payload {
    sub: string
    role: string
}

export const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
    const authToken = req.headers.authorization

    if (!authToken) {
        res.status(401).json({ error: 'Token não fornecido' })
        return
    }

    const [, token] = authToken.split(' ')

    if (!token) {
        res.status(401).json({ error: 'Token não fornecido' })
        return
    }

    try {
        const decoded = verify(token, process.env.JWT_SECRET!) as unknown as Payload
        req.userId = decoded.sub
        req.userRole = decoded.role
        next()
    } catch (err) {
        if (err instanceof TokenExpiredError) {
            res.status(401).json({ error: 'Token expirado' })
            return
        }

        if (err instanceof JsonWebTokenError) {
            res.status(401).json({ error: 'Token inválido' })
            return
        }

        res.status(401).json({ error: 'Erro de autenticação' })
    }
}