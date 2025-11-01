import React, { useState } from 'react';
import AuthForm from './AuthForm.jsx'; // Importación corregida con extensión explícita

const Register = ({ onSwitchToLogin }) => {
  // Estados para simular la lógica de registro
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState(false);

  /**
   * Simula el envío de datos de registro.
   */
  const handleRegister = (e) => {
    e.preventDefault();
    setIsError(false);
    setPasswordMatchError(false);

    if (password !== confirmPassword) {
      setPasswordMatchError(true);
      return;
    }

    setIsLoading(true);

    // Simulación de API call
    setTimeout(() => {
      // Simulación de éxito. NOTA: Reemplazado alert() por console.log()
      console.log('Registro exitoso (Simulado). Ahora puedes iniciar sesión.');
      onSwitchToLogin(); // Redirige automáticamente al Login
      setIsLoading(false);
    }, 1500);
  };

  return (
    <AuthForm
      title="Crear Nueva Cuenta"
      submitButtonText="Registrarme"
      switchText="¿Ya tienes una cuenta?"
      switchLink="Iniciar sesión"
      onSwitch={onSwitchToLogin}
      onSubmit={handleRegister}
      isLoading={isLoading}
      isError={isError}
    >
      {/* Campo de Nombre */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Nombre Completo
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          placeholder="Tu Nombre"
          disabled={isLoading}
        />
      </div>

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
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="appearance-none block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150"
          placeholder="Crea tu contraseña"
          disabled={isLoading}
        />
      </div>

      {/* Campo de Confirmar Contraseña */}
      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
          Confirmar Contraseña
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            setPasswordMatchError(false); // Limpiar error al escribir
          }}
          className={`appearance-none block w-full px-4 py-2 border ${passwordMatchError ? 'border-red-500' : 'border-gray-300'} rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150`}
          placeholder="Repite la contraseña"
          disabled={isLoading}
        />
        {passwordMatchError && (
          <p className="mt-2 text-sm text-red-600">Las contraseñas no coinciden.</p>
        )}
      </div>
    </AuthForm>
  );
};

export default Register;
