import { Request, Response } from 'express'
import { GetCartService } from '../../services/cart/GetCartService'

export class GetCartController {
    private service = new GetCartService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const cart = await this.service.execute(user_id)
        res.json(cart)
    }
}