'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface Hotel {
  id: number;
  name: string;
  address: string;
  city: string;
  rating: number;
  price: number;
  image: string;
  amenities: string[];
  bookingUrl: string;
  platform: string;
}

export default function SearchHotelsPage() {
  const [searchParams, setSearchParams] = useState({
    location: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    rooms: 1
  });
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchParams.location || !searchParams.checkIn || !searchParams.checkOut) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    // Simular busca de hotéis com diferentes plataformas
    setTimeout(() => {
      const mockHotels: Hotel[] = [
        {
          id: 1,
          name: 'Hotel Copacabana Palace',
          address: 'Av. Atlântica, 1702',
          city: searchParams.location,
          rating: 4.8,
          price: 450,
          image: '/hotel1.jpg',
          amenities: ['Wi-Fi', 'Piscina', 'Academia', 'Spa'],
          bookingUrl: 'https://booking.com/hotel1',
          platform: 'Booking.com'
        },
        {
          id: 2,
          name: 'Ibis Budget',
          address: 'Rua da Praia, 500',
          city: searchParams.location,
          rating: 4.2,
          price: 180,
          image: '/hotel2.jpg',
          amenities: ['Wi-Fi', 'Café da manhã'],
          bookingUrl: 'https://expedia.com/hotel2',
          platform: 'Expedia'
        },
        {
          id: 3,
          name: 'Luxury Resort & Spa',
          address: 'Av. Beira Mar, 1000',
          city: searchParams.location,
          rating: 4.9,
          price: 680,
          image: '/hotel3.jpg',
          amenities: ['Wi-Fi', 'Piscina', 'Academia', 'Spa', 'Restaurante', 'Bar'],
          bookingUrl: 'https://hotels.com/hotel3',
          platform: 'Hotels.com'
        }
      ];
      setHotels(mockHotels);
      setIsSearching(false);
    }, 2000);
  };

  const handleBooking = (hotel: Hotel) => {
    // Abrir em nova aba a plataforma de reserva
    window.open(hotel.bookingUrl, '_blank');
    
    // Salvar informações da reserva para posterior check-in
    localStorage.setItem('selectedHotel', JSON.stringify({
      hotelId: hotel.id,
      hotelName: hotel.name,
      platform: hotel.platform,
      bookingUrl: hotel.bookingUrl
    }));
    
    // Mostrar mensagem de instrução
    toast.info(`Você será redirecionado para ${hotel.platform}. Após fazer a reserva, volte para nossa plataforma para concluir o check-in.`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Buscar Hospedagem
            </h1>
            <p className="text-gray-600">
              Encontre o hotel perfeito para sua estadia com nosso comparador de preços.
            </p>
          </div>

          <Card className="p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="lg:col-span-2">
                  <Label htmlFor="location">Destino *</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Cidade, estado ou região"
                    value={searchParams.location}
                    onChange={(e) => setSearchParams({...searchParams, location: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="checkin">Check-in *</Label>
                  <Input
                    id="checkin"
                    type="date"
                    value={searchParams.checkIn}
                    onChange={(e) => setSearchParams({...searchParams, checkIn: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="checkout">Check-out *</Label>
                  <Input
                    id="checkout"
                    type="date"
                    value={searchParams.checkOut}
                    onChange={(e) => setSearchParams({...searchParams, checkOut: e.target.value})}
                    className="mt-1"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="guests">Hóspedes</Label>
                  <Input
                    id="guests"
                    type="number"
                    min="1"
                    max="10"
                    value={searchParams.guests}
                    onChange={(e) => setSearchParams({...searchParams, guests: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rooms">Quartos</Label>
                  <Input
                    id="rooms"
                    type="number"
                    min="1"
                    max="5"
                    value={searchParams.rooms}
                    onChange={(e) => setSearchParams({...searchParams, rooms: parseInt(e.target.value)})}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                disabled={isSearching}
                className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2"
              >
                {isSearching && <LoadingSpinner size="sm" />}
                {isSearching ? 'Buscando hotéis...' : 'Buscar Hotéis'}
              </Button>
            </form>
          </Card>

          {isSearching && (
            <div className="text-center py-8">
              <LoadingSpinner size="lg" className="mx-auto" />
              <p className="mt-2 text-gray-600">Comparando preços nas melhores plataformas...</p>
            </div>
          )}

          {hasSearched && !isSearching && hotels.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  {hotels.length} hotéis encontrados em {searchParams.location}
                </h2>
                <p className="text-sm text-gray-600">
                  Preços para {searchParams.guests} hóspede(s), {searchParams.rooms} quarto(s)
                </p>
              </div>
              
              <div className="grid gap-6">
                {hotels.map((hotel) => (
                  <Card key={hotel.id} className="p-6">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="lg:w-1/4">
                        <div className="w-full h-48 bg-gray-200 rounded-lg flex items-center justify-center">
                          <span className="text-gray-500">Foto do Hotel</span>
                        </div>
                      </div>
                      
                      <div className="lg:w-2/4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-semibold text-gray-900">
                            {hotel.name}
                          </h3>
                          <div className="flex items-center">
                            <span className="text-yellow-500">★</span>
                            <span className="ml-1 text-sm font-medium">
                              {hotel.rating}/5
                            </span>
                          </div>
                        </div>
                        
                        <p className="text-gray-600 mb-3">
                          {hotel.address}, {hotel.city}
                        </p>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, index) => (
                            <span 
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                            >
                              {amenity}
                            </span>
                          ))}
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          Via {hotel.platform}
                        </p>
                      </div>
                      
                      <div className="lg:w-1/4 flex flex-col justify-between">
                        <div className="text-right mb-4">
                          <p className="text-2xl font-bold text-gray-900">
                            R$ {hotel.price}
                          </p>
                          <p className="text-sm text-gray-600">
                            por noite
                          </p>
                        </div>
                        
                        <Button 
                          onClick={() => handleBooking(hotel)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          Reservar Agora
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              <Card className="p-6 bg-blue-50 border-blue-200">
                <div className="text-center">
                  <h3 className="text-lg font-semibold text-blue-900 mb-2">
                    📱 Lembre-se do Check-in Online!
                  </h3>
                  <p className="text-blue-800 mb-4">
                    Após fazer sua reserva, volte para nossa plataforma para fazer o check-in antecipado e evitar filas no hotel.
                  </p>
                  <Button 
                    onClick={() => window.location.href = '/dashboard'}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Ir para Check-in Online
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {hasSearched && !isSearching && hotels.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Nenhum hotel encontrado para os critérios selecionados.
              </p>
              <p className="text-sm text-gray-500">
                Tente ajustar suas datas ou localização.
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}