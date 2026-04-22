import { Request, Response } from 'express'
import { AuthWithGoogleService } from '../../services/user/AuthWithGoogleService'

export class AuthWithGoogleController {
    private service = new AuthWithGoogleService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { accessToken } = req.body
        const result = await this.service.execute({ accessToken })
        res.json(result)
    }
}
