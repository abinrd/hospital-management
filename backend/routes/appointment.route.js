import { Router } from "express";
import { authorize } from "../middleware/auth.middleware.js";
import roleAuthorize from "../middleware/role.middleware.js";
import {createAppointment,getAppointments, getAppointmentById, updateAppointmentStatus, deleteAppointment,} from "../controller/appointment.controller.js";

const appointmentRouter = Router();

// Create a new appointment (Only authorized users)
appointmentRouter.post("/", authorize, createAppointment);

// Get all appointments (Only admin can access)
appointmentRouter.get("/", authorize, roleAuthorize(["admin"]), getAppointments);

// Get a single appointment by ID (Authorized user)
appointmentRouter.get("/:id", authorize, getAppointmentById);

// Update appointment status (Doctor only)
appointmentRouter.put("/:id/status", authorize, roleAuthorize(["doctor"]), updateAppointmentStatus);

// Delete an appointment (Admin only)
appointmentRouter.delete("/:id", authorize, roleAuthorize(["admin"]), deleteAppointment);

export default appointmentRouter;
