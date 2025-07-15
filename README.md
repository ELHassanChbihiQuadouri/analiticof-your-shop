# AnaliticOf Your Shop 🛍️

A smart dashboard system for managing and analyzing e-commerce store orders. Built using **Node.js**, **Express**, **Sequelize**, and **React**. Designed for **Managers**, **Sales agents**, and **Viewers** with custom role-based access control.

---

## 📌 Features

* 🔐 **User Authentication** (Signup, Login, Email Verification)
* 👥 **Role Management** (Manager, Sales, Viewer)
* 🛒 **Order Management** (Create, View, Update, Track)
* 📊 **Analytics Dashboard**

  * Average Order Value
  * Monthly Growth Rate
  * Cancellation Rate
* 🏬 **Shop Setup and Configuration**
* 📧 **Email-based Verification Codes**
* 💻 Backend API built with Express.js + Sequelize
* ⚛️ Frontend using React + React Router

---

## 🧩 User Roles & Access

| Role    | Orders              | Shop Setup | User Management |
| ------- | ------------------- | ---------- | --------------- |
| Manager | Full access (CRUD)  | ✅ Yes      | ✅ Yes           |
| Sales   | Add + Update + View | ❌ No       | ❌ No            |
| Viewer  | View only           | ❌ No       | ❌ No            |

---

## 🗂️ Tech Stack

* **Frontend:** React.js, CSS
* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL + Sequelize ORM
* **Email:** Nodemailer (Gmail SMTP)
* **Auth:** JWT + bcrypt

---

## 🚀 Getting Started (Local Setup)

```bash
git clone https://github.com/ELHassanChbihiQuadouri/analiticof-your-shop.git
cd backend
npm install
cp .env.example .env  # ← create your .env file
npx sequelize-cli db:migrate

# In another terminal:
cd ../frontend
npm install
npm start
```
