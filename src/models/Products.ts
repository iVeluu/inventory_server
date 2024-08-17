import mongoose, { Schema, Document, Types } from "mongoose";

export interface IProducts extends Document {
    name: string
    description: string
    category: string
    sku: string
    price: number
    supplier_id: Types.ObjectId
}

const productSchema : Schema = new Schema({
    name: {
        type: String,
        required: true, 
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    sku: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    supplier_id: {
        type: Types.ObjectId,
        ref: 'Supplier'
    }
})

const Product = mongoose.model<IProducts>('Product', productSchema)
export default Product