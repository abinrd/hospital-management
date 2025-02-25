import { Router } from "express";
import { getUserProfile,updateUserProfile,getAllUsers,deleteUser } from "../controller/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
import roleAuthorize from "../middleware/role.middleware.js";

const userRouter = Router();

// Get logged-in user's profile (Patients & Doctors)
userRouter.get("/profile", authorize, getUserProfile);

// Update logged-in user's profile (Patients & Doctors)
userRouter.put("/profile", authorize, updateUserProfile);

// Get all users (Admin only)
userRouter.get("/", authorize, roleAuthorize(["admin"]), getAllUsers);

// Delete a user (Admin only)
userRouter.delete("/:id", authorize, roleAuthorize(["admin"]), deleteUser);

export default userRouter;
