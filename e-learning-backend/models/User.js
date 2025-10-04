// Importa la biblioteca Mongoose
const mongoose = require('mongoose');

// Define el esquema (Schema) del usuario, un esquema es la "plantilla" que define la forma de los documentos en la colección
const UserSchema = new mongoose.Schema({
  // Campo 'name' de tipo String, es obligatorio
  name: {
    type: String,
    required: true,
  },
  // Campo 'email' de tipo String, es obligatorio y debe ser único para evitar duplicados.
  email: {
    type: String,
    required: true,
    unique: true,
  },
  // Campo 'password' de tipo String, es obligatorio
  password: {
    type: String,
    required: true,
  },
  // Campo 'date' de tipo Date, guarda la fecha de creación del usuario y `default: Date.now` asigna la fecha y hora actuales por defecto si no se proporciona una.
  date: {
    type: Date,
    default: Date.now,
  },
});

// Crea y exporta el modelo de Mongoose.
// El primer argumento ('user') es el nombre de la colección en la base de datos.
// El segundo argumento (UserSchema) es el esquema que acabamos de definir.
module.exports = mongoose.model('user', UserSchema);