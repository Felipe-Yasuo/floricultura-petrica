import { Router } from 'express'
import { CreateCategoryController } from '../controllers/category/CreateCategoryController'
import { ListCategoriesController } from '../controllers/category/ListCategoriesController'
import { ListAllCategoriesController } from '../controllers/category/ListAllCategoriesController'
import { UpdateCategoryController } from '../controllers/category/UpdateCategoryController'
import { DisableCategoryController } from '../controllers/category/DisableCategoryController'
import { createCategorySchema, updateCategorySchema, categoryParamsSchema } from '../schemas/categorySchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'
import { isAdmin } from '../middlewares/isAdmin'

const router = Router()

router.post('/', isAuthenticated, isAdmin, validateSchema(createCategorySchema), asyncHandler(new CreateCategoryController().handle))
router.get('/', asyncHandler(new ListCategoriesController().handle))
router.get('/all', isAuthenticated, isAdmin, asyncHandler(new ListAllCategoriesController().handle))
router.put('/:id', isAuthenticated, isAdmin, validateSchema(updateCategorySchema), asyncHandler(new UpdateCategoryController().handle))
router.patch('/:id/disable', isAuthenticated, isAdmin, validateSchema(categoryParamsSchema), asyncHandler(new DisableCategoryController().handle))

export default router