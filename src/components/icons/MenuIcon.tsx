import React from 'react';

interface MenuIconProps {
  className?: string;
}

export default function MenuIcon({ className = '' }: MenuIconProps) {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <span className="block w-6 h-0.5 bg-gray-800"></span>
      <span className="block w-6 h-0.5 bg-gray-800"></span>
      <span className="block w-6 h-0.5 bg-gray-800"></span>
    </div>
  );
}