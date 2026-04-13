import { Request, Response } from 'express'
import { CreateProductService } from '../../services/product/CreateProductService'

export class CreateProductController {
    private service = new CreateProductService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { name, description, price, stock, banner, category_id } = req.body
        const product = await this.service.execute({ name, description, price, stock, banner, category_id })
        res.status(201).json(product)
    }
}