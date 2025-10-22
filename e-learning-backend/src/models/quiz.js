// src/models/Quiz.js
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    // ID de la clase o curso al que pertenece el quiz
    courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course', // Asumiendo que tienes un modelo 'Course'
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    // Array de objetos para las preguntas
    questions: [
        {
            questionText: {
                type: String,
                required: true
            },
            options: [
                {
                    type: String,
                    required: true
                }
            ],
            // La respuesta correcta (por ejemplo, el índice de la opción o el texto)
            correctAnswer: {
                type: String, // o Number, dependiendo de cómo manejes las respuestas
                required: true
            }
        }
    ],
    // Puntuación total posible del quiz (opcional, se puede calcular)
    totalScore: {
        type: Number,
        default: 0
    }
}, { timestamps: true });

const Quiz = mongoose.model('Quiz', quizSchema);
module.exports = Quiz;