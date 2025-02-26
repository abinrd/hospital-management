import User from "../models/user.model.js";
import { errorResponse,successResponse } from "../utils/responseHandler.js";

// Get Logged-in User Profile
export const getUserProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select("-password"); // Exclude password
        if (!user) return errorResponse(res, 404, "User not found");
        return successResponse(res, 200, "User profile retrieved", user);
    } catch (error) {
        next(error);
    }
};

// Update User Profile
export const updateUserProfile = async (req, res, next) => {
    try {
        const { name, email } = req.body;
        const user = await User.findById(req.user.id);

        if (!user) return errorResponse(res, 404, "User not found");

        user.name = name || user.name;
        user.email = email || user.email;

        await user.save();
        return successResponse(res, 200, "User profile updated", user);
    } catch (error) {
        next(error);
    }
};

// Get All Users (Admin Only)
export const getAllUsers = async (req, res, next) => {
    try {
        const users = await User.find().select("-password");
        return successResponse(res, 200, "All users retrieved", users);
    } catch (error) {
        next(error);
    }
};

// Delete a User (Admin Only)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) return errorResponse(res, 404, "User not found");

        await user.deleteOne();
        return successResponse(res, 200, "User deleted successfully");
    } catch (error) {
        next(error);
    }
};

export const approveDoctor = async (req, res, next) => {
    try {
        const { doctorId } = req.params;
        
        const doctor = await User.findById(doctorId);
        
        if (!doctor) {
            return errorResponse(res, 404, "Doctor not found");
        }
        
        if (doctor.role !== 'Doctor') {
            return errorResponse(res, 400, "User is not a doctor");
        }
        
        doctor.isApproved = true;
        await doctor.save();
        
        return successResponse(res, 200, "Doctor approved successfully", { doctor });
    } catch (error) {
        next(error);
    }
};

// Promote user to Admin (Admin only)
export const promoteToAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        
        const user = await User.findById(userId);
        
        if (!user) {
            return errorResponse(res, 404, "User not found");
        }
        
        user.role = 'Admin';
        user.isApproved = true;
        await user.save();
        
        return successResponse(res, 200, "User promoted to Admin successfully", { user });
    } catch (error) {
        next(error);
    }
};

// Get all pending doctors (Admin only)
export const getPendingDoctors = async (req, res, next) => {
    try {
        const doctors = await User.find({ 
            role: 'Doctor',
            isApproved: false
        }).select("-password");
        
        return successResponse(res, 200, "Pending doctors retrieved successfully", { doctors });
    } catch (error) {
        next(error);
    }
};

// Get all approved doctors (For patients to book appointments)
export const getApprovedDoctors = async (req, res, next) => {
    try {
        const doctors = await User.find({ 
            role: 'Doctor',
            isApproved: true
        }).select("-password -inviteToken -inviteTokenExpires");
        
        return successResponse(res, 200, "Approved doctors retrieved successfully", { doctors });
    } catch (error) {
        next(error);
    }
};
