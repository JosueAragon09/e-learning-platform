// /e-learning-backend/routes/routesLesson.js

const express = require('express');
const router = express.Router();
const lessonController = require('../controllers/lessonController'); // Asumiendo que usarás un controlador

// Ruta POST para crear una nueva lección
// Por ejemplo: POST /api/lessons
router.post('/lessons', lessonController.createLesson);

module.exports = router;
