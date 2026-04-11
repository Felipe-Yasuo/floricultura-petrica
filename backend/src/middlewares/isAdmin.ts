import { Request, Response, NextFunction } from 'express'

export const isAdmin = (req: Request, res: Response, next: NextFunction): void => {
    if (req.userRole !== 'ADMIN') {
        res.status(403).json({ error: 'Acesso negado' })
        return
    }
    next()
}