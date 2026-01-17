import mongoose from 'mongoose';

const QuizItemSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true,
        trim: true,
        minlength: 5
    },
    answers: {
        type: [String],
        required: true,
        validate: {
            validator: function (v) {
                return v && v.length >= 2;
            },
            message: 'A quiz item must have at least two answers!'
        }
    },
    correct: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const QuizItem = mongoose.model('QuizItem', QuizItemSchema, 'quizitems');

export default QuizItem;
