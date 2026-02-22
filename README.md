# INF04 Quiz Fullstack MERN Application

A modern, full-stack application featuring a robust authentication system and a quiz management module. Built with the **MEAN** stack (MongoDB, Express, Angular, Node.js).

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
   git clone https://github.com/Michiczi/inf04_quizz.git
   cd inf04_quizz
   ```

2. **Install dependencies**:
   This will install dependencies for the root, backend, and frontend projects via a `postinstall` hook.
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
   Starts both the backend and frontend development servers simultaneously.
   ```bash
   npm start
   ```

5. **Run in Production (after building frontend)**:
   Builds the frontend and then starts the backend server.
   ```bash
   npm run start:prod
   ```

## 🌐 Render.com

You can check out this project on [Render.com](https://inf04-quizz.onrender.com/home)

## 📄 License

This project is licensed under the ISC License.
