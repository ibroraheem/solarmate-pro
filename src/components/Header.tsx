import React from 'react';
import { SunIcon } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SunIcon className="h-8 w-8 text-yellow-300" />
          <h1 className="text-2xl md:text-3xl font-bold">SolarMate Pro</h1>
        </div>
        <div className="hidden md:block">
          <p className="text-sm md:text-base italic">
            Professional Solar System Sizing Calculator
          </p>
        </div>
      </div>
    </header>
  );
};

export default Header;