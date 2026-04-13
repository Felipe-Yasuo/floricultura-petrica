import { Request, Response } from 'express'
import { ListProductsService } from '../../services/product/ListProductsService'

export class ListProductsController {
    private service = new ListProductsService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const category_id = req.query.category_id as string | undefined
        const products = await this.service.execute({ category_id })
        res.json(products)
    }
}