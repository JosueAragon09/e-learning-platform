const Course = require('../models/courses');


exports.createCourse = async (req, res) => {
    try {
        const instructorId = req.user.id; 
        const { title, description, price, published } = req.body; 

        if (!title || !description || price === undefined) {
            return res.status(400).json({ message: 'Por favor, ingrese el título, descripción y precio.' });
        }
        
        const newCourse = new Course({
            title,
            description,
            price,
            published,
            instructor: instructorId 
        });

        const course = await newCourse.save();

        res.status(201).json({ message: 'Curso creado exitosamente', course });

    } catch (error) {
        console.error("Error al crear el curso:", error.message);
        if (error.code === 11000) { 
            return res.status(400).json({ message: 'Ya existe un curso con este título.' });
        }
        res.status(500).json({ message: 'Error en el servidor al crear el curso' });
    }
};


exports.getCourses = async (req, res) => {
    try {
       
        const courses = await Course.find({})
            
            .populate('instructor', 'name email') 
            .sort({ createdAt: -1 });

        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: 'No se encontraron cursos.' });
        }

        res.status(200).json(courses);
    } catch (error) {
        console.error("Error al obtener los cursos:", error.message);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener los cursos'
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const courseId = req.params.id;

        const course = await Course.findById(courseId)
            .populate('instructor', 'name email role'); 

        if (!course) {
            return res.status(404).json({ message: `Curso con ID ${courseId} no encontrado.` });
        }

        res.status(200).json(course);
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Formato de ID de curso inválido.' });
        }
        console.error("Error al obtener el curso:", error.message);
        res.status(500).json({ 
            message: 'Error en el servidor al obtener el curso'
        });
    }
};


exports.updateCourse = async (req, res) => {
    try {
        let course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }
        
       
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ message: 'No autorizado: Solo el instructor del curso puede modificarlo.' });
        }

        course = await Course.findByIdAndUpdate(
            req.params.id, 
            req.body, 
           
            { new: true, runValidators: true } 
        );

        res.status(200).json({ message: 'Curso actualizado exitosamente', course });

    } catch (error) {
        console.error("Error al actualizar el curso:", error.message);
        res.status(500).json({ message: 'Error en el servidor al actualizar el curso' });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) {
            return res.status(404).json({ message: 'Curso no encontrado.' });
        }
        
        
        if (course.instructor.toString() !== req.user.id) {
            return res.status(401).json({ message: 'No autorizado: Solo el instructor del curso puede eliminarlo.' });
        }

        await Course.findByIdAndDelete(req.params.id);

        res.status(200).json({ message: 'Curso eliminado exitosamente' });

    } catch (error) {
        console.error("Error al eliminar el curso:", error.message);
        res.status(500).json({ message: 'Error en el servidor al eliminar el curso' });
    }
};


module.exports = {
    createCourse,
    getCourses,
    getCourseById,
    updateCourse,
    deleteCourse 
};