import React, { useState } from 'react';
import { CheckCircle, Clock, Send } from 'lucide-react';

// --- MOCK DATA ---
// Datos de ejemplo para simular un cuestionario real
const mockQuiz = {
  title: 'Quiz: Introducción a MERN Stack',
  durationMinutes: 10,
  questions: [
    {
      id: 1,
      text: '¿Qué componente del stack MERN se encarga del almacenamiento de datos?',
      options: ['React.js', 'Express.js', 'MongoDB', 'Node.js'],
      correctAnswer: 'MongoDB', // Esto no se usaría en producción en el frontend por seguridad, es solo para la simulación
    },
    {
      id: 2,
      text: '¿Qué hook de React usarías para gestionar las opciones seleccionadas por el usuario?',
      options: ['useReducer', 'useContext', 'useState', 'useEffect'],
      correctAnswer: 'useState',
    },
    {
      id: 3,
      text: '¿Qué librería es la capa V (Vista) en el MERN Stack?',
      options: ['Node.js', 'Express.js', 'React.js', 'Mongoose'],
      correctAnswer: 'React.js',
    },
    // Añade más preguntas según necesites...
  ],
};

const Quiz = ({ lessonId }) => {
  // Estado 1: Almacena las respuestas seleccionadas por el usuario
  // Estructura: { questionId: selectedOption }
  const [userAnswers, setUserAnswers] = useState({});
  
  // Estado 2: Controla si el usuario ya presionó Enviar
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Estado 3: Manejo de carga
  const [isLoading, setIsLoading] = useState(false);
  
  // Estado 4: Almacena los resultados (puntuación)
  const [score, setScore] = useState(null);

  /**
   * Maneja la selección de una opción para una pregunta específica.
   */
  const handleOptionChange = (questionId, selectedOption) => {
    // Si ya se envió el quiz, no permitimos más cambios
    if (isSubmitted) return; 

    setUserAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  /**
   * Procesa las respuestas y simula el envío al backend.
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isSubmitted) return; 

    // 1. Marcar como cargando (futuro: llamada a la API)
    setIsLoading(true);

    // 2. Simulación de la lógica de puntuación (Debería hacerse en el BE por seguridad)
    let calculatedScore = 0;
    mockQuiz.questions.forEach(q => {
      if (userAnswers[q.id] === q.correctAnswer) {
        calculatedScore += 1; // Un punto por respuesta correcta
      }
    });

    // 3. Simulación de la respuesta del backend
    setTimeout(() => {
      setScore(calculatedScore);
      setIsSubmitted(true);
      setIsLoading(false);
    }, 1500);
  };

  // --- Variables Derivadas ---

  const totalQuestions = mockQuiz.questions.length;
  const questionsAnswered = Object.keys(userAnswers).length;
  const isComplete = questionsAnswered === totalQuestions;

  // --- Renderizado del Quiz ---

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl my-8 border border-gray-200">
      <h1 className="text-3xl font-extrabold text-indigo-700 mb-2">{mockQuiz.title}</h1>
      <div className="flex justify-between items-center text-gray-600 mb-6 border-b pb-3">
        <p className="flex items-center text-sm">
          <Clock size={16} className="mr-1 text-indigo-500" />
          Duración: {mockQuiz.durationMinutes} minutos
        </p>
        <p className="text-sm">
          Respondidas: <span className="font-bold">{questionsAnswered}</span> / {totalQuestions}
        </p>
      </div>

      {isSubmitted && (
        <div className="p-4 mb-6 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-lg shadow-md">
          <p className="font-semibold text-xl flex items-center">
            <CheckCircle size={24} className="mr-3" /> 
            ¡Cuestionario Finalizado!
          </p>
          <p className="mt-2 text-lg">Tu puntuación final es: <span className="font-extrabold text-2xl">{score} / {totalQuestions}</span>.</p>
        </div>
      )}

      {/* Formulario de Preguntas */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {mockQuiz.questions.map((question, index) => (
          <div key={question.id} className={`p-5 border rounded-lg transition-shadow duration-300 ${isSubmitted ? 'bg-gray-50' : 'hover:shadow-lg'}`}>
            <h3 className="font-semibold text-lg mb-4 text-gray-800">
              {index + 1}. {question.text}
            </h3>
            
            <div className="space-y-3">
              {question.options.map(option => (
                <label 
                  key={option} 
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-all border-2 
                    ${
                      isSubmitted 
                        ? (option === question.correctAnswer ? 'bg-green-100 border-green-500 text-green-900 font-medium' : (userAnswers[question.id] === option ? 'bg-red-100 border-red-500 text-red-900' : 'bg-white border-gray-200'))
                        : (userAnswers[question.id] === option ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-inner' : 'bg-white border-gray-200 hover:bg-gray-100')
                    }`}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={userAnswers[question.id] === option}
                    onChange={() => handleOptionChange(question.id, option)}
                    className="mr-3 h-5 w-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
                    disabled={isSubmitted || isLoading}
                  />
                  <span className="text-base">{option}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
        
        {/* Botón de Envío */}
        <div className="pt-6 flex justify-center">
          <button
            type="submit"
            disabled={!isComplete || isSubmitted || isLoading}
            className={`flex items-center justify-center px-10 py-3 text-lg font-medium rounded-full text-white transition duration-300 transform shadow-xl 
              ${!isComplete || isSubmitted || isLoading
                ? 'bg-gray-400 cursor-not-allowed opacity-75'
                : 'bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 hover:scale-[1.02]'
              }`}
          >
            {isLoading ? (
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : (
              <>
                <Send size={20} className="mr-2" />
                {isSubmitted ? 'Enviado' : 'Enviar Respuestas'}
              </>
            )}
          </button>
        </div>
      </form>
      
      {!isComplete && !isSubmitted && (
        <p className="text-center mt-4 text-sm text-red-600 font-medium p-2 bg-red-50 rounded">
          <span className="font-bold">Advertencia:</span> Debes responder todas las preguntas ({totalQuestions - questionsAnswered} restantes) para poder enviar el cuestionario.
        </p>
      )}
    </div>
  );
};

export default Quiz;
