import { Router } from 'express'
import { AuthUserController } from '../controllers/user/AuthUserController'
import { AuthWithGoogleController } from '../controllers/user/AuthWithGoogleController'
import { CreateUserController } from '../controllers/user/CreateUserController'
import { authUserSchema, authWithGoogleSchema, createUserSchema } from '../schemas/userSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'

const router = Router()

router.post('/', validateSchema(createUserSchema), asyncHandler(new CreateUserController().handle))
router.post('/session', validateSchema(authUserSchema), asyncHandler(new AuthUserController().handle))
router.post('/session/google', validateSchema(authWithGoogleSchema), asyncHandler(new AuthWithGoogleController().handle))

export default router