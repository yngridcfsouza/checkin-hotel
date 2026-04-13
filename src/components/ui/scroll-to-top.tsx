'use client';

import { useEffect, useState } from 'react';

export function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  if (!visible) return null;

  return (
    <button
      onClick={scrollUp}
      aria-label="Voltar ao topo"
      title="Voltar ao topo"
      className="
        fixed bottom-6 right-6 z-50
        w-11 h-11
        flex items-center justify-center
        rounded-full
        bg-blue-900 hover:bg-blue-700
        text-white
        shadow-lg hover:shadow-xl
        transition-all duration-300
        hover:-translate-y-1
        focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
      </svg>
    </button>
  );
}
