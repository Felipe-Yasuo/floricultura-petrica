import { Request, Response } from 'express'
import { ListOrdersService } from '../../services/order/ListOrdersService'

export class ListOrdersController {
    private service = new ListOrdersService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const role = req.userRole as string
        const orders = await this.service.execute({ user_id, role })
        res.json(orders)
    }
}