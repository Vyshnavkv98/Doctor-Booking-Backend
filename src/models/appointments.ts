import mongoose from "mongoose";
import { IAppointmentInterface } from "./interface";

const appointmentSchema = new mongoose.Schema({

    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    doctor: {
        type:mongoose.Schema.Types.ObjectId,
        ref: 'doctor'
    },
    notes: {
        type:String,
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Cancelled', 'Completed'],
        default: 'Scheduled',
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    reason: {
        type: String
    },
    fee: {
        type: String
    },
    date: {
        type: String
    },
    time: {
        type: String
    },
    isAttended: {
        type: Boolean
    },
    payment: {
        type: String
    },
    prescription: [
        {
            medicine: {
                type: String
            },
            timing: {
                type: String
            }
        }
    ],
    consultationMode:{
        type:String,
        enum:['offline','videocall','text']
    }

}, { timestamps: true })

export const Appointment = mongoose.model<IAppointmentInterface>("appointment", appointmentSchema)