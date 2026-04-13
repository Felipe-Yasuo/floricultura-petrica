import { Router } from 'express'
import { CreateOrderController } from '../controllers/order/CreateOrderController'
import { ListOrdersController } from '../controllers/order/ListOrdersController'
import { GetOrderController } from '../controllers/order/GetOrderController'
import { UpdateOrderStatusController } from '../controllers/order/UpdateOrderStatusController'
import { CancelOrderController } from '../controllers/order/CancelOrderController'
import { createOrderSchema, updateOrderStatusSchema, orderParamsSchema } from '../schemas/orderSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/', isAuthenticated, validateSchema(createOrderSchema), asyncHandler(new CreateOrderController().handle))
router.get('/', isAuthenticated, asyncHandler(new ListOrdersController().handle))
router.get('/:id', isAuthenticated, validateSchema(orderParamsSchema), asyncHandler(new GetOrderController().handle))
router.patch('/:id/status', isAuthenticated, isAdmin, validateSchema(updateOrderStatusSchema), asyncHandler(new UpdateOrderStatusController().handle))
router.patch('/:id/cancel', isAuthenticated, validateSchema(orderParamsSchema), asyncHandler(new CancelOrderController().handle))

export default router