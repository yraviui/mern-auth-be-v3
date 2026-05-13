# 🔐 MERN Auth System

A modern and secure MERN Stack Authentication System with:

- ✅ JWT Authentication
- ✅ Email OTP Verification
- ✅ Forgot Password with Email OTP
- ✅ Role-Based Access Control
- ✅ Admin / User / Customer Care Dashboards
- ✅ Protected Routes
- ✅ Responsive React + Tailwind UI

---

# 🚀 Tech Stack

## Frontend
- React.js
- React Router DOM
- Tailwind CSS
- Axios
- React Hot Toast

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Nodemailer

---

# 👥 User Roles

## 🔴 Admin
Full system access.

### Features
- Manage all users
- Manage customer care accounts
- Access system controls
- View dashboard analytics
- Update/Delete users

---

## 🟢 User
Standard application user.

### Features
- Register/Login
- Email OTP verification
- Forgot password
- Update profile
- Access protected pages

---

## 🟡 Customer Care
Support panel access.

### Features
- View user requests
- Support management
- Limited dashboard access
- User assistance tools

---

# ✨ Features

## 🔐 Authentication
- Register with email OTP verification
- Login with JWT
- Protected routes
- Role-based authorization

## 📩 Email Services
- Email OTP verification
- Forgot password OTP
- Contact form email support

## 🔑 Password Security
- Password hashing with bcrypt
- JWT token authentication
- Secure password reset flow

## 🎨 UI
- Modern responsive design
- Tailwind CSS styling
- Mobile-friendly layout

---

# 📂 Project Structure

```bash
mern-auth/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── routes/
│   │   └── App.jsx
│
├── server/
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middlewares/
│   ├── utils/
│   └── server.js
```

---

# ⚙️ Installation

## 1️⃣ Clone Repository

```bash
git clone https://github.com/yraviui/mern-auth-be-v3.git
```

---

## 2️⃣ Install Dependencies

### Frontend

```bash
cd client
npm install
```

### Backend

```bash
cd server
npm install
```

---

# 🔑 Environment Variables

Create `.env` file inside backend folder.

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

---

# ▶️ Run Application

## Backend

```bash
npm run server
```

## Frontend

```bash
npm run dev
```

---

# 📩 Email Configuration

This project uses Gmail SMTP with Nodemailer.

## Requirements
- Enable 2-Step Verification
- Generate Gmail App Password
- Use App Password in `.env`

---

# 🔒 Protected Routes

## Admin Routes
Only accessible by Admin users.

## User Routes
Accessible after login.

## Customer Care Routes
Restricted support access.

---

# 📱 Screens Included

- Home Page
- About Page
- Services Page
- Contact Page
- Register Page
- Login Page
- Email OTP Verification
- Forgot Password
- Reset Password
- Admin Dashboard
- User Dashboard
- Customer Care Dashboard

---

# 🎨 Theme Colors

| Purpose | Color |
|----------|--------|
| Primary | `#2D3E50` |
| Accent | `#4CA1AF` |
| Light Accent | `#C9D6FF` |
| Background | `#f1f1f1` |

---

# 📌 Future Improvements

- Google OAuth Login
- Refresh Tokens
- Dark Mode
- User Profile Upload
- Admin Analytics
- Real-time Notifications
- Docker Deployment

---

# 👨‍💻 Author

Developed using MERN Stack with secure authentication and role-based authorization system.

---

# 📄 License

This project is licensed under the MIT License.