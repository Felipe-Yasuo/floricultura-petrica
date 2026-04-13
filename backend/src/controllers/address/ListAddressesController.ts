import { Request, Response } from 'express'
import { ListAddressesService } from '../../services/address/ListAddressesService'

export class ListAddressesController {
    private service = new ListAddressesService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const addresses = await this.service.execute(user_id)
        res.json(addresses)
    }
}