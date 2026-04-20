import { Request, Response } from 'express'
import { ExpireStaleOrdersService } from '../../services/order/ExpireStaleOrdersService'
import { env } from '../../config/env'

export class ExpireStaleOrdersController {
    private service = new ExpireStaleOrdersService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const providedSecret = req.headers['x-cron-secret']

        if (!providedSecret || typeof providedSecret !== 'string') {
            res.status(401).json({ error: 'Secret ausente' })
            return
        }

        if (providedSecret !== env.CRON_SECRET) {
            console.warn(
                `[cleanup] tentativa de acesso com secret inválido de IP ${req.ip}`
            )
            res.status(401).json({ error: 'Secret inválido' })
            return
        }

        const startedAt = Date.now()
        const result = await this.service.execute()
        const durationMs = Date.now() - startedAt

        res.status(200).json({
            ...result,
            durationMs,
        })
    }
}