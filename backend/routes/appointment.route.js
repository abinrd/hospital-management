import {Router} from "express";
import { authorize,isAdmin } from "../middleware/auth.middleware.js";
import { createAppointment, getAppointments,getAppointmentById,updateAppointmentStatus,deleteAppointment } from "../controller/appointment.controller.js";

const appointmentRouter = Router();

// Create a new appointment (Only authorized users)
appointmentRouter.post("/", authorize, createAppointment);

// Get all appointments (Only admin can access)
appointmentRouter.get("/", authorize, isAdmin, getAppointments);

// Get a single appointment by ID (Authorized user)
appointmentRouter.get("/:id", authorize, getAppointmentById);

// Update appointment status (Doctor only)
appointmentRouter.put("/:id/status", authorize, updateAppointmentStatus);

// Delete an appointment (Admin only)
appointmentRouter.delete("/:id", authorize, isAdmin, deleteAppointment);

export default appointmentRouter;
