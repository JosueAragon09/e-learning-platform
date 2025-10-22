// /e-learning-backend/controllers/scoreController.js
const UserQuizScore = require('../models/userQuizScore');
const Quiz = require('../models/quiz'); 
// También puede necesitar importar su modelo de usuario si va a hacer otras validaciones
// const User = require('../models/User'); 

// Umbral de aprobación (ejemplo: si el Quiz no tiene un campo de porcentaje, usamos este. 
// Para este ejercicio, asumiremos que todos los quizzes requieren 70% para pasar).
const DEFAULT_PASSING_THRESHOLD = 70; 

exports.saveQuizScore = async (req, res) => {
    try {
        const { quizId, userAnswers } = req.body;
        // Asumiendo que su middleware de autenticación (auth) adjunta el ID del usuario como 'req.user.id'
        const userId = req.user.id; 

        // 1. Validar la entrada básica
        if (!quizId || !userAnswers || !Array.isArray(userAnswers)) {
            return res.status(400).json({ msg: 'Datos incompletos. Se requiere quizId y userAnswers.' });
        }

        // 2. Obtener el quiz original de la base de datos
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return res.status(404).json({ msg: 'Quiz no encontrado.' });
        }
        
        const totalQuestions = quiz.questions.length;
        if (totalQuestions === 0) {
             return res.status(400).json({ msg: 'El quiz no tiene preguntas definidas.' });
        }

        let correctCount = 0;
        let processedUserAnswers = [];

        // 3. Calificación: Iterar sobre las respuestas del usuario
        userAnswers.forEach((userAnswer, index) => {
            // Buscamos la pregunta original por su índice (asumiendo que el frontend lo envía)
            // Nota: En su esquema Quiz.js no hay 'questionIndex', solo un array. Usamos el índice del array como questionIndex.
            const originalQuestion = quiz.questions[index];
            
            let isCorrect = false;

            if (originalQuestion) {
                // Compara la respuesta enviada (submittedAnswer) con la respuesta correcta almacenada (correctAnswer)
                if (userAnswer.submittedAnswer === originalQuestion.correctAnswer) { 
                    correctCount++;
                    isCorrect = true;
                }
            }
            
            // Construir el array final que se guardará en UserQuizScore
            processedUserAnswers.push({
                questionIndex: index, // Usamos el índice del loop
                submittedAnswer: userAnswer.submittedAnswer || '', // Asegurar que sea una cadena
                isCorrect: isCorrect
            });
        });

        // 4. Calcular el puntaje final y el estado 'passed'
        const scorePercentage = (correctCount / totalQuestions) * 100;
        
        // Usamos el campo 'totalScore' para determinar si se pasó el quiz.
        // Si 'totalScore' se usa como el score MÍNIMO requerido:
        // const passed = scorePercentage >= quiz.totalScore; 
        
        // Si 'totalScore' se usa como la puntuación MÁXIMA (ej: 100) y solo necesitamos el porcentaje:
        const passed = scorePercentage >= DEFAULT_PASSING_THRESHOLD; // Usamos 70% fijo

        // 5. Crear la nueva entrada en UserQuizScore
        const newScoreEntry = new UserQuizScore({
            userId,
            quizId,
            userAnswers: processedUserAnswers,
            score: scorePercentage, // Guardar el score como porcentaje
            passed
        });

        // 6. Guardar en la base de datos
        await newScoreEntry.save();

        // 7. Respuesta exitosa
        res.json({ 
            msg: 'Puntaje guardado exitosamente', 
            score: newScoreEntry.score,
            passed: newScoreEntry.passed,
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor al guardar el puntaje.');
    }
};