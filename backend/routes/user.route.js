import { Router } from "express";
import { getUserProfile,updateUserProfile,getAllUsers,deleteUser,approveDoctor,promoteToAdmin,getPendingDoctors,getApprovedDoctors } from "../controller/user.controller.js";
import { authorize } from "../middleware/auth.middleware.js";
import roleAuthorize from "../middleware/role.middleware.js";

const userRouter = Router();


userRouter.get("/profile", authorize, getUserProfile);// Get logged-in user's profile (Patients & Doctors)
userRouter.put("/profile", authorize, updateUserProfile);// Update logged-in user's profile (Patients & Doctors)
userRouter.get("/", authorize, roleAuthorize(["Admin"]), getAllUsers);// Get all users (Admin only)
userRouter.delete("/:id", authorize, roleAuthorize(["Admin"]), deleteUser);// Delete a user (Admin only)
userRouter.patch('/approve-doctor/:doctorId', authorize, roleAuthorize(['Admin']), approveDoctor);
userRouter.patch('/promote-to-admin/:userId', authorize, roleAuthorize(['Admin']), promoteToAdmin);
userRouter.get('/pending-doctors', authorize, roleAuthorize(['Admin']), getPendingDoctors);
userRouter.get('/approved-doctors', authorize, getApprovedDoctors);

export default userRouter;
