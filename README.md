# 🛒 E-Commerce System (Full-Stack MERN Application)

A modern full-stack E-Commerce platform built with **React 19 (Vite + TailwindCSS)**, **Express.js**, and **MongoDB Atlas**, featuring a customer storefront, payment integration with **Razorpay**, image storage with **ImageKit**, and an **Admin Dashboard** for product and order management.

---

## 📁 Repository Structure

```text
E-Commerce-System/
├── Frontend/           # React 19 + Vite SPA (Storefront & Admin UI)
├── Backend/            # Node.js + Express API (User authentication, products, cart, orders, Razorpay)
├── Admin/              # Express API (Admin authentication, product management, order status)
├── .gitignore          # Excludes node_modules, secrets, builds, logs
├── package.json        # Monorepo build script for Vercel deployment
└── vercel.json         # Vercel deployment configuration
```

---

## ⚡ Features

### 🛍️ Storefront (Frontend)
- **Product Catalog:** Paginated products with category filtering, search, and instant details modal/page.
- **Cart & Checkout:** Real-time cart calculations, Cash on Delivery (COD), and **Razorpay** payment gateway integration.
- **User Authentication:** JWT authentication, user registration, login, profile management, and order history.
- **Responsive UI:** Modern design styled with TailwindCSS and dynamic micro-animations.

### 🛡️ Admin Panel
- **Dashboard:** Add new products with image upload to **ImageKit**.
- **Catalog Management:** Edit product title, price, category, description, and delete products in real-time.
- **Order Management:** View customer orders and update status (`pending`, `shipping`, `delivered`).
- **User Management:** View registered customers and manage account statuses.

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js** (v18+)
- **npm** or **yarn**
- **MongoDB Atlas** database connection string

### 2. Environment Setup

#### Backend Environment Variables
Create `Backend/.env` (see [`Backend/.env.example`](Backend/.env.example)):
```env
PORT=5000
MONGO_URL=your_mongodb_atlas_url
SECRET_ONE=your_jwt_access_secret
SECRET_TWO=your_jwt_refresh_secret
publicKey=your_imagekit_public_key
privateKey=your_imagekit_private_key
urlEndpoint=https://ik.imagekit.io/your_id
ADMINKEY=your_admin_jwt_secret
RAZOR_1=your_razorpay_key_id
RAZOR_2=your_razorpay_key_secret
```

#### Admin Environment Variables
Create `Admin/.env` (see [`Admin/.env.example`](Admin/.env.example)):
```env
MONGO_URL=your_mongodb_atlas_url
AdminPORT=8000
ADMINKEY=your_admin_jwt_secret
publicKey=your_imagekit_public_key
privateKey=your_imagekit_private_key
urlEndpoint=https://ik.imagekit.io/your_id
```

### 3. Run Locally

```bash
# Start Backend API (Port 5000)
cd Backend
npm install
npm run dev

# Start Admin API (Port 8000)
cd ../Admin
npm install
npm start

# Start Frontend App (Port 5173)
cd ../Frontend
npm install
npm run dev
```

---

## 🌐 Deployment (Vercel)

This repository is pre-configured for 1-click **Vercel** continuous deployment:

1. Import repository `Kishorhadiya/E-Commerce-System` in Vercel.
2. Vercel automatically detects [`vercel.json`](vercel.json) and builds the `Frontend` app.
3. Configure `VITE_API_URL` and `VITE_ADMIN_API_URL` in Vercel Environment Variables.
