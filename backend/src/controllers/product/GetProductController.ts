import { Request, Response } from 'express'
import { GetProductService } from '../../services/product/GetProductService'

export class GetProductController {
    private service = new GetProductService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const product = await this.service.execute(id)
        res.json(product)
    }
}