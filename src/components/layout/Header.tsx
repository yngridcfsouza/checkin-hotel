'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="flex items-center">
          <Image 
            src="/logo.png" 
            alt="Express.com Logo" 
            width={80} 
            height={80} 
            className="object-contain"
          />
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/hospede" className="px-4 py-2 text-primary hover:text-primary-dark font-medium transition-colors">
            Sou hóspede
          </Link>
          <Link href="/hotel" className="px-4 py-2 bg-primary text-white hover:bg-blue-700 rounded-md font-medium transition-colors">
            Sou hotel
          </Link>
        </div>
      </div>
    </header>
  );
}