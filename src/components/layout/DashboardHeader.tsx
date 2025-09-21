'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { BrazilFlag, USAFlag, SpainFlag, MenuIcon } from '../icons';
import { ChevronDownIcon, UserIcon, CogIcon, DocumentTextIcon, CalendarIcon, CheckIcon, StarIcon, HeartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import { Button } from '@/components/ui/button';

interface DashboardHeaderProps {
  user?: {
    name?: string;
    firstName?: string;
    email?: string;
    avatar?: string;
  };
  onLogout?: () => void;
}

export default function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  const [language, setLanguage] = useState('pt-BR');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

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

  // Fecha o menu de perfil quando clica fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  const changeLanguage = (lang: string) => {
    setLanguage(lang);
    // Aqui você implementaria a lógica para mudar o idioma da aplicação
  };

  const getUserDisplayName = () => {
    if (user?.firstName) return user.firstName;
    if (user?.name) return user.name.split(' ')[0];
    return 'Usuário';
  };

  const profileMenuItems = [
    { icon: UserIcon, label: 'Minha Conta', href: '/dashboard/account' },
    { icon: CogIcon, label: 'Meus Dados', href: '/dashboard/profile' },
    { icon: DocumentTextIcon, label: 'Minhas Reservas', href: '/dashboard/reservations' },
    { icon: CheckIcon, label: 'Meus Check-ins', href: '/dashboard/checkins' },
    { icon: StarIcon, label: 'Avaliações', href: '/dashboard/reviews' },
    { icon: HeartIcon, label: 'Favoritos', href: '/dashboard/favorites' },
  ];

  return (
    <header className={`bg-white fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/dashboard" className="flex items-center mx-4">
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

          <Link href="/register/hotels" className="flex text-center w-fit px-2 py-2 text-blue-900 rounded-md hover:bg-blue-800 hover:text-white text-sm transition-colors border border-blue-900">
            Registre sua propriedade
          </Link>

          {/* Menu de Perfil */}
          <div className="relative" ref={profileMenuRef}>
            <Button
              onClick={toggleProfileMenu}
              className="flex items-center space-x-2"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5" />
              )}
              <span>{getUserDisplayName()}</span>
              <ChevronDownIcon className={`w-4 h-4 transition-transform ${profileMenuOpen ? 'rotate-180' : ''}`} />
            </Button>

            {/* Dropdown do Menu de Perfil */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                {profileMenuItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
                <hr className="my-1 border-gray-200" />
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onLogout?.();
                  }}
                  className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <ArrowRightOnRectangleIcon className="w-4 h-4" />
                  <span>Sair</span>
                </button>
              </div>
            )}
          </div>
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

          <Link href="/register/hotels" className="px-4 py-2 text-blue-900 rounded-md hover:bg-blue-900 hover:text-white text-sm transition-colors border border-blue-900 text-center">
            Registre sua propriedade
          </Link>

          {/* Menu de Perfil Mobile */}
          <div className="border-t pt-4">
            <div className="flex items-center space-x-3 px-4 py-2 mb-2">
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt="Avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 bg-blue-900 rounded-full flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <span className="font-medium text-gray-900">{getUserDisplayName()}</span>
            </div>

            {profileMenuItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className="flex items-center space-x-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-900 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onLogout?.();
              }}
              className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors mt-2 border-t pt-2"
            >
              <ArrowRightOnRectangleIcon className="w-4 h-4" />
              <span>Sair</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}