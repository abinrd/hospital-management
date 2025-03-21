import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import roleAuthorize from "../middleware/role.middleware.js";
import {createAppointment,getAppointments, getAppointmentById, updateAppointmentStatus, deleteAppointment,getMyAppointments} from "../controller/appointment.controller.js";

const appointmentRouter = Router();


appointmentRouter.post("/", authorize, createAppointment) // Create a new appointment (Only authorized users)
appointmentRouter.get("/", authorize, roleAuthorize(["admin"]), getAppointments);// Get all appointments (Only admin can access)
appointmentRouter.get("/:id", authorize, getAppointmentById);// Get a single appointment by ID (Authorized user)
appointmentRouter.get('/my-appointments', authorize, getMyAppointments);
appointmentRouter.put("/:id/status", authorize, roleAuthorize(["doctor","admin"]), updateAppointmentStatus);// Update appointment status (Doctor only)
appointmentRouter.delete("/:id", authorize, roleAuthorize(["admin"]), deleteAppointment);// Delete an appointment (Admin only)

export default appointmentRouter;
