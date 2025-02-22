import mongoose from "mongoose";
import { DB_URI,NODE_ENV } from "../config/env.js";

if(!DB_URI){
    throw new Error("Please define the DB_URI in .env.<development/production>.local")
}

const ConnectDataBase= async()=>{
    try{
        await mongoose.connect(DB_URI)
        console.log(`Connected to DataBase in ${NODE_ENV} mode`)
    }catch(error){
        console.log('Connection To DataBase failed',error)
        process.exit(1)
    }
}

export default ConnectDataBase;
