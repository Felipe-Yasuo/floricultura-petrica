import { Request, Response } from 'express'
import { ListCategoriesService } from '../../services/category/ListCategoriesService'

export class ListCategoriesController {
    private service = new ListCategoriesService()

    handle = async (_req: Request, res: Response): Promise<void> => {
        const categories = await this.service.execute()
        res.json(categories)
    }
}