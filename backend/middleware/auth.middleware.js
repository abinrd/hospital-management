import jwt from "jsonwebtoken";
import User from "../models/user.model.js";
import { JWT_SECRET } from "../config/env.js";
import { errorResponse } from "../utils/responseHandler.js";

export const authorize = async (req, res, next) => {
    try {
        let token = req.cookies.token || (req.headers.authorization?.startsWith("Bearer") ? req.headers.authorization.split(" ")[1] : null);

        if (!token) {
            return errorResponse(res, 401, "Unauthorized Access: No token provided");
        }

        if (!JWT_SECRET) {
            return errorResponse(res, 500, "Server error: JWT_SECRET is not set");
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return errorResponse(res, 401, "Unauthorized Access: Invalid or expired token");
        }

        req.user = user; 
        next();
    } catch (error) {
        next(error);
    }
};

export const isAdmin = (req, res, next) => {
    try {
        if (req.user && req.user.role?.toLowerCase() === "admin") {
            next();
        } else {
            return errorResponse(res, 403, "Access denied. Admins only.");
        }
    } catch (error) {
        return errorResponse(res, 500, "An error occurred while checking admin privileges.");
    }
};
