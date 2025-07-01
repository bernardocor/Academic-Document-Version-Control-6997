import React, { useState } from 'react';
import { motion } from 'framer-motion';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const AuthScreen = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left side - Branding */}
          <motion.div
            className="text-center lg:text-left"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                Doc<span className="text-primary-600">Version</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Control de versiones profesional para documentos académicos
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-2 rounded-lg mt-1">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Gestión de Versiones</h3>
                  <p className="text-gray-600">Controla cada cambio en tus documentos académicos con precisión profesional</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-2 rounded-lg mt-1">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Registro de Prompts</h3>
                  <p className="text-gray-600">Documenta todos los prompts de IA utilizados en tu proceso de investigación</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary-100 p-2 rounded-lg mt-1">
                  <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Repositorio de Archivos</h3>
                  <p className="text-gray-600">Organiza y gestiona todos los archivos relacionados con tus proyectos</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/20">
              <p className="text-sm text-gray-600 italic">
                "La herramienta perfecta para mantener la trazabilidad completa de mi investigación doctoral. 
                Cada versión, cada prompt, cada archivo - todo perfectamente organizado."
              </p>
              <p className="text-sm font-medium text-gray-900 mt-2">
                - Dr. María González, Investigadora
              </p>
            </div>
          </motion.div>

          {/* Right side - Auth Form */}
          <div className="flex justify-center lg:justify-end">
            {isLoginMode ? (
              <LoginForm onSwitchToRegister={() => setIsLoginMode(false)} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setIsLoginMode(true)} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthScreen;