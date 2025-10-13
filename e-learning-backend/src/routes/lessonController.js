// /e-learning-backend/src/controllers/lessonController.js

const Lesson = require('../models/Lesson'); // Ajusta la ruta a tu modelo de Lección
const Course = require('../models/Course'); // Ajusta la ruta a tu modelo de Curso

/**
 * Tarea 2.3.1: Crea una nueva lección y asóciala a un curso existente.
 * POST /api/lessons
 */
exports.createLesson = async (req, res) => {
    // 1. Desestructurar los datos de la solicitud
    // Esperamos recibir el title, content y el courseId del curso al que pertenece
    const { title, content, courseId } = req.body;

    // Validación básica: asegura que tenemos la información esencial
    if (!title || !courseId) {
        return res.status(400).json({ message: 'Faltan campos esenciales: title y courseId son requeridos.' });
    }

    try {
        // 2. Crear y guardar la nueva lección en la base de datos
        const newLesson = new Lesson({
            title,
            content,
            course: courseId // Asocia la lección con el ID del curso
        });

        const savedLesson = await newLesson.save();

        // 3. Actualizar el documento del curso para añadir la ID de la nueva lección a su array 'lessons'
        // Utilizamos findByIdAndUpdate de Mongoose y el operador $push de MongoDB.
        const updatedCourse = await Course.findByIdAndUpdate(
            courseId,
            { $push: { lessons: savedLesson._id } }, // $push añade el _id de la lección al array 'lessons'
            { new: true, useFindAndModify: false } // 'new: true' devuelve el curso actualizado
        );

        // Opcional: Manejar el caso si el curso no fue encontrado (aunque la lección ya se creó)
        if (!updatedCourse) {
             // Es una buena práctica en una transacción fallida revertir el primer cambio.
             // await Lesson.findByIdAndDelete(savedLesson._id); 
             return res.status(404).json({ 
                message: 'Curso no encontrado. La lección se creó, pero no se pudo enlazar al curso.',
                lesson: savedLesson // A pesar del error, devolvemos la lección creada.
            });
        }

        // 4. Éxito: Devolver la nueva lección y un mensaje de confirmación
        res.status(201).json({ 
            message: 'Lección creada y curso actualizado exitosamente.',
            lesson: savedLesson
        });

    } catch (error) {
        console.error('Error al crear la lección:', error);
        // Devolver un error 500 para fallos en el servidor/base de datos
        res.status(500).json({ 
            message: 'Error interno del servidor al procesar la solicitud.', 
            error: error.message 
        });
    }
};
