import QuizItem from "../models/QuizItem.js";

export const getQuizQuestions = async (req, res) => {
  try {
    const questions = await QuizItem.aggregate([{ $sample: { size: 20 } }]);
    res.status(200).json(questions);
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    res.status(500).json({ message: "Błąd serwera podczas pobierania pytań." });
  }
};

export const createQuizItem = async (req, res) => {
  try {
    const newQuizItem = new QuizItem(req.body);
    await newQuizItem.save();
    res.status(201).json(newQuizItem);
  } catch (error) {
    console.error("Error creating quiz item:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllQuizItems = async (req, res) => {
  try {
    const quizItems = await QuizItem.find();
    res.status(200).json(quizItems);
  } catch (error) {
    console.error("Error fetching quiz items:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getQuizItem = async (req, res) => {
  try {
    const quizItem = await QuizItem.findById(req.params.id);
    if (!quizItem) {
      return res.status(404).json({ message: "Quiz item not found" });
    }
    res.status(200).json(quizItem);
  } catch (error) {
    console.error("Error fetching quiz item by ID:", error);
    res.status(500).json({ message: error.message });
  }
};

export const updateQuizItem = async (req, res) => {
  try {
    const quizItem = await QuizItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!quizItem) {
      return res.status(404).json({ message: "Quiz item not found" });
    }
    res.status(200).json(quizItem);
  } catch (error) {
    console.error("Error updating quiz item:", error);
    res.status(400).json({ message: error.message });
  }
};

export const deleteQuizItem = async (req, res) => {
  try {
    const quizItem = await QuizItem.findByIdAndDelete(req.params.id);
    if (!quizItem) {
      return res.status(404).json({ message: "Quiz item not found" });
    }
    res.status(200).json({ message: "Quiz item deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz item:", error);
    res.status(500).json({ message: error.message });
  }
};
