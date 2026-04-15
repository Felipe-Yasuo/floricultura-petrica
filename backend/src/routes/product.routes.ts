import { Router } from 'express'
import { CreateProductController } from '../controllers/product/CreateProductController'
import { ListProductsController } from '../controllers/product/ListProductsController'
import { ListAllProductsController } from '../controllers/product/ListAllProductsController'
import { GetProductController } from '../controllers/product/GetProductController'
import { UpdateProductController } from '../controllers/product/UpdateProductController'
import { DisableProductController } from '../controllers/product/DisableProductController'
import { createProductSchema, updateProductSchema, productParamsSchema } from '../schemas/productSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/', isAuthenticated, isAdmin, validateSchema(createProductSchema), asyncHandler(new CreateProductController().handle))
router.get('/', asyncHandler(new ListProductsController().handle))
router.get('/all', isAuthenticated, isAdmin, asyncHandler(new ListAllProductsController().handle))
router.get('/:id', validateSchema(productParamsSchema), asyncHandler(new GetProductController().handle))
router.put('/:id', isAuthenticated, isAdmin, validateSchema(updateProductSchema), asyncHandler(new UpdateProductController().handle))
router.patch('/:id/disable', isAuthenticated, isAdmin, validateSchema(productParamsSchema), asyncHandler(new DisableProductController().handle))

export default router