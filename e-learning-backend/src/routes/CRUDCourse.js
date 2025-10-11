const express = require('express');
const router = express.Router();

const { 
    createCourse, 
    getCourses, 
    getCourseById,
    updateCourse,
    deleteCourse
} = require('../controllers/courseController'); 

const authMiddleware = require('../middleware/authMiddleware'); 


router.post('/', authMiddleware, createCourse); 


router.get('/', authMiddleware, getCourses); 

router.get('/:id', authMiddleware, getCourseById); 


router.put('/:id', authMiddleware, updateCourse); 


router.delete('/:id', authMiddleware, deleteCourse); 

module.exports = router;