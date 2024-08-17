import { Request, Response } from "express";
import mongoose from 'mongoose';

import Product from "../models/Products";
import Supplier from "../models/Supplier";

type verifySKU = {
    sku: string
}

export class ProductController {

    static getProductInfo = async (req : Request, res : Response) => {
        const { productId } = req.params
        const product = await Product.findById(productId)
            .populate('supplier_id')
        if(!product){
            return res.status(404).json({error: 'Producto No Encontrado'})
        }
        res.json(product)
    }

    static getSupplierProducts = async (req : Request, res : Response) => {
        const { supplierId } = req.params
        const products = await Product.find({ supplier_id: supplierId})
        if(!products){
            return res.status(404).json({error: 'No se Encontraron Productos de este Proveedor'})
        }
        try {
            res.json(products)
        } catch (error) {
            res.status(500).json({error: 'Hubo un error'})
        }
    }

    static createProduct = async (req: Request, res: Response) => {
        const { name, description, category, sku, price, supplier_id } = req.body;
        
        const supplier = await Supplier.findById(supplier_id)
            .select('products_supplied')
            .populate({
                path: 'products_supplied',
                select: 'name sku' 
            });

        if (!supplier) {
            return res.status(404).json({ error: 'Proveedor No Encontrado' });
        }

        const existingProduct = await Product.findOne({ sku, supplier_id });

        if (existingProduct) {
            return res.status(400).json({ error: 'Ya existe un producto con el mismo SKU en este proveedor' });
        }

        const product = new Product(req.body)
        supplier.products_supplied.push(product.id)

        try {
            await Promise.allSettled([product.save(), supplier.save()])
            res.send('Producto Creado Correctamente')
        } catch (error) {
            
        }
    };  



}