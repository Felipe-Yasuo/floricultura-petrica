import { Request, Response } from 'express'
import { AddCartItemService } from '../../services/cart/AddCartItemService'

export class AddCartItemController {
    private service = new AddCartItemService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { product_id, quantity } = req.body
        const item = await this.service.execute({ user_id, product_id, quantity })
        res.status(201).json(item)
    }
}