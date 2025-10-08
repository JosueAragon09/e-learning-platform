const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Asume que tienes un modelo User en ../models/User.js

/**
 * Middleware para proteger rutas.
 * * Verifica si existe un token JWT válido en las cabeceras de la solicitud.
 * Si es válido, adjunta los datos del usuario (incluyendo ID y rol) a req.user.
 *
 * @param {object} req - Objeto de solicitud de Express.
 * @param {object} res - Objeto de respuesta de Express.
 * @param {function} next - Función para pasar al siguiente middleware.
 */
const protect = async (req, res, next) => {
    let token;

    // 1. Verificar si el token está presente en las cabeceras de la solicitud
    // El formato esperado es: Authorization: Bearer <TOKEN>
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Extraer el token de la cabecera (ignorando "Bearer ")
            token = req.headers.authorization.split(' ')[1];

            // 2. Verificar y decodificar el token usando la clave secreta
            // El JWT_SECRET debe estar definido en tu archivo .env
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // 3. Buscar el usuario por ID y adjuntarlo a la solicitud (excluyendo la contraseña)
            // Esto garantiza que el token corresponde a un usuario existente y activo.
            req.user = await User.findById(decoded.id).select('-password');

            // 4. Si el usuario no se encuentra (fue eliminado, por ejemplo), denegar el acceso
            if (!req.user) {
                console.error('User not found for token ID:', decoded.id);
                res.status(401);
                throw new Error('Usuario no encontrado');
            }

            // Continuar con el siguiente middleware o controlador
            next();

        } catch (error) {
            console.error("Error en la verificación del token:", error.message);
            res.status(401).json({ message: 'No autorizado, token fallido o expirado' });
        }
    }

    // Si no hay token en las cabeceras
    if (!token) {
        res.status(401).json({ message: 'No autorizado, no hay token' });
    }
};

/**
 * Middleware para restringir el acceso basado en el rol del usuario.
 * @param {...string} roles - Roles permitidos (ej: 'teacher', 'admin').
 */
const authorize = (...roles) => {
    return (req, res, next) => {
        // req.user viene del middleware 'protect'
        if (!roles.includes(req.user.role)) {
            res.status(403);
            throw new Error(`Acceso denegado: El rol de ${req.user.role} no está autorizado para esta acción.`);
        }
        next();
    };
};

module.exports = { protect, authorize };