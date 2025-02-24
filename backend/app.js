import {PORT} from './config/env.js'
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import cookieParser from "cookie-parser";

import rateLimit from 'express-rate-limit';
import ConnectDataBase from './database/mongodb.js';
import authRouter from './routes/auth.route.js';
import appointmentRouter from './routes/appointment.route.js';
import express from 'express'


const app = express();

app.use(cors())
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

app.use('/api/v1/auth',authRouter)
app.use('/api/v1/book',appointmentRouter)

app.get("/",(req,res)=>{
    res.send("welcome to Hosptital Mangement System")
})

app.use((err, req, res, next) => {
    console.error("❌ Error:", err.message);
    res.status(err.status || 500).json({ message: err.message || "Internal Server Error" });
});

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