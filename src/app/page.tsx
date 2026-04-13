import { HeroBanner } from '@/components/ui/hero-banner';
import { CardFeature } from '@/components/ui/card-feature';

export default function Home() {
  return (
    <div>
      <HeroBanner />

      {/* Seção de recursos */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Por que escolher o Express.com?</h2>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Imagem à esquerda - 1/2 da tela */}
            <div className="lg:w-1/2">
              <img 
                src="/usando-app.png" 
                alt="Casal usando o aplicativo Express.com para check-in" 
                className="w-full h-auto rounded-lg shadow-lg"
              />
            </div>

            {/* Cards à direita - 1/2 da tela */}
            <div className="lg:w-1/2 space-y-8">
              <CardFeature
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
                title="Check-in Rápido"
                description="Economize tempo com nosso processo de check-in digital. Sem filas, sem espera."
              />

              <CardFeature
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                }
                title="Segurança Garantida"
                description="Seus dados estão protegidos com nossa tecnologia de criptografia avançada."
              />

              <CardFeature
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                }
                title="Experiência Simplificada"
                description="Interface intuitiva e fácil de usar, projetada para todos os tipos de usuários."
              />
            </div>
          </div>
        </div>
      </section>

      {/* Seção dos problemas do check-in tradicional */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Cansado do Check-in Tradicional?
          </h2>
          
          {/* Primeira linha - Filas intermináveis */}
          <div className="flex flex-col lg:flex-row items-center mb-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center text-gray-500 text-lg font-medium">
                <img 
                  src="/fila-cansativa.png" 
                  alt="Fila com crianças e adultos esperando para serem atendidos em uma recepção de hotel" 
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Filas Intermináveis na Recepção
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Você chega cansado da viagem e ainda precisa enfrentar longas filas na recepção do hotel. 
                Minutos preciosos perdidos quando você só quer descansar.
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-red-600">Tempo perdido:</span> Em média 15-30 minutos na fila
              </p>
            </div>
          </div>

          {/* Segunda linha - Papelada e burocracia */}
          <div className="flex flex-col lg:flex-row-reverse items-center mb-16">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center text-gray-500 text-lg font-medium">
                <img 
                  src="/papelada.png" 
                  alt="Pessoas preenchendo formulários físicos na recepção de um hotel"
                  className="w-full h-auto rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pr-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Papelada e Formulários Intermináveis
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Preencher formulários físicos, assinar documentos, fornecer os mesmos dados repetidas vezes. 
                Um processo burocrático que deveria ser simples.
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-red-600">Estresse desnecessário:</span> Formulários confusos e repetitivos
              </p>
            </div>
          </div>

          {/* Terceira linha - Horários limitados */}
          <div className="flex flex-col lg:flex-row items-center mb-12">
            <div className="lg:w-1/2 mb-8 lg:mb-0">
              <div className="bg-gray-200 rounded-lg h-80 flex items-center justify-center text-gray-500 text-lg font-medium overflow-hidden">
                <img
                  src="/relogio.png"
                  alt="Relógio indicando horários limitados de check-in em hotelaria tradicional"
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
            <div className="lg:w-1/2 lg:pl-12">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">
                Limitado aos Horários da Recepção
              </h3>
              <p className="text-lg text-gray-600 mb-4">
                Chegou fora do horário? Precisa esperar até a recepção abrir ou pagar taxas extras. 
                Sua viagem não deveria depender do horário de funcionamento do hotel.
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold text-red-600">Inflexibilidade:</span> Horários rígidos que não se adaptam a você
              </p>
            </div>
          </div>

          {/* Call to action melhorado */}
          <div className="text-center mt-16 p-8 bg-white rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Que tal uma experiência diferente?
            </h3>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Com o Express.com, você faz seu check-in em segundos, de qualquer lugar, a qualquer hora.
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="/register/guests"
                className="bg-primary-900 hover:bg-primary-600 text-white px-8 py-3 rounded-md font-medium transition-colors duration-300 shadow-hover"
              >
                Registrar como Hóspede
              </a>
              <a
                href="/register/hotels"
                className="bg-blue-900 hover:bg-blue-950 text-white px-8 py-3 rounded-md font-medium transition-colors duration-300 shadow-hover"
              >
                Registrar como Hotel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
