# 🔐 Advanced Authentication Service (MERN + JWT)

A secure, production-ready **authentication service** built using the **MERN stack**.  
Implements **JWT-based authentication**, **email verification**, and **password reset via email** — demonstrating advanced authentication flows often used in real-world systems.

---

## 🚀 Features

### 🧠 Authentication Flows
✅ **JWT Authentication**
- Access and refresh tokens for persistent sessions  
- Secure storage and token rotation  

✅ **Email Verification (Mailtrap)**
- Sends verification email upon registration  
- Prevents unverified accounts from logging in  

✅ **Forgot & Reset Password**
- Generates one-time secure token  
- Sends password reset email link  
- Tokens expire after a set time  

---

### 🔒 Security Highlights
- Passwords hashed using **bcrypt**  
- Tokens signed with **JWT_SECRET** and stored securely  
- CORS and helmet protection enabled  
- Verification and reset tokens expire automatically  

---

## 🧩 Tech Stack

| Layer | Technology |
|-------|-------------|
| **Frontend** | React + Axios |
| **Backend** | Node.js + Express.js |
| **Database** | MongoDB + Mongoose |
| **Authentication** | JWT (Access + Refresh Tokens), bcrypt |
| **Email Service** | Mailtrap |
| **Environment** | dotenv |

---

## 🧩 Environment Variables
```
MONGO_URI=
JWT_SECRET=
PORT=5000
NODE_ENV=
CLIENT_URL=
MAILTRAP_ENDPOINT=
MAILTRAP_TOKEN=

