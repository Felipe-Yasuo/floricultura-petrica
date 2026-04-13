import { Router } from 'express'
import { AddCartItemController } from '../controllers/cart/AddCartItemController'
import { GetCartController } from '../controllers/cart/GetCartController'
import { UpdateCartItemController } from '../controllers/cart/UpdateCartItemController'
import { RemoveCartItemController } from '../controllers/cart/RemoveCartItemController'
import { ClearCartController } from '../controllers/cart/ClearCartController'
import { addCartItemSchema, updateCartItemSchema, cartItemParamsSchema } from '../schemas/cartSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.post('/items', isAuthenticated, validateSchema(addCartItemSchema), asyncHandler(new AddCartItemController().handle))
router.get('/', isAuthenticated, asyncHandler(new GetCartController().handle))
router.patch('/items/:id', isAuthenticated, validateSchema(updateCartItemSchema), asyncHandler(new UpdateCartItemController().handle))
router.delete('/items/:id', isAuthenticated, validateSchema(cartItemParamsSchema), asyncHandler(new RemoveCartItemController().handle))
router.delete('/', isAuthenticated, asyncHandler(new ClearCartController().handle))

export default router