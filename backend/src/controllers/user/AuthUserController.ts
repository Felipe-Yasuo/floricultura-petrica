import { Request, Response } from 'express'
import { AuthUserService } from '../../services/user/AuthUserService'

export class AuthUserController {
    private service = new AuthUserService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { email, password } = req.body
        const result = await this.service.execute({ email, password })
        res.json(result)
    }
}