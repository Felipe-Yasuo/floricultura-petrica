import { Request, Response } from 'express'
import { CreateCategoryService } from '../../services/category/CreateCategoryService'

export class CreateCategoryController {
    private service = new CreateCategoryService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { name, image } = req.body
        const category = await this.service.execute({ name, image })
        res.status(201).json(category)
    }
}