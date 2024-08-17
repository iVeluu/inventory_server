import express from 'express'
import dotenv from 'dotenv'
import { connectDB } from './config/db'
import authRoutes from './routes/authRoutes'
import warehouseRouter from './routes/warehouseRoute'
import productRouter from './routes/productRoute'

dotenv.config()

connectDB()

const app = express()

//Habilitar el leido de json
app.use(express.json())

//Routes
app.use('/api/auth', authRoutes)
app.use('/api/warehouse', warehouseRouter)
app.use('/api/products', productRouter)

export default app