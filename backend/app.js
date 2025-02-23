import {PORT} from './config/env.js'
import ConnectDataBase from './database/mongodb.js';
import authRouter from './routes/auth.route.js';
import express from 'express'

const app = express();
app.use(express.json());
app.use('/api/v1/auth',authRouter)

app.get("/",(req,res)=>{
    res.send("welcome to Hosptital Mangement System")
})


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