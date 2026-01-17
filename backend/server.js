import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import session from "express-session";
import MongoStore from "connect-mongo";
import connectDB from "./db.js";
import userRoutes from "./routes/userRoutes.js";
import quizRoutes from "./routes/quizRoutes.js";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

// Content for CORS
const corsOptions = {
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
    credentials: true,
};
app.use(cors(corsOptions));

app.use(
    session({
        secret: process.env.SESSION_SECRET || "tajne",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
        }),
        cookie: {
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        },
    })
);

app.use("/api/users", userRoutes);
app.use("/api/quizitems", quizRoutes);

// Serwowanie plików frontendu w produkcji
if (process.env.NODE_ENV === "production") {
    const frontendPath = path.join(__dirname, "../frontend/dist/frontend/browser");
    app.use(express.static(frontendPath));

    app.get("(.*)", (req, res) => {
        res.sendFile(path.join(frontendPath, "index.html"));
    });
}

app.listen(port, async () => {
    await connectDB();
    console.log(`Serwer działa na porcie ${port}`);
});
