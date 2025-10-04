// Carga las variables de entorno del archivo .env
require('dotenv').config();

// Importa la biblioteca Mongoose para interactuar con MongoDB
const mongoose = require('mongoose');

// Define la URL de conexión a tu base de datos
const dbUrl = process.env.MONGO_URI;

// Crea una función asíncrona para conectar a la base de datos
const connectDB = async () => {
  try {
    // Intenta conectar a la base de datos usando la URL y opciones de configuración
    await mongoose.connect(dbUrl, {
      useNewUrlParser: true, // Opción para usar el nuevo analizador de URL de MongoDB
      useUnifiedTopology: true, // Opción para usar el nuevo motor de detección y monitoreo del servidor
    });
    console.log('MongoDB conectado...');
  } catch (err) {
    // Si la conexión falla, muestra el error en la consola
    console.error(err.message);
    // Termina el proceso de la aplicación con un código de error (1)
    process.exit(1);
  }
};

// Exporta la función para que pueda ser utilizada en `server.js`
module.exports = connectDB;