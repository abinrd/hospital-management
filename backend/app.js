import {PORT} from './config/env.js'
import ConnectDataBase from './database/mongodb.js';
import express from 'express'

const app = express();


const StartServer =async()=>{
    try{
        await ConnectDataBase();
        app.listen(PORT,()=>{
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        })
    }catch(error){
        console.log("❌ Database connection failed",error);
        process.exit(1);
    }
}

StartServer();

export default app ;