import React, { useState } from 'react';
import AuthForm from './AuthForm.jsx'; // Importamos el componente base de estilo, ahora con extensión explícita

const Login = ({ onSwitchToRegister }) => {
  // Estados para simular la lógica de autenticación
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  /**
   * Simula el envío de datos de inicio de sesión.
   */
  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setIsError(false);

    // Simulación de API call
    setTimeout(() => {
      // NOTA: Se ha reemplazado alert() por una notificación de consola, siguiendo las restricciones del entorno.
      if (email === 'test@example.com' && password === 'password') {
        console.log('Inicio de sesión exitoso (Simulado)');
      } else {
        setIsError(true);
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthForm
      title="Iniciar Sesión"
      submitButtonText="Acceder a la Plataforma"
      switchText="¿Eres nuevo aquí?"
      switchLink="Crear una cuenta"
      onSwitch={onSwitchToRegister}
      onSubmit={handleLogin}
      isLoading={isLoading}
      isError={isError}
    >
      {/* Campo de Correo Electrónico */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Correo Electrónico
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          placeholder="ejemplo@plataforma.com"
          disabled={isLoading}
        />
      </div>

      {/* Campo de Contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          placeholder="••••••••"
          disabled={isLoading}
        />
      </div>
      
      {/* Espacio para "Olvidé mi contraseña" (opcional) */}
      <div className="flex justify-end">
        <a href="#" className="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition duration-150">
          ¿Olvidaste tu contraseña?
        </a>
      </div>

    </AuthForm>
  );
};

export default Login;
