// models/course.js
const mongoose = require('mongoose');

// Define el esquema para un curso
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Un curso debe tener un título.'],
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Un curso debe tener una descripción.'],
    },
    
    // ==================================================================
    // NUEVO CAMPO PARA ALMACENAR LA RUTA DE LA IMAGEN SUBIDA POR MULTER
    // ==================================================================
    image: {
        type: String,
        // Almacenará la ruta pública, ej: 'public/uploads/courseImage-12345.jpg'
        required: false, 
        // Puedes establecer una imagen por defecto si no se sube ninguna
        default: '/public/default/course_placeholder.png' 
    },
    // ==================================================================

    category: {
        type: String,
        enum: ['Desarrollo Web', 'Diseño', 'Marketing', 'Datos', 'Idiomas', 'Negocios'],
        default: 'Desarrollo Web',
    },
    price: {
        type: Number,
        default: 0,
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'La calificación debe ser superior a 1.0'],
        max: [5, 'La calificación debe ser inferior a 5.0'],
        set: val => Math.round(val * 10) / 10 // Redondea a un decimal
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', 
        required: [true, 'Un curso debe tener un instructor.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    lessons: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Lesson' // Referencia al modelo de Lección
        }
    ]
}, {
    // Las opciones toJSON y toObject con virtuals en true son importantes si tienes populaciones virtuales
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});


const Course = mongoose.model('Course', courseSchema);

module.exports = Course;