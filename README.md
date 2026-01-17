# Quiz & Auth Fullstack Application

A modern, full-stack application featuring a robust authentication system and a quiz management module. Built with the **MEAN** stack (MongoDB, Express, Angular, Node.js) and designed for easy deployment on **Render.com**.

## 🚀 Features

- **Authentication System**:
  - User Registration and Login.
  - Secure password hashing using `bcrypt`.
  - Session-based authentication with `express-session` and MongoDB store.
  - Input validation using `express-validator`.
- **Quiz Management**:
  - Create, Read, Update, and Delete (CRUD) quiz items.
  - Interactive frontend built with **Angular**.
- **Modern UI**:
  - Responsive design using **Bootstrap 5**.
  - Dynamic components and real-time validation.
- **Deployment Ready**:
  - Pre-configured for **Render.com** (monorepo structure).
  - Optimized build process for production.

## 🛠️ Tech Stack

- **Frontend**: Angular, TypeScript, Bootstrap 5, RxJS.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Mongoose.
- **Session Management**: express-session, connect-mongo.
- **Dev Tools**: Concurrently, Nodemon.

## 📁 Project Structure

```text
├── backend/            # Express.js server, models, and routes
├── frontend/           # Angular application
├── package.json        # Root config for Monorepo deployment
└── .gitignore          # Git exclusion rules
```

## ⚙️ Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <your-repo-url>
   cd login_form
   ```

2. **Install dependencies**:
   Installs packages for both root, backend, and frontend.
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the `backend/` directory with:
   ```env
   MONGO_URI=your_mongodb_connection_string
   SESSION_SECRET=your_secret_key
   PORT=5000
   ```

4. **Run in Development**:
   Starts both the backend and frontend simultaneously.
   ```bash
   npm run dev
   ```

## 🌐 Deployment on Render.com

This project is optimized for Render using a single Web Service:

- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`
- **Environment Variables**: Make sure to add `MONGO_URI` and `SESSION_SECRET` in the Render dashboard.

## 📄 License

This project is licensed under the ISC License.
