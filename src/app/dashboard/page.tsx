'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function DashboardPage() {
  const [hotelSearch, setHotelSearch] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard - Check-in Online
            </h1>
            <p className="text-gray-600">
              Encontre seu hotel e faça o check-in de forma rápida e segura.
            </p>
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
                className="w-full sm:w-auto"
              >
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