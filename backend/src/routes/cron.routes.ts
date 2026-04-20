import { Router } from 'express'
import { asyncHandler } from '../middlewares/asyncHandler'
import { ExpireStaleOrdersController } from '../controllers/order/ExpireStaleOrdersController'

const cronRoutes = Router()

const expireStaleOrdersController = new ExpireStaleOrdersController()

cronRoutes.post(
    '/expire-stale-orders',
    asyncHandler(expireStaleOrdersController.handle)
)

export default cronRoutes