import { Router } from 'express'
import userRoutes from './user.routes'
import categoryRoutes from './category.routes'
import productRoutes from './product.routes'
import productImageRoutes from './productImage.routes'
import cartRoutes from './cart.routes'
import orderRoutes from './order.routes'
import addressRoutes from './address.routes'
import uploadRoutes from './upload.routes'
import cronRoutes from './cron.routes'

const router = Router()

router.use('/users', userRoutes)
router.use('/categories', categoryRoutes)
router.use('/products', productRoutes)
router.use('/product-images', productImageRoutes)
router.use('/cart', cartRoutes)
router.use('/orders', orderRoutes)
router.use('/addresses', addressRoutes)
router.use('/upload', uploadRoutes)
router.use('/cron', cronRoutes)

export default router