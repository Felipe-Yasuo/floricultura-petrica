import { Router } from 'express'
import { CreateAddressController } from '../controllers/address/CreateAddressController'
import { ListAddressesController } from '../controllers/address/ListAddressesController'
import { UpdateAddressController } from '../controllers/address/UpdateAddressController'
import { DeleteAddressController } from '../controllers/address/DeleteAddressController'
import { createAddressSchema, updateAddressSchema, addressParamsSchema } from '../schemas/addressSchema'
import { validateSchema } from '../middlewares/validateSchema'
import { asyncHandler } from '../middlewares/asyncHandler'
import { isAuthenticated } from '../middlewares/isAuthenticated'

const router = Router()

router.post('/', isAuthenticated, validateSchema(createAddressSchema), asyncHandler(new CreateAddressController().handle))
router.get('/', isAuthenticated, asyncHandler(new ListAddressesController().handle))
router.put('/:id', isAuthenticated, validateSchema(updateAddressSchema), asyncHandler(new UpdateAddressController().handle))
router.delete('/:id', isAuthenticated, validateSchema(addressParamsSchema), asyncHandler(new DeleteAddressController().handle))

export default router