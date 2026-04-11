import { Request, Response } from 'express'
import { CreateUserService } from '../../services/user/CreateUserService'

export class CreateUserController {
    private service = new CreateUserService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const { name, email, password } = req.body
        const user = await this.service.execute({ name, email, password })
        res.status(201).json(user)
    }
}