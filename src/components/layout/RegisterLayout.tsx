import RegisterHeader from './RegisterHeader';

interface RegisterLayoutProps {
  children: React.ReactNode;
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <RegisterHeader />
      <main className="flex-grow pt-24 pb-8">
        {children}
      </main>
    </div>
  );
}
