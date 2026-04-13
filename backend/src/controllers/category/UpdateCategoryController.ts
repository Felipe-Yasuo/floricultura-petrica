import { Request, Response } from 'express'
import { UpdateCategoryService } from '../../services/category/UpdateCategoryService'

export class UpdateCategoryController {
    private service = new UpdateCategoryService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const { name, image } = req.body
        const category = await this.service.execute({ id, name, image })
        res.json(category)
    }
}