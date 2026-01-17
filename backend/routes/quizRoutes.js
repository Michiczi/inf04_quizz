import express from "express";
import { body, validationResult } from "express-validator";
import {
  authMiddleware,
  authorizeRoles,
} from "../middleware/authMiddleware.js";
import * as quizController from "../controllers/quizController.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

router.get("/pytania", authMiddleware, quizController.getQuizQuestions);

router.post(
  "/",
  authMiddleware,
  authorizeRoles("admin"),
  body("question")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Pytanie musi mieć co najmniej 5 znaków."),
  body("answers")
    .isArray({ min: 2 })
    .withMessage("Musisz podać co najmniej dwie odpowiedzi."),
  body("answers.*")
    .trim()
    .notEmpty()
    .withMessage("Odpowiedź nie może być pusta."),
  body("correct")
    .trim()
    .notEmpty()
    .withMessage("Poprawna odpowiedź jest wymagana."),
  validate,
  quizController.createQuizItem
);

router.get("/", authMiddleware, quizController.getAllQuizItems);

router.get("/:id", authMiddleware, quizController.getQuizItem);

router.put(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  body("question")
    .optional()
    .trim()
    .isLength({ min: 5 })
    .withMessage("Pytanie musi mieć co najmniej 5 znaków."),
  body("answers")
    .optional()
    .isArray({ min: 2 })
    .withMessage("Musisz podać co najmniej dwie odpowiedzi."),
  body("answers.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Odpowiedź nie może być pusta."),
  body("correct")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Poprawna odpowiedź jest wymagana."),
  validate,
  quizController.updateQuizItem
);

router.delete(
  "/:id",
  authMiddleware,
  authorizeRoles("admin"),
  quizController.deleteQuizItem
);

export default router;
