import mongoose from "mongoose";


const appointmentSchema = mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    timeSlot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["Pending", "Accepted", "Declined", "Rescheduled"],
        default: "Pending",
    },
    reason: {
        type: String,
        required: false,
    },
    rescheduledDate: {
        type: Date,
        required: false,
    },
    rescheduledTimeSlot: {
        type: String,
        required: false,
    },
},
{ timestamps: true }
);

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;