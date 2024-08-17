import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import { body } from "express-validator";
import { handleInputErrors } from "../middleware/validation";


const router = Router()

router.post('/',
    body('email')
        .notEmpty().withMessage('El Email es Obligatorio'),
    body('name')
        .notEmpty().withMessage('El Nombre es Obligatorio'),
    body('password')
        .notEmpty().withMessage('La Contraseña es Obligatoria'),
    handleInputErrors,
    AuthController.createUser
)

router.get('/', AuthController.getUsers)
router.post('/supplier', AuthController.createSupplier) //ERROR SKU UNIQUE


export default router