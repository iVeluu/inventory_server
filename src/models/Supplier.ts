import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISupplier extends Document {
    name: string
    contact_info: {
        phone: string,
        email: string,
        address: string
    }
    products_supplied: Types.ObjectId[]
}

const supplierSchema : Schema = new Schema({
    name: {
        type: String,
        required: true,
    },
    contact_info: {
        phone: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        }
    },
    products_supplied: [
        {
            type: Types.ObjectId,
            ref: 'Product', 
        }
    ]
})

const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema)
export default Supplier