import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';


export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, error: "All fields are required" });
        }

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            return res.status(409).json({ success: false, error: "User already exists" });
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }

        // ✅ Just pass the plain password, Mongoose will hash it automatically
        const [newUser] = await User.create([{ name, email, password, role }], { session });

        // ✅ Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        await session.commitTransaction();
        session.endSession();

        return res.status(201).json({
            success: true,
            message: "User has been successfully registered",
            data: {
                token,
                user: newUser,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        next(error);
    }
};

export const login=async(req,res,next)=>{

    try{
        const{email,password}=req.body;
        const user = await User.findOne({email})

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const token= jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        return res.status(200).json({
            success:true,
            message:'User Signed-in succesfully',
            data:{
                token,
                user,
            }})


    }catch(error){
        next(error);
    }

}
