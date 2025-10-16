//import { useState } from 'react'
//import reactLogo from './assets/react.svg'
//import viteLogo from '/vite.svg'
//import './App.css'
import Quiz from './components/Quiz';

function App() {

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-center py-6 border-b border-gray-300 mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800">Plataforma E-Learning</h1>
        <p className="text-gray-500 mt-2 text-lg">Tarea 4.3: Componente de Quiz</p>
      </header>
      
      {/* *** LÍNEA CLAVE: Llama al componente Quiz ***
      */}
      <Quiz lessonId="mock-lesson-123" />
      
      <footer className="text-center text-sm text-gray-500 mt-12 py-4 border-t border-gray-300">
          Desarrollado con React y Tailwind CSS
      </footer>
    </div>
  )
}

export default App
