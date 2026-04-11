import { Request, Response, NextFunction } from 'express'
import { AppError } from '../errors/AppError'
import { Prisma } from '../generated/prisma/client'

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
    // AppError — erros esperados da aplicação
    if (err instanceof AppError) {
        res.status(err.statusCode).json({ error: err.message })
        return
    }

    if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
            res.status(409).json({ error: 'Registro já existe' })
            return
        }
        if (err.code === 'P2025') {
            res.status(404).json({ error: 'Registro não encontrado' })
            return
        }
    }

    console.error(process.env.NODE_ENV === 'production' ? err.message : err)
    res.status(500).json({ error: 'Erro interno do servidor' })
}