"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RegisterLayout from "@/components/layout/RegisterLayout";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGuestRegistration = () => {
    setLoading(true);
    router.push("/register/guests");
  };

  const handleHotelRegistration = () => {
    setLoading(true);
    router.push("/register/hotels");
  };

  return (
    <RegisterLayout>
      <div className="min-h-[80vh] flex items-center justify-center bg-gray-50">
        <div className="bg-white p-16 rounded-2xl shadow-md w-full max-w-md space-y-6">
          <h1 className="text-2xl text-center font-bold text-blue-900">Junte-se a nós</h1>
          <p className="text-gray-700 text-center">Escolha como deseja se cadastrar:</p>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <button
            onClick={handleGuestRegistration}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-[#275f8c] hover:bg-blue-50 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-900 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            <span className="font-medium text-[#0a293f]">Sou Hóspede</span>
            <span className="text-xs text-gray-500 text-center mt-1">
              Procuro hotéis para me hospedar
            </span>
          </button>

          <button
            onClick={handleHotelRegistration}
            disabled={loading}
            className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:border-[#275f8c] hover:bg-blue-50 transition-all"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-blue-900 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <span className="font-medium text-[#0a293f]">Sou Hotel</span>
            <span className="text-xs text-gray-500 text-center mt-1">
              Quero cadastrar meu estabelecimento
            </span>
          </button>
          </div>

          {/* Link para login */}
          <div className="flex justify-center text-center pt-4 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">Já se registrou</p>
            <Link
              href="/auth/magic"
              className="text-blue-900 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              <span>? Acesse sua conta</span>
            </Link>
          </div>
        </div>
      </div>
    </RegisterLayout>
  );
}
