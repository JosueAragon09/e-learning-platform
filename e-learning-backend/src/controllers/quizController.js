// src/controllers/quizController.js

const Quiz = require('../models/quiz');
const UserQuizScore = require('../models/userQuizScore');

// Función para calificar el quiz
exports.submitQuizAnswers = async (req, res) => {
    try {
        const { quizId, userAnswers } = req.body;
        // Asumiendo que obtienes el ID del usuario desde el token JWT o la sesión
        // const userId = req.user.id; 
        const userId = 'ID_DEL_USUARIO_AUTENTICADO'; // Usar el ID real

        // 1. Obtener el quiz de la DB
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz no encontrado' });
        }

        let correctCount = 0;
        let totalQuestions = quiz.questions.length;
        const gradedAnswers = [];

        // 2. Iterar sobre respuestas del usuario vs. respuestas del quiz en la DB (Bucle de Calificación)
        userAnswers.forEach((userAnswer, index) => {
            const quizQuestion = quiz.questions[index]; // Asumiendo que los índices coinciden
            
            if (!quizQuestion) {
                 // Manejar el caso si el número de respuestas no coincide o es un índice inválido
                 return;
            }

            const isCorrect = (userAnswer.submittedAnswer === quizQuestion.correctAnswer);
            
            if (isCorrect) {
                correctCount++;
            }

            // Guardar la respuesta calificada para el modelo UserQuizScore
            gradedAnswers.push({
                questionIndex: index,
                submittedAnswer: userAnswer.submittedAnswer,
                isCorrect: isCorrect
            });
        });
        
        // 3. Crear o actualizar la calificación (la calificacion)
        const finalScore = correctCount; // Podría ser un porcentaje, o puntos. Usamos # de respuestas correctas.
        
        // Determinar si pasó (Ejemplo: 70% de respuestas correctas)
        const percentage = (finalScore / totalQuestions) * 100;
        const passed = percentage >= 70; // Porcentaje de aprobación

        // Crear/Guardar el registro de la puntuación
        const userScoreRecord = new UserQuizScore({
            userId,
            quizId,
            userAnswers: gradedAnswers,
            score: finalScore,
            passed: passed
        });

        await userScoreRecord.save();

        res.json({
            msg: 'Respuestas enviadas y calificadas con éxito',
            score: finalScore,
            totalQuestions: totalQuestions,
            passed: passed,
            details: gradedAnswers // Opcional: enviar detalles de vuelta al usuario
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// ... otras funciones del controlador