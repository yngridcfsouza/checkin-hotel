'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BrazilFlag, USAFlag, SpainFlag, MenuIcon } from '@/components/icons';

export default function RegisterHeader() {
  const [language, setLanguage] = useState('pt');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Aqui você pode implementar a lógica de mudança de idioma
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo e seletor de idioma */}
        <div className="flex items-center space-x-6">
          <Link href="/" className="flex items-center">
            <Image
              src="/logo-resized.png"
              alt="Express.com Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>

          {/* Seletor de idioma */}
          <div className="hidden md:flex items-center space-x-2">
            <button
              onClick={() => changeLanguage('pt')}
              className={`p-1 rounded-full transition-all ${language === 'pt' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
              aria-label="Português"
              title="Português"
            >
              <BrazilFlag />
            </button>
            <button
              onClick={() => changeLanguage('en')}
              className={`p-1 rounded-full transition-all ${language === 'en' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
              aria-label="English"
              title="English"
            >
              <USAFlag />
            </button>
            <button
              onClick={() => changeLanguage('es')}
              className={`p-1 rounded-full transition-all ${language === 'es' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
              aria-label="Español"
              title="Español"
            >
              <SpainFlag />
            </button>
          </div>
        </div>

        {/* Área de login - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <span className="text-gray-600 text-sm">Já tem uma conta?</span>
          <Link href="/login" className="flex text-center w-fit px-4 py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-sm transition-colors">
            Login
          </Link>
        </div>

        {/* Botão de menu mobile */}
        <button
          className="md:hidden"
          onClick={toggleMobileMenu}
          aria-label="Menu"
        >
          <MenuIcon />
        </button>
      </div>

      {/* Menu mobile */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 space-y-4">
            {/* Seletor de idioma mobile */}
            <div className="flex items-center justify-center space-x-4 pb-4 border-b border-gray-200">
              <button
                onClick={() => changeLanguage('pt')}
                className={`p-2 rounded-full transition-all ${language === 'pt' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="Português"
              >
                <BrazilFlag />
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`p-2 rounded-full transition-all ${language === 'en' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="English"
              >
                <USAFlag />
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`p-2 rounded-full transition-all ${language === 'es' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="Español"
              >
                <SpainFlag />
              </button>
            </div>

            {/* Login mobile */}
            <div className="text-center space-y-2">
              <p className="text-gray-600 text-sm">Já tem uma conta?</p>
              <Link href="/login" className="block w-full py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-sm transition-colors">
              Login
            </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
