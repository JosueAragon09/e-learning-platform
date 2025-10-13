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
        set: val => Math.round(val * 10) / 10 // Redondea a un decimal (4.66 -> 4.7)
    },
    instructor: {
        type: mongoose.Schema.ObjectId,
        ref: 'User', // Asume que tu modelo de usuario se llama 'User'
        required: [true, 'Un curso debe tener un instructor.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },

    // ------------------------------------------------------------------
    // CAMPO REQUERIDO: Array físico para almacenar las referencias de las lecciones.
    // Esto es necesario para que el controlador pueda usar `$push`.
    lessons: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Lesson' // Referencia al modelo de Lección
        }
    ]
    // ------------------------------------------------------------------

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

/*
* NOTA: He eliminado el código de Virtual Populate porque ahora tenemos el campo
* "lessons" definido físicamente. No se recomienda usar un campo físico y un virtual
* con el mismo nombre, ya que confunde el propósito de la relación.
*/

const Course = mongoose.model('Course', courseSchema);

module.exports = Course;