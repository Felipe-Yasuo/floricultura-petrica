import { Request, Response } from 'express'
import { UpdateCartItemService } from '../../services/cart/UpdateCartItemService'

export class UpdateCartItemController {
    private service = new UpdateCartItemService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { id } = req.params as { id: string }
        const { quantity } = req.body
        const item = await this.service.execute({ id, user_id, quantity })
        res.json(item)
    }
}