import { Request, Response } from 'express'
import { GetOrderService } from '../../services/order/GetOrderService'

export class GetOrderController {
    private service = new GetOrderService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const role = req.userRole as string
        const { id } = req.params as { id: string }
        const order = await this.service.execute({ id, user_id, role })
        res.json(order)
    }
}