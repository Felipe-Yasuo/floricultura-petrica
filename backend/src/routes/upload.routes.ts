import { Router } from 'express'
import { UploadImageController } from '../controllers/upload/UploadImageController'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'
import upload from '../config/multer'

const router = Router()

router.post('/', isAuthenticated, isAdmin, upload.single('image'), asyncHandler(new UploadImageController().handle))

export default router