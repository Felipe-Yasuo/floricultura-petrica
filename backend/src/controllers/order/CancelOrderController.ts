import { Request, Response } from 'express'
import { CancelOrderService } from '../../services/order/CancelOrderService'

export class CancelOrderController {
    private service = new CancelOrderService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { id } = req.params as { id: string }
        const order = await this.service.execute({ id, user_id })
        res.json(order)
    }
}