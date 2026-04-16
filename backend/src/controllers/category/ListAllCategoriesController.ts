import { Request, Response } from 'express'
import { ListAllCategoriesService } from '../../services/category/ListAllCategoriesService'

export class ListAllCategoriesController {
    private service = new ListAllCategoriesService()

    handle = async (_req: Request, res: Response): Promise<void> => {
        const categories = await this.service.execute()
        res.json(categories)
    }
}