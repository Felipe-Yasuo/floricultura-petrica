import { Request, Response } from 'express'
import { GetProductBySlugService } from '../../services/product/GetProductBySlugService'

export class GetProductBySlugController {
    private service = new GetProductBySlugService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { slug } = req.params as { slug: string }
        const product = await this.service.execute(slug)
        res.json(product)
    }
}