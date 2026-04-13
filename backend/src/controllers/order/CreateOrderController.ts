import { Request, Response } from 'express'
import { CreateOrderService } from '../../services/order/CreateOrderService'

export class CreateOrderController {
    private service = new CreateOrderService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { address_id, deliveryDate, notes } = req.body
        const order = await this.service.execute({ user_id, address_id, deliveryDate, notes })
        res.status(201).json(order)
    }
}