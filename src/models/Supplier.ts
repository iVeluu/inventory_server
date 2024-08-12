import mongoose, { Schema, Document, Types } from "mongoose";

export interface ISupplier extends Document {
    name: string
    contact_info: {
        phone: string,
        email: string,
        address: string
    }
    products_supplied: {
        product_id: Types.ObjectId
    }[]
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
            product_id: {
                type: Schema.Types.ObjectId,
                ref: 'Product', 
                default: null
            },
        }
    ]
})

const Supplier = mongoose.model<ISupplier>('Supplier', supplierSchema)
export default Supplier