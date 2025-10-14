// server.js

// Importa el framework Express para construir la API
const express = require('express'); 
// Importa el módulo 'path' para trabajar con rutas de archivos y directorios
const path = require('path'); 

// Importa la función de conexión a la base de datos
const connectDB = require('./config/db');

// Inicializa la aplicación de Express
const app = express();

// Define el puerto donde se ejecutará el servidor
const PORT = process.env.PORT || 5000;

// Llama a la función para conectar a MongoDB
connectDB();

// =======================================================
// MIDDLEWARE
// =======================================================

// Middleware: Permite que la aplicación entienda datos JSON
app.use(express.json({ extended: false }));

// Middleware para servir archivos estáticos (archivos subidos)
// Esto permite que las imágenes, PDFs, etc., sean accesibles a través de una URL pública.
// Apunta al directorio 'public' que creaste para Multer.
app.use('/public', express.static(path.join(__dirname, 'public')));


// =======================================================
// RUTAS DE LA API
// =======================================================

// Ruta de prueba
app.get('/', (req, res) => res.send('API corriendo'));

// Define las rutas de tu aplicación
// ----------------------------------------------------
// RUTAS ACTIVADAS
// ----------------------------------------------------
// Monta el Course Router en el endpoint /api/courses
app.use('/api/courses', require('./routes/course')); 

// Descomenta y ajusta estas líneas cuando tengas listos los demás routers:
app.use('/api/users', require('./routes/user'));
 app.use('/api/lessons', require('./routes/lesson'));


// =======================================================
// INICIO DEL SERVIDOR
// =======================================================

// Inicia el servidor
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));
