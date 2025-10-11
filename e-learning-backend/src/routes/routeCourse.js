const mongoose = require('mongoose');

const authMiddleware = require('../middleware/authMiddleware');

const CourseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'El título es obligatorio'],
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    price: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true 
    },
    
    published: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Course', CourseSchema);

const Course = require('../models/Course');

// @desc    Crear un nuevo curso
// @route   POST /api/courses
// @access  Private (Solo para usuarios autenticados, se asume que solo Instructores tienen acceso a esta funcionalidad)
exports.createCourse = async (req, res) => {
    try {
        // 1. Obtener el ID del instructor desde el objeto 'req.user'
        // Este objeto fue inyectado por el authMiddleware (1.3.1) al verificar el JWT.
        const instructorId = req.user.id; 
        
        // 2. Obtener los datos del cuerpo de la solicitud (req.body)
        const { title, description, price, published } = req.body; 

        // 3. Validación básica de campos requeridos
        if (!title || !description || price === undefined) {
            return res.status(400).json({ 
                message: 'Por favor, ingrese el título, descripción y precio del curso.' 
            });
        }
        
        // 4. Crear el nuevo curso
        const newCourse = new Course({
            title,
            description,
            price,
            published,
            instructor: instructorId // **ASIGNACIÓN CLAVE: Asigna req.user.id al campo instructor**
        });

        // 5. Guardar el curso en la base de datos
        const course = await newCourse.save();

        // 6. Respuesta de éxito
        res.status(201).json({
            message: 'Curso creado exitosamente',
            course: course
        });

    } catch (error) {
        // Manejo de errores de Mongoose 
        console.error("Error al crear el curso:", error.message);
        
        if (error.code === 11000) { // Código para error de clave única
            return res.status(400).json({ 
                message: 'Ya existe un curso con este título. Por favor, elija uno diferente.' 
            });
        }
        
        res.status(500).json({ 
            message: 'Error en el servidor al crear el curso',
            error: error.message
        });
    }
};