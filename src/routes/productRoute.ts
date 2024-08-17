import { Router } from 'express'
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { ProductController } from '../controllers/ProductController';


const router = Router()

router.get('/:productId', 
    param('productId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProductController.getProductInfo
)

router.get('/supplier/:supplierId', 
    param('supplierId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    ProductController.getSupplierProducts
)

router.post('/create', 
    body('name')
        .notEmpty().withMessage('El nombre del producto es obligatorio'),
    body('description')
        .notEmpty().withMessage('La descripción del producto es obligatorio'),
    body('category')
        .notEmpty().withMessage('La categoria del producto es obligatorio'),
    body('sku')
        .notEmpty().withMessage('El SKU del producto es obligatorio'),
    body('price')
        .notEmpty().withMessage('El precio del producto es obligatorio'),
    body('supplier_id')
        .isMongoId().withMessage('ID de proveedor no válido'),
    handleInputErrors,
    ProductController.createProduct
)

export default router