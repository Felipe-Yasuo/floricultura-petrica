import { Request, Response } from 'express'
import { DeleteProductImageService } from '../../services/productImage/DeleteProductImageService'

export class DeleteProductImageController {
    private service = new DeleteProductImageService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        await this.service.execute(id)
        res.status(204).send()
    }
}