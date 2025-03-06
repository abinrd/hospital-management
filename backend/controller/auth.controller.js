import mongoose from "mongoose";
import crypto from 'crypto';
import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_EXPIRES_IN, JWT_SECRET,FRONTEND_URL } from '../config/env.js';
import {  errorResponse,successResponse} from "../utils/responseHandler.js";
import { sendInviteEmail } from "../utils/emailService.js";


export const register = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, password } = req.body;

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


      /*  if (role === "Admin") {
           return errorResponse(res, 403, "Cannot register as Admin");
        }*/

        // ✅ Just pass the plain password, Mongoose will hash it automatically
        const [newUser] = await User.create([{ name, email, password, role:"Patient" }], { session });


        // ✅ Generate JWT token
        const token = jwt.sign({ userId: newUser._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        newUser.password = undefined;

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

export const inviteDoctor = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { email, name, specialization } = req.body;

        if (!email || !name || !specialization) {
            return errorResponse(res, 400, "Email, name, and specialization are required");
        }
        const existingUser = await User.findOne({ email }).session(session);
        if (existingUser) {
            await session.abortTransaction();
            session.endSession();
            return errorResponse(res, 409, "User with this email already exists");
        }

        const newDoctor = new User({
            email,
            name,
            specialization,
            role: 'Doctor',
            isApproved: false,
            password: crypto.randomBytes(10).toString('hex') // Temporary password
        });
          // Generate an invite token
          const inviteToken = newDoctor.generateInviteToken();
        
          await newDoctor.save({ session });
  
          // Generate invite link
          const inviteLink = `${FRONTEND_URL}/register/doctor?token=${inviteToken}`;
  
          // Send invitation email
          await sendInviteEmail(email, name, inviteLink);
  
          await session.commitTransaction();
          session.endSession();
  
          return successResponse(res, 201, "Doctor invitation sent successfully", {
              doctor: {
                  id: newDoctor._id,
                  name: newDoctor.name,
                  email: newDoctor.email,
                  specialization: newDoctor.specialization
              }
          });
      } catch (error) {
          await session.abortTransaction();
          session.endSession();
          next(error);
      }
  };

    export const verifyDoctorInvite = async (req, res, next) => {
        try {
            const { token } = req.params;
            
            const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
            
            const doctor = await User.findOne({
                inviteToken: token,
                inviteTokenExpires: { $gt: Date.now() }
            });

            if (!doctor) {
                return errorResponse(res, 400, "Invalid or expired token");
            }

            return successResponse(res, 200, "Token verified successfully", {
                email: doctor.email,
                name: doctor.name
            });
        } catch (error) {
            next(error);
        }
    };

// Complete doctor registration
export const completeDoctorRegistration = async (req, res, next) => {
    try {
        const { token, password, contactNumber, availableTimeSlots } = req.body;
        
        if (!token || !password) {
            return errorResponse(res, 400, "Token and password are required");
        }

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
        
        const doctor = await User.findOne({
            inviteToken: token,
            inviteTokenExpires: { $gt: Date.now() }
        });

        if (!doctor) {
            return errorResponse(res, 400, "Invalid or expired token");
        }

        // Update doctor information
        doctor.password = password;
        doctor.contactNumber = contactNumber;
        if (availableTimeSlots) doctor.availableTimeSlots = availableTimeSlots;
        doctor.inviteToken = undefined;
        doctor.inviteTokenExpires = undefined;

        await doctor.save();

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: doctor._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        doctor.password = undefined;

        return successResponse(res, 200, "Doctor registration completed successfully", {
            token: jwtToken,
            user: doctor
        });
    } catch (error) {
        next(error);
    }
};

// Create first admin (initialization)
export const createFirstAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return errorResponse(res, 400, "All fields are required");
        }

        const admin = await User.createFirstAdmin({ name, email, password });
        
        if (!admin) {
            return errorResponse(res, 409, "Admin already exists");
        }

        const token = jwt.sign({ userId: admin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        
        admin.password = undefined;

        return successResponse(res, 201, "First admin created successfully", {
            token,
            user: admin
        });
    } catch (error) {
        next(error);
    }
};

export const approveDoctor = async (req, res) => {
    try {
        const { doctorId } = req.params;

        const doctor = await User.findById(doctorId);

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        if (doctor.role !== 'Doctor') {
            return res.status(400).json({ success: false, message: "User is not a doctor" });
        }

        doctor.isApproved = true;
        await doctor.save();

        res.json({ success: true, message: "Doctor approved successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};