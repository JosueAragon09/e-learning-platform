// Archivo: e-learning-frontend/src/api/courseService.js

import axios from 'axios';

// URL base de tu API de backend (ajusta el puerto si es diferente)
const API_URL = 'http://localhost:5000/api/courses';

/**
 * Función de servicio para preparar los datos de un nuevo curso, incluyendo un archivo,
 * en un formato FormData para su envío a la API. (Toma de la Tarea 3.2.1)
 *
 * @param {object} courseData - Objeto que contiene los campos del curso.
 * @param {File} [courseImage] - El objeto File de la imagen del curso.
 * @returns {FormData} El objeto FormData.
 */
export const createCourseFormData = (courseData, courseImage = null) => {
    const formData = new FormData();

    for (const key in courseData) {
        if (courseData.hasOwnProperty(key)) {
            formData.append(key, courseData[key]);
        }
    }

    if (courseImage) {
        // 'courseImage' debe coincidir con el campo usado por 'multer' en el backend.
        formData.append('courseImage', courseImage);
    }

    return formData;
};

// ----------------------------------------------------------------------
// Tarea 3.2.2: Enviar la petición sin establecer el Content-Type
// ----------------------------------------------------------------------

/**
 * Función que envía el FormData al endpoint de creación de cursos del backend.
 *
 * @param {FormData} formData - El objeto FormData que contiene los datos y el archivo.
 * @param {string} token - El token de autenticación (si se requiere).
 * @returns {Promise<object>} La respuesta de la API.
 */
export const uploadCourse = async (formData, token) => {
    try {
        // 1. Configurar los headers
        const headers = {
            // A. Header de Autenticación (si aplica)
            Authorization: `Bearer ${token}`,

            // B. MANEJO DEL Content-Type (PUNTO CLAVE DE ESTA TAREA)
            // Cuando se envía un objeto FormData, **NO** se debe establecer
            // el 'Content-Type' manualmente a 'multipart/form-data'.
            // Axios y el navegador lo establecen automáticamente con el boundary
            // correcto para manejar la carga de archivos.
            // Si lo estableces manualmente, el upload fallará.
        };

        // 2. Realizar la Petición POST
        const response = await axios.post(
            API_URL, // Endpoint de tu API
            formData, // El cuerpo de la petición es el objeto FormData
            { headers } // Se pasan los headers (sin Content-Type explícito)
        );

        return response.data;
    } catch (error) {
        // Manejo de errores de la petición
        console.error('Error al subir el curso:', error.response?.data || error.message);
        throw error;
    }
};  