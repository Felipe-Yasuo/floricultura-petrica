import { Request, Response } from 'express'
import { ClearCartService } from '../../services/cart/ClearCartService'

export class ClearCartController {
    private service = new ClearCartService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        await this.service.execute(user_id)
        res.status(204).send()
    }
}

