import express from 'express'
const app = express();
import dotenv from 'dotenv';
import cors from 'cors'
import { json } from 'stream/consumers';
import connectDB from './db/connectDB.js';
import userRouter from './routes/userRoute.js';
dotenv.config()
const DBSTRING = process.env.DBSTRING
const DBNAME = process.env.DBNAME
const port = process.env.PORT
// CORS POLICY
app.use(cors())

connectDB(DBSTRING,DBNAME)
//JSON
app.use(express.json())

app.use('/user',userRouter)


app.listen(port ,()=>{
    console.log(`server started at port number ${port}`)
})