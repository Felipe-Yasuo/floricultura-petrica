import { Request, Response } from 'express'
import { DeleteAddressService } from '../../services/address/DeleteAddressService'

export class DeleteAddressController {
    private service = new DeleteAddressService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { id } = req.params as { id: string }
        await this.service.execute(id, user_id)
        res.status(204).send()
    }
}