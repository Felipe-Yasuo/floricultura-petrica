import { Request, Response } from 'express'
import { UploadImageService } from '../../services/upload/UploadImageService'

export class UploadImageController {
    private service = new UploadImageService()

    handle = async (req: Request, res: Response): Promise<void> => {
        const file = req.file
        const result = await this.service.execute(file as Express.Multer.File)
        res.status(201).json(result)
    }
}