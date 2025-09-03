'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { BrazilFlag, USAFlag, SpainFlag, MenuIcon } from '../icons';

export default function Header() {
  const [language, setLanguage] = useState('pt-BR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detecta o scroll para adicionar sombra ao header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha o menu mobile quando a tela é redimensionada para desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Aqui você implementaria a lógica para mudar o idioma da aplicação
  };

  return (
    <header className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center mx-4">
          <Image
            src="/logo-resized.png"
            alt="Express.com Logo"
            width={100}
            height={30}
            className="object-contain"
          />
        </Link>

        {/* Menu para desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex space-x-2 mr-4 border-r pr-4">
            <button
              onClick={() => changeLanguage('pt-BR')}
              className={`p-1 rounded-full transition-all ${language === 'pt-BR' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
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

          <Link href="/register/hotels" className="flex text-center w-fit px-2 py-2 text-primary-900 rounded-md hover:bg-blue-800 hover:text-white text-sm transition-colors border border-primary-900">
            Registre sua propriedade
          </Link>
          <Link href="/register/guests" className="flex text-center w-fit px-2 py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-sm transition-colors">
            Login
          </Link>
          <Link href="/register" className="flex text-center w-fit px-2 py-2 bg-blue-900 text-white hover:bg-blue-800 rounded-md text-sm transition-colors">
            Cadastre-se
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
          <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col space-y-4 z-50">
            <div className="flex justify-center space-x-4 pb-4 border-b">
              <button
                onClick={() => changeLanguage('pt-BR')}
                className={`p-2 rounded-full transition-all ${language === 'pt-BR' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="Português"
                title="Português"
              >
                <BrazilFlag />
              </button>
              <button
                onClick={() => changeLanguage('en')}
                className={`p-2 rounded-full transition-all ${language === 'en' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="English"
                title="English"
              >
                <USAFlag />
              </button>
              <button
                onClick={() => changeLanguage('es')}
                className={`p-2 rounded-full transition-all ${language === 'es' ? 'bg-gray-200 scale-110' : 'hover:bg-gray-100'}`}
                aria-label="Español"
                title="Español"
              >
                <SpainFlag />
              </button>
            </div>
            <Link href="/register/hotels" className="px-4 py-2 text-primary-900 rounded-md hover:bg-blue-900 hover:text-white text-sm transition-colors border border-primary-900 text-center">
              Registre sua propriedade
            </Link>
            <Link href="/register/guests" className="px-4 py-2 bg-blue-800 text-white hover:bg-blue-900 rounded-md text-sm transition-colors text-center">
              Faça seu check-in online
            </Link>
            <Link href="/register" className="px-4 py-2 bg-blue-800 text-white hover:bg-blue-900 rounded-md text-sm transition-colors text-center">
              Cadastre-se
            </Link>
          </div>
        )}
      </header>
  );
}
