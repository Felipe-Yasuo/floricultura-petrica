import { Request, Response } from 'express'
import { AddProductImageService } from '../../services/productImage/AddProductImageService'

export class AddProductImageController {
    private service = new AddProductImageService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params as { productId: string }
        const { url } = req.body
        const image = await this.service.execute({ productId, url })
        res.status(201).json(image)
    }
}