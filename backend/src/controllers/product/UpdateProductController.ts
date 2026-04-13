import { Request, Response } from 'express'
import { UpdateProductService } from '../../services/product/UpdateProductService'

export class UpdateProductController {
    private service = new UpdateProductService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const { name, description, price, stock, banner, category_id } = req.body
        const product = await this.service.execute({ id, name, description, price, stock, banner, category_id })
        res.json(product)
    }
}