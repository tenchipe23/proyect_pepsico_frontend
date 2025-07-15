'use client';

import { FileText, LogIn } from "lucide-react";
import { OptionCard } from "@/components/welcome/OptionCard";

export default function WelcomePage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Bienvenido a PepsiCo</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Sistema de gestión de pases de salida
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
          <OptionCard
            title="Solicitar Pase"
            description="Crea una nueva solicitud de pase de salida"
            href="/solicitar"
            buttonText="Ir a solicitud"
            icon={<FileText className="h-6 w-6 text-blue-600 dark:text-blue-300" />}
          />

          <OptionCard
            title="Iniciar Sesión"
            description="Accede a tu cuenta para gestionar tus pases"
            href="/login"
            buttonText="Iniciar sesión"
            icon={<LogIn className="h-6 w-6 text-blue-600 dark:text-blue-300" />}
          />
        </div>

        <footer className="mt-16 text-center text-blue-100 text-sm">
          <p>© {new Date().getFullYear()} PepsiCo. Todos los derechos reservados.</p>
        </footer>
      </div>
    </div>
  );
}