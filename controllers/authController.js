import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import UserModel from "../models/users.js";
import crypto from 'crypto'; // Move to top
import transporter from "../utils/mailer.js";
import JWT from 'jsonwebtoken';

// Helper for hashing OTP
const hashOtp = (otp) => crypto.createHash('sha256').update(otp).digest('hex');

export const registerController = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 1. Validation
        if (!name || !email || !password) {
            return res.status(400).send({ message: 'All fields are required' });
        }

        const normalizedEmail = email.toLowerCase();

        // 2. Check existing user
        const existingUser = await UserModel.findOne({ email: normalizedEmail });
        if (existingUser) {
            return res.status(400).send({ message: 'Email already registered' });
        }

        // 3. Prepare security data
        const hashedPassword = await hashPassword(password);
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new UserModel({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            emailOtp: hashOtp(otp),
            emailOtpExpiry: Date.now() + 10 * 60 * 1000,
            isVerified: false // Added this flag
        });

        await newUser.save();

        transporter.verify((error, success) => {
            if (error) {
                console.error("SMTP Error:", error);
            } else {
                console.log("SMTP is ready");
            }
        });

        // 4. Send Email
        try {
            await transporter.sendMail({
                from: `"My App" <${process.env.EMAIL_USER}>`,
                to: normalizedEmail,
                subject: 'Verify your account',
                text: `Your verification code is: ${otp}`
            });
        } catch (err) {
            console.error("Email Error FULL:", err);
            return res.status(500).send({
                success: false,
                message: "Failed to send OTP email",
                error: err.message // 👈 ADD THIS
            });
        }

        res.status(201).send({
            success: true,
            message: 'Registration successful! Please check your email for the OTP.',
        });

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

export const verifyEmailController = async (req, res) => {
    try {
        const { email, emailOtp } = req.body;

        if (!email) return res.status(400).send({ message: 'Email is required' });
        if (!emailOtp) return res.status(400).send({ message: 'emailOtp is required' });

        const cleanOtp = String(emailOtp).trim();

        const hashedOtp = crypto
            .createHash('sha256')
            .update(cleanOtp)
            .digest('hex');

        const user = await UserModel
            .findOne({ email: email.toLowerCase() })
            .select('+emailOtp +emailOtpExpiry'); // ✅ FIX

        if (!user) {
            return res.status(400).send({ message: 'Invalid email' });
        }

        if (user.emailOtpVerified) {
            return res.status(400).send({ message: 'Email already verified' });
        }

        if (user.emailOtp !== hashedOtp) {
            return res.status(400).send({ message: 'Invalid OTP' });
        }

        if (user.emailOtpExpiry < Date.now()) {
            return res.status(400).send({ message: 'OTP has expired' });
        }

        user.emailOtp = undefined;
        user.emailOtpExpiry = undefined;
        user.emailOtpVerified = true;

        await user.save();

        res.send({ success: true, message: 'Email verified successfully' });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server error during email verification',
            error: error.message
        });
    }
};

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email) {
            return res.status(400).send({ message: 'Email is required' });
        }

        if (!password) {
            return res.status(400).send({ message: 'Password is required' });
        }

        const user = await UserModel
            .findOne({ email })
            .select('+password'); // ✅ REQUIRED

        if (!user) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        // ✅ Compare password
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(400).send({ message: 'Invalid email or password' });
        }

        // ✅ Check email verification
        if (!user.emailOtpVerified) {
            return res.status(400).send({
                message: 'Email not verified. Please verify your email before logging in.'
            });
        }

        const token = JWT.sign( { id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' } );

        res.send({ success: true, message: 'Login successful', token, user: { name: user.name, email: user.email, role: user.role } });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }
};

export const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }

    const user = await UserModel.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    // ✅ Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // ✅ IMPORTANT: assign values
    user.resetPasswordOtp = hashOtp(otp);
    user.resetPasswordExpiry = Date.now() + 10 * 60 * 1000;

    // 🔥 IMPORTANT: save after assigning
    await user.save();

    console.log("Generated OTP:", otp); // debug

    // ✅ Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Reset Password OTP",
      text: `Your OTP is ${otp}`,
    });

    res.send({
      success: true,
      message: "OTP sent to email",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in forgot password",
      error: error.message,
    });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    const { email, emailOtp, newPassword } = req.body;

    if (!email || !emailOtp || !newPassword) {
      return res.status(400).send({
        message: "Email, OTP and new password are required",
      });
    }

    const cleanOtp = String(emailOtp).trim();

    const user = await UserModel
      .findOne({ email: email.toLowerCase() })
      .select('+resetPasswordOtp +resetPasswordExpiry');

    if (!user) {
      return res.status(400).send({ message: "User not found" });
    }

    if (!user.resetPasswordOtp) {
      return res.status(400).send({ message: "No reset request found" });
    }

    const hashedOtp = crypto.createHash('sha256').update(cleanOtp).digest('hex');

    if (user.resetPasswordOtp !== hashedOtp) {
      return res.status(400).send({ message: "Invalid OTP" });
    }

    if (user.resetPasswordExpiry < Date.now()) {
      return res.status(400).send({ message: "OTP expired" });
    }

    user.password = await hashPassword(newPassword);

    user.resetPasswordOtp = undefined;
    user.resetPasswordExpiry = undefined;

    await user.save();

    res.send({
      success: true,
      message: "Password reset successful",
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error in reset password",
      error: error.message,
    });
  }
};

export const refreshTokenController = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).send({ message: "Refresh token required" });
    }

    let decoded;
    try {
      decoded = JWT.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).send({ message: "Invalid or expired refresh token" });
    }

    const user = await UserModel
      .findById(decoded.id)
      .select('+refreshToken');

    if (!user || !user.refreshToken) {
      return res.status(401).send({ message: "Unauthorized" });
    }

    if (user.refreshToken !== refreshToken) {
      return res.status(401).send({ message: "Refresh token mismatch" });
    }

    const newAccessToken = JWT.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.send({
      success: true,
      message: "Token refreshed successfully",
      token: newAccessToken
    });

  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: "Error refreshing token",
      error: error.message
    });
  }
};