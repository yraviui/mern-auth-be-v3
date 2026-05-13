import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'is invalid']
    },

    password: { type: String, required: true, select: false },

    role: {
        type: String,
        enum: ['user', 'admin', 'customercare'],
        default: 'user'
    },

    emailOtp: { type: String, select: false },
    emailOtpExpiry: { type: Date, select: false },
    emailOtpVerified: { type: Boolean, default: false },

    // ✅ ADD THESE
    resetPasswordOtp: { type: String, select: false },
    resetPasswordExpiry: { type: Date, select: false },

    // ✅ ADD THIS
    refreshToken: { type: String, select: false },

}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;