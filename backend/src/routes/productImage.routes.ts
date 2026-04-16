import { Router } from 'express'
import { AddProductImageController } from '../controllers/productImage/AddProductImageController'
import { ListProductImagesController } from '../controllers/productImage/ListProductImagesController'
import { DeleteProductImageController } from '../controllers/productImage/DeleteProductImageController'
import { addProductImageSchema, productImageParamsSchema } from '../schemas/productImageSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.get('/:productId', asyncHandler(new ListProductImagesController().handle))
router.post('/:productId', isAuthenticated, isAdmin, validateSchema(addProductImageSchema), asyncHandler(new AddProductImageController().handle))
router.delete('/:id', isAuthenticated, isAdmin, validateSchema(productImageParamsSchema), asyncHandler(new DeleteProductImageController().handle))

export default router