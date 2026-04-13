import { Request, Response } from 'express'
import { RemoveCartItemService } from '../../services/cart/RemoveCartItemService'

export class RemoveCartItemController {
    private service = new RemoveCartItemService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { id } = req.params as { id: string }
        await this.service.execute({ id, user_id })
        res.status(204).send()
    }
}