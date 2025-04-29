import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm md:text-base">
            SolarMate Pro © 2025 | Powered by{' '}
            <a
              href="https://x.com/ibroraheem"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-400 hover:text-green-300 transition-colors"
            >
              ibroraheem
            </a>
          </p>
          <div className="mt-3 md:mt-0">
            <p className="text-xs md:text-sm text-gray-400">
              Accurate solar sizing for Nigerian homes and businesses
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;