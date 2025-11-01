import React from 'react';

/**
 * Componente contenedor de estilo para los formularios de autenticación (Login/Register).
 * Proporciona el diseño responsive, centrado y estilizado con tarjeta.
 *
 * @param {object} props
 * @param {string} props.title - Título del formulario (Ej: "Iniciar Sesión").
 * @param {React.ReactNode} props.children - Los campos e inputs específicos (Login o Register).
 * @param {string} props.switchText - Texto de enlace para cambiar de modo.
 * @param {string} props.switchLink - Texto del enlace para cambiar de modo (Ej: "¿No tienes cuenta?").
 * @param {function} props.onSwitch - Función de manejo del cambio de formulario.
 * @param {string} props.submitButtonText - Texto del botón principal.
 */
const AuthForm = ({ title, children, switchText, switchLink, onSwitch, submitButtonText, onSubmit, isLoading, isError }) => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {/* Contenedor principal del formulario (Tarjeta) */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-2xl border border-gray-200">
        
        {/* Encabezado */}
        <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-6 border-b pb-3">
          {title}
        </h2>
        
        {/* Mensaje de Error General (Visible si isError es true) */}
        {isError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm font-medium" role="alert">
            Hubo un error al procesar la solicitud. Inténtalo de nuevo.
          </div>
        )}

        {/* Formulario (Contiene los children: inputs y botones específicos) */}
        <form onSubmit={onSubmit} className="space-y-6">
          {children}
          
          {/* Botón de Envío */}
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-semibold text-white transition duration-300 ease-in-out transform 
              ${isLoading 
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              }`}
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 mr-3 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              submitButtonText
            )}
          </button>
        </form>

        {/* Enlace de Alternancia (Login <-> Register) */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            {switchText}
            <button
              type="button"
              onClick={onSwitch}
              className="ml-1 font-semibold text-indigo-600 hover:text-indigo-800 transition duration-150 ease-in-out focus:outline-none"
            >
              {switchLink}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
