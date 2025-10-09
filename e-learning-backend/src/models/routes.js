const express = require('express');

// 💡 Ajuste de rutas relativas: subir un nivel (../)
const courseController = require('../controllers/courseController');
const lessonController = require('../controllers/lessonController');
const authController = require('../controllers/authController'); // Asume que tu auth está aquí

const router = express.Router();

// Middleware de Protección: Aplica la autenticación a todas las rutas a partir de este punto
router.use(authController.protect); 

// Rutas para Lecciones Anidadas
// Se requiere que el usuario esté logueado
router.route('/:courseId/lessons')
  .post(
    authController.restrictTo('instructor', 'admin'), // Solo instructores/admins pueden crear
    lessonController.setCourseInstructor, // Opcional: para inyectar el ID del curso y usuario antes de crear
    lessonController.createLesson
  )
  .get(lessonController.getLessonsForCourse); // Los estudiantes/todos pueden ver

router.route('/:courseId/lessons/:lessonId')
    .get(lessonController.getLesson)
    .patch(authController.restrictTo('instructor', 'admin'), lessonController.updateLesson)
    .delete(authController.restrictTo('instructor', 'admin'), lessonController.deleteLesson);


// Rutas Principales para Cursos
router.route('/')
  .get(courseController.getAllCourses)   // GET /api/v1/courses (Todos pueden ver)
  .post(
    authController.restrictTo('instructor', 'admin'), // Solo instructores/admins pueden crear
    courseController.setInstructorId, // Opcional: para inyectar el ID del usuario logueado como instructor
    courseController.createCourse
  );

router.route('/:id')
  .get(courseController.getCourse) // Incluirá las lecciones por 'populate'
  .patch(authController.restrictTo('instructor', 'admin'), courseController.updateCourse)
  .delete(authController.restrictTo('instructor', 'admin'), courseController.deleteCourse);

module.exports = router;