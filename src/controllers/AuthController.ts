import { Request, Response } from "express";
import User from "../models/User";
import Supplier from "../models/Supplier";
import Product from "../models/Products";
import WareHouse from "../models/Warehouse";


export class AuthController {

    static createUser = async (req : Request, res : Response) => {
        const user = new User(req.body)
        try {
            await user.save()
            res.send('Usuario Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static createSupplier = async (req : Request, res : Response) => {
        
        const supplier = new Supplier(req.body)

        try {
            await supplier.save()
            res.send('Provedor Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
    }

    static createProduct = async (req : Request, res : Response) => {
        const product = new Product(req.body)
        try {
            await product.save()
            res.send('Producto Creado Correctamente')
        } catch (error) {
            console.log(error)
        }
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

    static getUsers = async (req : Request, res : Response) => {
        res.send('Todos los usuarios')
    }
}