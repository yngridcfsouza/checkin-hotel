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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Bem-vindo, {user.name}!
                </h1>
                <p className="text-gray-600">
                  {user.role === 'GUEST' ? 'Encontre seu hotel e faça o check-in de forma rápida e segura.' : 'Gerencie seu estabelecimento e acompanhe os check-ins.'}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm text-gray-500">Logado como</p>
                  <p className="font-medium">{user.email}</p>
                  <p className="text-xs text-gray-400 capitalize">{user.role.toLowerCase()}</p>
                </div>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  Sair
                </Button>
              </div>
            </div>
          </div>

          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Buscar Meu Hotel</h2>
            <form onSubmit={handleHotelSearch} className="space-y-4">
              <div>
                <Label htmlFor="hotel-search">Nome do Hotel</Label>
                <Input
                  id="hotel-search"
                  type="text"
                  placeholder="Digite o nome do seu hotel..."
                  value={hotelSearch}
                  onChange={(e) => setHotelSearch(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button
                type="submit"
                disabled={isSearching || !hotelSearch.trim()}
                className="w-full sm:w-auto flex items-center justify-center gap-2"
              >
                {isSearching && <LoadingSpinner size="sm" />}
                {isSearching ? 'Buscando...' : 'Buscar Hotel'}
              </Button>
            </form>
          </Card>

          {searchResults.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Resultados da Busca</h3>
              {searchResults.map((hotel) => (
                <Card key={hotel.id} className="p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="mb-4 sm:mb-0">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {hotel.name}
                      </h4>
                      <p className="text-gray-600">{hotel.address}</p>
                      <p className="text-gray-600">{hotel.city}</p>
                      <div className="flex items-center mt-2">
                        <span className="text-yellow-500">★</span>
                        <span className="ml-1 text-sm text-gray-600">
                          {hotel.rating}/5
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      {hotel.checkInAvailable ? (
                        <>
                          <Button
                            onClick={() => handleCheckIn(hotel.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Fazer Check-in
                          </Button>
                          <span className="text-sm text-green-600 text-center">
                            ✓ Check-in disponível
                          </span>
                        </>
                      ) : (
                        <>
                          <Button disabled className="bg-gray-400">
                            Check-in Indisponível
                          </Button>
                          <span className="text-sm text-red-600 text-center">
                            ✗ Fora do horário
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Não encontrou seu hotel?
            </p>
            <Link
              href="/search-hotels"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Buscar hospedagem em nossa plataforma
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
