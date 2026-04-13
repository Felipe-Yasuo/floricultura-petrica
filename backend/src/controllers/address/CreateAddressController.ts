import { Request, Response } from 'express'
import { CreateAddressService } from '../../services/address/CreateAddressService'

export class CreateAddressController {
    private service = new CreateAddressService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { label, street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body
        const address = await this.service.execute({ user_id, label, street, number, complement, neighborhood, city, state, zipCode, isDefault })
        res.status(201).json(address)
    }
}