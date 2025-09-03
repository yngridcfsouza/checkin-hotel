import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-blue-900 text-white mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e descrição */}
          <div className="flex flex-col items-center md:items-start">
            <div className="flex items-center space-x-2 mb-3">
              <Image
                src="/favicon.png"
                alt="Express.com Logo"
                width={140}
                height={140}
                className="object-contain"
              />
              <h2 className="text-xl font-bold text-primary-50">Express.com</h2>
            </div>
            <p className="text-sm text-blue-100 text-center md:text-left">
              Seu checkin online +rápido e +seguro. Simplifique sua experiência de hospedagem.
            </p>
          </div>

          {/* Links úteis */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 border-b border-primary pb-2">Links Úteis</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/" className="text-blue-100 hover:text-primary-200 transition-colors">
                Início
              </Link>
              <Link href="/register/guests" className="text-blue-100 hover:text-primary-200 transition-colors">
                Registro para Hóspedes
              </Link>
              <Link href="/register/hotels" className="text-blue-100 hover:text-primary-200 transition-colors">
                Registro para Hotéis
              </Link>
              <Link href="/auth/login" className="text-blue-100 hover:text-primary-200 transition-colors">
                Entrar
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-lg font-semibold mb-4 border-b border-primary pb-2">Contato</h3>
            <div className="flex flex-col space-y-2">
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                contato@express.com
              </p>
              <p className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (11) 9999-9999
              </p>
            </div>
          </div>
        </div>

        {/* Direitos autorais */}
        <div className="border-t border-blue-800 mt-8 pt-6 text-center text-sm text-blue-200">
          <p>© {currentYear} Express.com. Todos os direitos reservados.</p>
          <div className="mt-2 flex justify-center space-x-4">
            <Link href="/termos" className="hover:text-primary-200 transition-colors">
              Termos de Uso
            </Link>
            <Link href="/privacidade" className="hover:text-primary-200 transition-colors">
              Política de Privacidade
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
