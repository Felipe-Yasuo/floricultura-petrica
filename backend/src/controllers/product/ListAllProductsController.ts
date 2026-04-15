import { Request, Response } from 'express'
import { ListAllProductsService } from '../../services/product/ListAllProductsService'

export class ListAllProductsController {
    private service = new ListAllProductsService()

    handle = async (_req: Request, res: Response): Promise<void> => {
        const products = await this.service.execute()
        res.json(products)
    }
}