import express from "express";
import { body, validationResult } from "express-validator";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as userController from "../controllers/userController.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.post(
  "/register",
  body("name").trim().notEmpty().withMessage("Imię jest wymagane."),
  body("login")
    .isEmail()
    .withMessage("Podaj prawidłowy adres email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi mieć co najmniej 6 znaków."),
  validate,
  userController.register
);

router.post(
  "/register/admin/:secret",
  body("name").trim().notEmpty().withMessage("Imię jest wymagane."),
  body("login")
    .isEmail()
    .withMessage("Podaj prawidłowy adres email.")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Hasło musi mieć co najmniej 6 znaków."),
  validate,
  userController.registerAdmin
);

router.post(
  "/login",
  body("login")
    .isEmail()
    .withMessage("Podaj prawidłowy adres email.")
    .normalizeEmail(),
  body("password").notEmpty().withMessage("Hasło jest wymagane."),
  validate,
  userController.login
);

router.post("/logout", userController.logout);

router.get("/highscore", authMiddleware, userController.getHighscore);

router.post("/highscore", authMiddleware, userController.updateHighscore);

router.get("/user", authMiddleware, userController.getUser);

export default router;
