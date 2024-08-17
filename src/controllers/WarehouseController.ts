import { Request, Response } from "express";
import WareHouse from "../models/Warehouse";
import Product from "../models/Products";

export class WarehouseController {

    static getFullInformationWarehouse = async (req : Request, res : Response) => {
        const { warehouseId } = req.params
        const warehouse = await WareHouse.findById(warehouseId)
            .populate('products.product_id')

        if(!warehouse){
            const error = new Error('Almacen No Encontrado')
            return res.status(404).json({error: error.message})
        }
        res.status(200).json({warehouse})
    }

    static getFullProductsWarehouse = async (req : Request, res : Response) => {
        const { warehouseId } = req.params
        const warehouse = await WareHouse.findById(warehouseId)
            .select('products')
            .populate('products.product_id')
            
        if(!warehouse){
            const error = new Error('Almacen No Encontrado')
            return res.status(404).json({error: error.message})
        }
        res.status(200).json({warehouse})
    }

    static createWarehouse = async (req : Request, res : Response) => {
        const warehouse = new WareHouse(req.body)
        try {
            await warehouse.save()
            res.send('Warehouse Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static addProductToWarehouse = async (req : Request, res : Response) => {
        const { product_id, quantity } = (req.body)
        const { warehouseId } = req.params
        const product = await Product.findById(product_id)
        if(!product){
            const error = new Error('Producto No Encontrado')
            return res.status(404).json({error: error.message})
        }
        const warehouse = await WareHouse.findById(warehouseId)
        if(warehouse.products.find(product => product.product_id.toString() === product_id)){
            const error = new Error('Este Producto ya se encuentra dentro del Almacen')
            return res.status(409).json({error: error.message})
        }
        const productToAdd = {
            product_id: product_id,
            quantity,
        }
        warehouse.products.push(productToAdd)
        try {
            await warehouse.save()
            res.send('Producto agregado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static editWarehouseInfo = async (req : Request, res : Response) => {
        const { name, location } = (req.body)
        const { warehouseId } = req.params
        const warehouse = await WareHouse.findById(warehouseId)
        try {
            warehouse.name = name
            warehouse.location = location
            await warehouse.save()
            res.send('Información Actualizada Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static discardProductsOfTheWarehouse = async (req : Request, res : Response) => {
        const { warehouseId, productId } = req.params
        const warehouse = await WareHouse.findById(warehouseId)
        warehouse.products = warehouse.products.filter( product => product.product_id.toString() !== productId )
        try {
            await warehouse.save()
            res.send('Producto Descartado Correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static transferProducts = async (req: Request, res: Response) => {
        const { warehouseId, targetWarehouseId } = req.params;
        const { quantity, product_id } = req.body

        const warehouse = await WareHouse.findById(warehouseId);
        const targetWarehouse = await WareHouse.findById(targetWarehouseId);

        if (!warehouse || !targetWarehouse) {
            return res.status(404).json({ message: 'Uno o Ambos almacenes no fueron encontrados' });
        }

        const sourceProductIndex = warehouse.products.findIndex(p => p.product_id.toString() === product_id);
        if (sourceProductIndex === -1) {
            return res.status(400).json({ message: `El Producto con el ID ${product_id} no fue encontrado en el almacen de origen` });
        }

        const sourceProduct = warehouse.products[sourceProductIndex]

        if(sourceProduct.quantity < quantity){
            return res.status(400).json({error: 'La Cantidad a transeferir es mayor a la cantidad actual de stock'})
        }

        sourceProduct.quantity -= quantity

        if(sourceProduct.quantity === 0){
            warehouse.products.splice(sourceProductIndex, 1)
        }

        const targetProductIndex = targetWarehouse.products.findIndex(p => p.product_id.toString() === product_id)
        if(targetProductIndex !== -1){
            targetWarehouse.products[targetProductIndex].quantity += quantity
        } else {
            targetWarehouse.products.push({ product_id, quantity });
        }



        try {
            await Promise.allSettled([warehouse.save(), targetWarehouse.save()])
            res.send('Producto transferido correctamente')
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }

    
    }



}

const das = async (req: Request, res: Response) => {
    const { sourceWarehouseId, targetWarehouseId } = req.params;
    const { products } = req.body; // products es un arreglo de objetos { product_id, quantity }

    try {
        // Encontrar los almacenes de origen y destino
        const sourceWarehouse = await WareHouse.findById(sourceWarehouseId);
        const targetWarehouse = await WareHouse.findById(targetWarehouseId);

        if (!sourceWarehouse || !targetWarehouse) {
            return res.status(404).json({ message: 'One or both warehouses not found' });
        }

        // Iterar sobre los productos a transferir
        for (const product of products) {
            const { product_id, quantity } = product;

            // Encontrar el producto en el almacén de origen
            const sourceProductIndex = sourceWarehouse.products.findIndex(p => p.product_id.toString() === product_id);
            if (sourceProductIndex === -1) {
                return res.status(400).json({ message: `Product with ID ${product_id} not found in source warehouse` });
            }

            const sourceProduct = sourceWarehouse.products[sourceProductIndex];

            if (sourceProduct.quantity < quantity) {
                return res.status(400).json({ message: `Not enough quantity of product with ID ${product_id} in source warehouse` });
            }

            // Restar la cantidad del almacén de origen
            sourceProduct.quantity -= quantity;

            // Si la cantidad llega a 0, eliminar el producto del almacén de origen
            if (sourceProduct.quantity === 0) {
                sourceWarehouse.products.splice(sourceProductIndex, 1);
            }

            // Buscar si el producto ya existe en el almacén de destino
            const targetProductIndex = targetWarehouse.products.findIndex(p => p.product_id.toString() === product_id);
            if (targetProductIndex !== -1) {
                // Si existe, incrementar la cantidad en el almacén de destino
                targetWarehouse.products[targetProductIndex].quantity += quantity;
            } else {
                // Si no existe, agregar el producto al almacén de destino
                targetWarehouse.products.push({ product_id, quantity });
            }
        }

        // Guardar los cambios en ambos almacenes
        await sourceWarehouse.save();
        await targetWarehouse.save();

        res.status(200).json({ message: 'Products transferred successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
}
