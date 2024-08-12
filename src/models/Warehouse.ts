import mongoose, { Schema, Document, Types } from "mongoose";

export interface IWarehouse extends Document {
    name: string
    location: string
    manager_id: Types.ObjectId
    products: {
        product_id: Types.ObjectId,
        quantity: number,
        reorder_level: number
    }[]
}

const wareHouseSchema : Schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true
    },
    manager_id: {
        type: Types.ObjectId,
        required: true
    },
    products: [
        {
            product_id: {
                type: Types.ObjectId,
                ref: 'Product'
            },
            quantity: {
                type: Number,
                required: true
            },
            reorder_level : {
                type: Number,
                required: true
            }
        }
    ]
}) 

const WareHouse = mongoose.model<IWarehouse>('WareHouse', wareHouseSchema)
export default WareHouse