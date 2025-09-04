import Link from 'next/link';
import Image from 'next/image';

export function HeroBanner() {
  return (
    <div className="bg-gradient-to-r from-primary to-blue-800 py-16">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <p className="text-xl md:text-2xl mb-6 text-blue-[#1c398e] font-semibold">Antecipe seu Check-in de forma rápida e segura</p>
          <p className="text-lg mb-8 text-blue-[#1c398e] max-w-md">
            Simplifique sua experiência de hospedagem antes mesmo de sair de casa, evite filas e aproveite ao máximo sua estadia.
          </p>
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <Link
              href="/dashboard"
              className="text-primary border-2 border-primary  hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center shadow-hover"
            >
              Já tenho uma reserva
            </Link>
            <Link
              href="/search-hotels"
              className="bg-transparent border-2 border-primary text-primary hover:bg-blue-50 px-6 py-3 rounded-md font-medium transition-colors duration-300 text-center"
            >
              Quero reservar um hotel
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-md h-64 md:h-80">
            <Image
              src="/logo.png"
              alt="Express.com"
              fill
              className="object-contain drop-shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
