import { Request, Response } from 'express'
import { UpdateAddressService } from '../../services/address/UpdateAddressService'

export class UpdateAddressController {
    private service = new UpdateAddressService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const user_id = req.userId as string
        const { id } = req.params as { id: string }
        const { label, street, number, complement, neighborhood, city, state, zipCode, isDefault } = req.body
        const address = await this.service.execute({ id, user_id, label, street, number, complement, neighborhood, city, state, zipCode, isDefault })
        res.json(address)
    }
}