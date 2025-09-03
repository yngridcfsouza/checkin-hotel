import { ReactNode } from 'react';

interface CardFeatureProps {
  icon: ReactNode;
  title: string;
  description: string;
}

export function CardFeature({ icon, title, description }: CardFeatureProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-hover hover:translate-y-[-5px]">
      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary-100 text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}