import mongoose, { Schema, Document } from "mongoose";

const userRole = {
    ADMIN: 'admin',
    MANAGER: 'manager',
    STAFF: 'staff'
} as const

export type UserRole = typeof userRole[keyof typeof userRole]

export interface IUser extends Document {
    name: string
    email: string
    password: string
    role: UserRole
}

const userSchema : Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: Object.values(userRole),
        default: userRole.STAFF
    }
})

const User = mongoose.model<IUser>('User', userSchema)
export default User