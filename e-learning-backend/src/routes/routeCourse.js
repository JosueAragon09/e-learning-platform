// routes/course.js
const express = require('express');
const router = express.Router();

// Importar el controlador de curso
const courseController = require('../controllers/courseController'); 

// Importar los Middlewares
// 1. Autenticación (verifica el JWT y adjunta req.user)
const authMiddleware = require('../middleware/authMiddleware'); 
// 2. Autorización (verifica si el rol es 'admin' o 'teacher')
const { checkRole } = require('../middleware/role-checker'); // ASUME que tienes este archivo
// 3. Multer (maneja la subida del archivo)
const upload = require('../config/multerConfig'); // ASUME que tienes este archivo

// ===================================================================
// RUTAS DE CREACIÓN Y GESTIÓN DE CURSOS
// ===================================================================

// @route   POST /api/courses
// @desc    Crear un nuevo curso con su imagen de miniatura
// @access  Private (Solo Teacher y Admin)
// * Esta es la implementación de la Tarea 3.1.2: Middleware en Rutas *
router.post(
    '/', 
    authMiddleware,                          // 1. Verifica si el usuario está logeado
    checkRole(['admin', 'teacher']),         // 2. Verifica si tiene el rol correcto (Autorización)
    upload.single('courseImage'),            // 3. Middleware Multer: Espera 1 archivo con el campo 'courseImage'
    courseController.createCourse            // 4. Llama a la lógica de creación del curso
);

// 

// @route   GET /api/courses
// @desc    Obtener todos los cursos públicos o propios (según el rol)
// @access  Public/Private
// router.get('/', courseController.getCourses); 

// @route   PUT /api/courses/:id
// @desc    Actualizar un curso (Solo Admin o el Instructor dueño)
// @access  Private
// router.put('/:id', authMiddleware, checkRole(['admin', 'teacher']), courseController.updateCourse); 


// Exportar el router para ser usado en server.js
module.exports = router;