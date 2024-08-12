import { Router } from "express";
import { AuthController } from "../controllers/AuthController";


const router = Router()

router.post('/', AuthController.createUser)
router.post('/supplier', AuthController.createSupplier)
router.post('/product', AuthController.createProduct)
router.post('/warehouse', AuthController.createWarehouse)
router.get('/', AuthController.getUsers)

export default router