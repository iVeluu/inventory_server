import { Router } from "express";
import { body, param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { WarehouseController } from "../controllers/WarehouseController";


const router = Router()

router.get('/:warehouseId', 
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    WarehouseController.getFullInformationWarehouse
)

router.get('/:warehouseId/products', 
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    WarehouseController.getFullProductsWarehouse
)

router.post('/', 
    body('name')
        .notEmpty().withMessage('El Nombre del Almacen es Obligatorio'),
    body('location')
        .notEmpty().withMessage('La Ubicación del Almacen es Obligatoria'),
    body('manager_id')
        .isMongoId().withMessage('ID no válido'),
    handleInputErrors,
    WarehouseController.createWarehouse
)


router.post('/:warehouseId/add/product',
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    body('product_id')
        .isMongoId().withMessage('ID de producto no valido'),
    body('quantity')
        .notEmpty().withMessage('La Cantidad del producto es Obligatoria'),
    handleInputErrors,
    WarehouseController.addProductToWarehouse
)

router.patch('/:warehouseId/edit/info',
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    body('name')
        .notEmpty().withMessage('El Nombre del Almacen es Obligatorio'),
    body('location')
        .notEmpty().withMessage('La Ubicación del Almacen es Obligatoria'),
    handleInputErrors,
    WarehouseController.editWarehouseInfo
)

router.post('/:warehouseId/transfer/product/:targetWarehouseId',
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    param('targetWarehouseId')
        .isMongoId().withMessage('ID no válido'),
    body('product_id')
        .isMongoId().withMessage('ID de producto no valido'),
    body('quantity')
        .notEmpty().withMessage('La Cantidad del producto es Obligatoria'),
    handleInputErrors,
    WarehouseController.transferProducts
)

router.delete('/:warehouseId/products/:productId',
    param('warehouseId')
        .isMongoId().withMessage('ID no válido'),
    param('productId')
        .isMongoId().withMessage('ID de Producto no válido'),
    handleInputErrors,
    WarehouseController.discardProductsOfTheWarehouse
)

export default router