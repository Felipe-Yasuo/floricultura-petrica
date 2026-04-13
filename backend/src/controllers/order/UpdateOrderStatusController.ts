import { Request, Response } from 'express'
import { UpdateOrderStatusService } from '../../services/order/UpdateOrderStatusService'

export class UpdateOrderStatusController {
    private service = new UpdateOrderStatusService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const { status } = req.body
        const order = await this.service.execute({ id, status })
        res.json(order)
    }
}