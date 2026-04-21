import { Request, Response } from 'express'
import { GetOrderPaymentService } from '../../services/order/GetOrderPaymentService'

export class GetOrderPaymentController {
    private service = new GetOrderPaymentService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const order_id = req.params.id as string

        const result = await this.service.execute({ order_id, user_id })
        res.status(200).json(result)
    }
}