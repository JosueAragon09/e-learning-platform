const mongoose = require('mongoose');

// Define el esquema para una lección individual
const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Una lección debe tener un título.'],
    trim: true,
  },
  content: {
    type: String,
    required: [true, 'Una lección debe tener contenido o descripción.'],
  },
  videoUrl: String, // URL del video (p. ej., Vimeo, YouTube)
  duration: Number, // Duración en minutos
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  // Referencia al curso al que pertenece esta lección
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course', // Referencia al modelo Course
    required: [true, 'Una lección debe pertenecer a un curso.'],
  }
});

// Índice compuesto para asegurar que no haya dos lecciones con el mismo orden en el mismo curso
lessonSchema.index({ course: 1, order: 1 }, { unique: true });

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;