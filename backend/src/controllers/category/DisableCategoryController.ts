import { Request, Response } from 'express'
import { DisableCategoryService } from '../../services/category/DisableCategoryService'

export class DisableCategoryController {
    private service = new DisableCategoryService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { id } = req.params as { id: string }
        const category = await this.service.execute(id)
        res.json(category)
    }
}