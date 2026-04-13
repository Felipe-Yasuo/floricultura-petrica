import { Request, Response } from 'express'
import { ListOrdersService } from '../../services/order/ListOrdersService'

export class ListOrdersController {
    private service = new ListOrdersService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const role = req.userRole as string
        const status = req.query.status as string | undefined
        const page = req.query.page as string | undefined
        const limit = req.query.limit as string | undefined
        const orders = await this.service.execute({ user_id, role, status, page, limit })
        res.json(orders)
    }
}