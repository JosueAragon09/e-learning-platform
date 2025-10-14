const multer = require('multer');
const path = require('path');

// 1. Configuración del Storage
const storage = multer.diskStorage({
    // Establece el directorio de destino para los archivos
    destination: (req, file, cb) => {
        // Asegúrate de que este directorio exista en la raíz de tu backend
        cb(null, path.join(__dirname, '..', 'public', 'uploads')); 
    },
    
    // Establece el nombre del archivo
    filename: (req, file, cb) => {
        // Genera un nombre único y añade la extensión original
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Usa path.extname para obtener la extensión original del archivo
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// 2. Opcional: Filtro para restringir tipos de archivos (e.g., solo imágenes)
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        // Acepta el archivo
        cb(null, true); 
    } else {
        // Rechaza el archivo
        cb(new Error('Tipo de archivo no soportado. Solo se permiten imágenes.'), false); 
    }
};

// 3. Exportación del Middleware Multer configurado
const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 1024 * 1024 * 5 // Límite de 5MB por archivo
    }
});

// Exporta la instancia de Multer para usarla en las rutas
module.exports = upload;