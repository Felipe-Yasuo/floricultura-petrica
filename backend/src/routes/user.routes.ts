import { Router } from 'express'
import { AuthUserController } from '../controllers/user/AuthUserController'
import { CreateUserController } from '../controllers/user/CreateUserController'
import { authUserSchema, createUserSchema } from '../schemas/userSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'

const router = Router()

router.post('/', validateSchema(createUserSchema), asyncHandler(new CreateUserController().handle))
router.post('/session', validateSchema(authUserSchema), asyncHandler(new AuthUserController().handle))

export default router