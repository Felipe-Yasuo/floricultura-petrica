import { Request, Response } from 'express'
import { ListProductImagesService } from '../../services/productImage/ListProductImagesService'

export class ListProductImagesController {
    private service = new ListProductImagesService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { productId } = req.params as { productId: string }
        const images = await this.service.execute(productId)
        res.json(images)
    }
}