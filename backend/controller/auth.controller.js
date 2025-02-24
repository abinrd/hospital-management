import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET } from '../config/env.js';
import { successResponse, errorResponse } from "../utils/responseHandler.js";


export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 400, "All fields are required");
        }

        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 409, "User already exists");
        }

        if (!JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables.");
        }


        if (role === "Admin") {
            return errorResponse(res, 403, "Cannot register as Admin");
        }

        // ✅ Just pass the plain password, Mongoose will hash it automatically
        const [newUser] = await User.create([{ name, email, password, role }], { session });


        // ✅ Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        newUser.password = undefined;

        await session.commitTransaction();
        session.endSession();

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: JWT_EXPIRES_IN * 1000,
        });

        return successResponse(res, 201, "User has been successfully registered", { user: newUser });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession(); // Ensure session is always closed
    }
};

export const login=async(req,res,next)=>{

    try{
        const{email,password}=req.body;
        const user = await User.findOne({email})

        if (!user || !(await user.matchPassword(password))) {
            return errorResponse(res, 401, "Invalid email or password");
        }

        const token= jwt.sign({userId:user._id},JWT_SECRET,{expiresIn:JWT_EXPIRES_IN});

        user.password = undefined;

       res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: JWT_EXPIRES_IN * 1000,
        });

        return successResponse(res, 200, "User signed in successfully", { user });


    }catch(error){
        next(error);
    }

}
