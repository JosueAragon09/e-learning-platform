// src/models/UserQuizScore.js
const mongoose = require('mongoose');

const userQuizScoreSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Asumiendo que tienes un modelo 'User'
        required: true
    },
    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    // Respuestas enviadas por el usuario
    userAnswers: [
        {
            questionIndex: { // O un ID de pregunta si usas subdocumentos con _id
                type: Number,
                required: true
            },
            submittedAnswer: {
                type: String, // La respuesta que el usuario eligió
                required: true
            },
            isCorrect: { // Para un fácil acceso a si la respuesta fue correcta
                type: Boolean,
                default: false
            }
        }
    ],
    score: {
        type: Number,
        default: 0
    },
    passed: { // Opcional: si superó el quiz (por ejemplo, con un 70%)
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const UserQuizScore = mongoose.model('UserQuizScore', userQuizScoreSchema);
module.exports = UserQuizScore;