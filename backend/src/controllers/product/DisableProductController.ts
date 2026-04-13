import { Request, Response } from 'express'
import { DisableProductService } from '../../services/product/DisableProductService'

export class DisableProductController {
    private service = new DisableProductService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const product = await this.service.execute(id)
        res.json(product)
    }
}