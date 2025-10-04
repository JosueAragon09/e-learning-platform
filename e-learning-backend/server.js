// Importa el framework Express para construir la API
const express = require('express'); 

// Importa la función de conexión a la base de datos
const connectDB = require('./config/db');

// Inicializa la aplicación de Express
const app = express();

// Define el puerto donde se ejecutará el servidor, usa el puerto del entorno (si está disponible, por ejemplo, en producción) o 5000 por defecto.
const PORT = process.env.PORT || 5000;

// Llama a la función para conectar a MongoDB
connectDB();

// Middleware de Express, permite que la aplicación entienda datos JSON enviados en el cuerpo de las peticiones (request body).
app.use(express.json({ extended: false }));

// Define una ruta de prueba, cuando se acceda a la URL raíz ('/'), el servidor responderá con el mensaje 'API corriendo'.
app.get('/', (req, res) => res.send('API corriendo'));

// Inicia el servidor y lo pone a 'escuchar' peticiones en el puerto especificado, el mensaje en la consola confirma que el servidor se ha iniciado correctamente.
app.listen(PORT, () => console.log(`Servidor iniciado en el puerto ${PORT}`));