import mongoose from "mongoose";

const PatientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    purpose_of_visit: { type: String, required: true },
    email: { type: String },
    phone: { type: Number, required: true },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { timestamps: true });

const PatientModel = mongoose.model("patients", PatientSchema);

export default PatientModel;