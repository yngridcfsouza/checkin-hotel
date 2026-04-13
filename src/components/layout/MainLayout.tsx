import Header from './Header';
import Footer from './Footer';
import { ScrollToTop } from '@/components/ui/scroll-to-top';

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-24 pb-8">
        {children}
      </main>
      <Footer />
      <ScrollToTop />
    </div>
  );
}