// controllers/courseController.js
const Course = require('../models/Course'); 
const fs = require('fs');
const path = require('path');

// ====================================================================
// @desc    Crear un nuevo curso con su imagen de miniatura
// @route   POST /api/courses
// @access  Private (Solo Admin y Teacher)
// ====================================================================
exports.createCourse = async (req, res) => {
    
    // **NOTA DE ROL:** El middleware de ruta debe asegurar que req.user.role sea 'admin' o 'teacher'.
    const allowedRoles = ['admin', 'teacher'];
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        // Esto debería ser manejado por el middleware, pero es una buena práctica como fallback.
        if (req.file) {
             // Si Multer subió el archivo pero el usuario no tiene permisos, lo borramos.
            fs.unlinkSync(req.file.path);
        }
        return res.status(403).json({ message: 'Acceso denegado. Solo administradores y maestros pueden crear cursos.' });
    }

    try {
        const instructorId = req.user.id; 
        
        // 1. Obtener datos de req.body
        const { title, description, category, price, published } = req.body; 

        // 2. Manejo de la subida del archivo por Multer
        let imageUrl = '';
        if (req.file) {
            // Multer adjunta la información del archivo en req.file (si usamos upload.single)
            // Creamos la ruta relativa pública para guardar en la DB
            // req.file.path: 'ruta/completa/a/backend/public/uploads/nombre_archivo.jpg'
            // Guardamos: 'public/uploads/nombre_archivo.jpg'
            imageUrl = req.file.path.replace(/\\/g, "/").substring(req.file.path.indexOf("public"));
        }
        
        // 3. Validación básica de campos requeridos
        if (!title || !description || price === undefined) {
            
            // Si falta información esencial, borramos el archivo subido para evitar basura.
            if (req.file) {
                fs.unlinkSync(req.file.path);
            }
            
            return res.status(400).json({ 
                message: 'Por favor, ingrese el título, descripción, y precio del curso.' 
            });
        }
        
        // 4. Crear el nuevo curso
        const newCourse = new Course({
            title,
            description,
            image: imageUrl, // <-- Guardamos la ruta de la imagen
            category,
            price,
            published: published || false,
            instructor: instructorId 
        });

        // 5. Guardar el curso en la base de datos
        const course = await newCourse.save();

        // 6. Respuesta de éxito
        res.status(201).json({
            message: 'Curso creado exitosamente',
            course: course
        });

    } catch (error) {
        
        // Si hay un error de DB (ej. título duplicado), borramos el archivo subido.
        if (req.file) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Error al intentar borrar el archivo subido:", err);
            });
        }
        
        console.error("Error al crear el curso:", error.message);
        
        if (error.code === 11000) { // Error de clave única (título duplicado)
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

// ... Otras funciones del controlador (ej. getCourses, updateCourse, deleteCourse, etc.)