'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { toast } from 'sonner';
import DashboardHeader from '@/components/layout/DashboardHeader';
import {
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
  StarIcon,
  DocumentTextIcon,
  HeartIcon,
  CogIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hotelSearch, setHotelSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/me');

      if (!res.ok) {
        router.push('/register');
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/register');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      toast.success('Logout realizado com sucesso!');
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleHotelSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hotelSearch.trim()) return;

    setIsSearching(true);
    // Simular busca de hotel
    setTimeout(() => {
      const mockResults = [
        {
          id: 1,
          name: hotelSearch,
          address: 'Rua das Flores, 123 - Centro',
          city: 'São Paulo',
          rating: 4.5,
          checkInAvailable: true
        }
      ];
      setSearchResults(mockResults);
      setIsSearching(false);
    }, 1500);
  };

  const handleCheckIn = (hotelId: number) => {
    // Redirecionar para o processo de check-in
    window.location.href = `/checkin/${hotelId}`;
  };

  return (
    <>
      <DashboardHeader user={user} onLogout={handleLogout} />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 pt-20">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">

            {/* Hero Section */}
            <div className="mb-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="mb-6 lg:mb-0">
                    <h1 className="text-4xl font-bold text-gray-900 mb-3">
                      Olá, {user?.name}! 👋
                    </h1>
                    <p className="text-xl text-gray-600 mb-4">
                      {user?.role === 'GUEST'
                        ? 'Pronto para sua próxima hospedagem?'
                        : 'Gerencie seu estabelecimento com facilidade'
                      }
                    </p>
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>Último acesso: hoje às {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <CalendarIcon className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-600">3</div>
                      <div className="text-xs text-blue-600">Reservas Ativas</div>
                    </div>

                    <div className="bg-green-50 rounded-xl p-4 text-center">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <StarIcon className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-600">4.8</div>
                      <div className="text-xs text-green-600">Avaliação Média</div>
                    </div>

                    <div className="bg-purple-50 rounded-xl p-4 text-center col-span-2 lg:col-span-1">
                      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                        <HeartIcon className="w-4 h-4 text-purple-600" />
                      </div>
                      <div className="text-2xl font-bold text-purple-600">12</div>
                      <div className="text-xs text-purple-600">Hotéis Favoritos</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">

              {/* Buscar Hotel */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Buscar Hotel</h3>
                <p className="text-sm text-gray-600 mb-4">Encontre e faça check-in no seu hotel</p>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Buscar Agora
                </Button>
              </Card>

              {/* FNRH */}
              {user?.role === 'GUEST' && (
                <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                      <DocumentTextIcon className="w-6 h-6 text-green-600" />
                    </div>
                    <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Meus Dados</h3>
                  <p className="text-sm text-gray-600 mb-4">Gerencie sua FNRH e informações</p>
                  <Link href="/dashboard/fnrh">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Verificar Dados
                    </Button>
                  </Link>
                </Card>
              )}

              {/* Minhas Reservas */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                    <CalendarIcon className="w-6 h-6 text-purple-600" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Minhas Reservas</h3>
                <p className="text-sm text-gray-600 mb-4">Acompanhe suas hospedagens</p>
                <Link href="/dashboard/reservations">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Ver Reservas
                  </Button>
                </Link>
              </Card>

              {/* Configurações */}
              <Card className="p-6 hover:shadow-lg transition-all duration-300 border-0 bg-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center">
                    <CogIcon className="w-6 h-6 text-gray-600" />
                  </div>
                  <ArrowRightIcon className="w-5 h-5 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Configurações</h3>
                <p className="text-sm text-gray-600 mb-4">Personalize sua conta</p>
                <Link href="/dashboard/profile">
                  <Button variant="outline" className="w-full">
                    Configurar
                  </Button>
                </Link>
              </Card>
            </div>

            {/* FNRH Information Card - Only for Guests */}
            {user?.role === 'GUEST' && (
              <Card className="p-8 mb-8 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-white">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-6 lg:mb-0">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                        <DocumentTextIcon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900">Ficha Nacional de Registro de Hóspedes</h2>
                        <p className="text-gray-600">Mantenha seus dados atualizados para check-ins mais rápidos</p>
                      </div>
                    </div>

                    <div className="bg-blue-100 rounded-xl p-6 mb-4">
                      <div className="flex items-start mb-3">
                        <div className="w-6 h-6 bg-blue-200 rounded-lg flex items-center justify-center mr-3 mt-0.5">
                          <span className="text-blue-700 text-sm font-bold">!</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-blue-800 mb-2">Por que é importante?</h4>
                          <p className="text-sm text-blue-700 leading-relaxed">
                            A FNRH é obrigatória por lei e contém informações essenciais para sua hospedagem.
                            Ao manter seus dados atualizados, você agiliza o processo de check-in em qualquer hotel.
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                        <span className="text-green-600 text-xs">✓</span>
                      </div>
                      <span>Dados seguros e criptografados</span>
                    </div>
                  </div>

                  <div className="lg:ml-8">
                    <Link href="/dashboard/fnrh">
                      <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 text-lg">
                        Verificar Meus Dados
                      </Button>
                    </Link>
                    <p className="text-xs text-gray-500 text-center mt-2">
                      Cadastre ou edite suas informações
                    </p>
                  </div>
                </div>
              </Card>
            )}

            {/* Hotel Search Section */}
            <Card className="p-8 mb-8 bg-white shadow-lg border-0">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mr-4">
                  <MagnifyingGlassIcon className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Buscar Meu Hotel</h2>
                  <p className="text-gray-600">Digite o nome do hotel onde você está hospedado</p>
                </div>
              </div>

              <form onSubmit={handleHotelSearch} className="space-y-6">
                <div className="relative">
                  <Label htmlFor="hotel-search" className="text-sm font-medium text-gray-700 mb-2 block">
                    Nome do Hotel
                  </Label>
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="hotel-search"
                      type="text"
                      placeholder="Ex: Hotel Copacabana Palace, Ibis, Marriott..."
                      value={hotelSearch}
                      onChange={(e) => setHotelSearch(e.target.value)}
                      className="pl-10 py-3 text-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    type="submit"
                    disabled={isSearching || !hotelSearch.trim()}
                    size="lg"
                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
                  >
                    {isSearching && <LoadingSpinner size="sm" className="mr-2" />}
                    {isSearching ? 'Buscando...' : 'Buscar Hotel'}
                  </Button>

                  <Link href="/search-hotels">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto px-8 py-3 text-lg">
                      <PlusIcon className="w-5 h-5 mr-2" />
                      Buscar Hospedagem
                    </Button>
                  </Link>
                </div>
              </form>
            </Card>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-6 mb-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Resultados da Busca</h3>
                  <span className="text-sm text-gray-500">{searchResults.length} hotel(s) encontrado(s)</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {searchResults.map((hotel) => (
                    <Card key={hotel.id} className="p-6 hover:shadow-xl transition-all duration-300 border-0 bg-white">
                      <div className="flex flex-col h-full">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 mb-2">
                              {hotel.name}
                            </h4>
                            <div className="space-y-1 mb-3">
                              <div className="flex items-center text-gray-600">
                                <MapPinIcon className="w-4 h-4 mr-2" />
                                <span className="text-sm">{hotel.address}</span>
                              </div>
                              <div className="flex items-center text-gray-600">
                                <MapPinIcon className="w-4 h-4 mr-2" />
                                <span className="text-sm">{hotel.city}</span>
                              </div>
                            </div>

                            <div className="flex items-center mb-4">
                              <div className="flex items-center bg-yellow-50 rounded-lg px-3 py-1">
                                <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                <span className="text-sm font-semibold text-yellow-700">
                                  {hotel.rating}/5
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="mt-auto">
                          {hotel.checkInAvailable ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center bg-green-50 rounded-lg p-3">
                                <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-green-600 text-xs">✓</span>
                                </div>
                                <span className="text-sm font-medium text-green-700">
                                  Check-in disponível agora
                                </span>
                              </div>
                              <Button
                                onClick={() => handleCheckIn(hotel.id)}
                                size="lg"
                                className="w-full bg-green-600 hover:bg-green-700 text-white"
                              >
                                <CalendarIcon className="w-5 h-5 mr-2" />
                                Fazer Check-in
                              </Button>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center bg-red-50 rounded-lg p-3">
                                <div className="w-5 h-5 bg-red-100 rounded-full flex items-center justify-center mr-2">
                                  <span className="text-red-600 text-xs">✗</span>
                                </div>
                                <span className="text-sm font-medium text-red-700">
                                  Check-in indisponível no momento
                                </span>
                              </div>
                              <Button disabled size="lg" className="w-full bg-gray-300 text-gray-500">
                                <ClockIcon className="w-5 h-5 mr-2" />
                                Fora do horário
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Help Section */}
            <Card className="p-8 bg-gradient-to-r from-gray-50 to-blue-50 border-0">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MagnifyingGlassIcon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  Não encontrou seu hotel?
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Explore nossa plataforma e descubra as melhores opções de hospedagem para sua próxima viagem.
                </p>
                <Link href="/search-hotels">
                  <Button size="lg" variant="outline" className="px-8 py-3 text-lg border-blue-200 hover:bg-blue-50">
                    <PlusIcon className="w-5 h-5 mr-2" />
                    Buscar Hospedagem
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
