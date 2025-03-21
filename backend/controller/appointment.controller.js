import Appointment from "../models/appointment.model.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// ✅ Create a new appointment
export const createAppointment = async (req, res, next) => {

    console.log("Received request body:", req.body);
    console.log("User data:", req.user);
    
    try {
        const { doctor, date, timeSlot, reason } = req.body;

if (!doctor || !date || !timeSlot) {
    return errorResponse(res, 400, "All fields are required");
}

const appointment = new Appointment({
    patient: req.user._id, 
    doctor, 
    date: new Date(date), 
    timeSlot, 
    reason,
    status: "Pending",
});

        await appointment.save();
        return successResponse(res, 201, "Appointment created successfully", { appointment });

    } catch (error) {
        next(error);
    }
};

// ✅ Get all appointments (Admin only)
export const getAppointments = async (req, res, next) => {
    try {
        const appointments = await Appointment.find().populate("patientId doctorId", "name email");
        return successResponse(res, 200, "Appointments retrieved successfully", { appointments });

    } catch (error) {
        next(error);
    }
};

// ✅ Get an appointment by ID
export const getAppointmentById = async (req, res, next) => {
    try {
        const appointment = await Appointment.findById(req.params.id).populate("patientId doctorId", "name email");

        if (!appointment) {
            return errorResponse(res, 404, "Appointment not found");
        }

        return successResponse(res, 200, "Appointment retrieved successfully", { appointment });

    } catch (error) {
        next(error);
    }
};

// ✅ Update appointment status (Doctor can accept, decline, or reschedule)
export const updateAppointmentStatus = async (req, res, next) => {
    try {
        const { status } = req.body;

        if (!["Accepted", "Declined", "Rescheduled"].includes(status)) {
            return errorResponse(res, 400, "Invalid status value");
        }

        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return errorResponse(res, 404, "Appointment not found");
        }

        appointment.status = status;
        await appointment.save();

        return successResponse(res, 200, "Appointment status updated successfully", { appointment });

    } catch (error) {
        next(error);
    }
};

// ✅ Delete an appointment (Admin only)
export const deleteAppointment = async (req, res, next) => {
    try {
        const appointment = await Appointment.findByIdAndDelete(req.params.id);

        if (!appointment) {
            return errorResponse(res, 404, "Appointment not found");
        }

        return successResponse(res, 200, "Appointment deleted successfully");

    } catch (error) {
        next(error);
    }
};

export const getMyAppointments = async (req, res, next) => {
    try {
        let appointments;
        
        if (req.user.role === 'Patient') {
            appointments = await Appointment.find({ patient: req.user._id })
                .populate('doctor', 'name specialization');
        } else if (req.user.role === 'Doctor') {
            appointments = await Appointment.find({ doctor: req.user._id })
                .populate('patient', 'name');
        } else {
            return errorResponse(res, 403, "Unauthorized to view appointments");
        }
        
        return successResponse(res, 200, "Appointments retrieved successfully", { appointments });
    } catch (error) {
        next(error);
    }
};
