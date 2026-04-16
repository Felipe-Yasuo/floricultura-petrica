import cloudinary from '../../config/cloudinary'
import { AppError } from '../../errors/AppError'

interface UploadResult {
    url: string
    publicId: string
}

export class UploadImageService {
    async execute(file: Express.Multer.File): Promise<UploadResult> {
        if (!file) {
            throw new AppError('Nenhum arquivo enviado', 400)
        }

        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: 'petrica',
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error || !result) {
                        reject(new AppError('Erro ao fazer upload da imagem', 500))
                        return
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    })
                }
            ).end(file.buffer)
        })
    }
}