import React from 'react';
import { applianceTemplates } from '../data/templates';
import { ArrowLeftIcon, SunIcon, ZapIcon, BatteryIcon } from 'lucide-react';

interface LandingPageProps {
  onStartFromScratch: () => void;
  onSelectTemplate: (templateId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartFromScratch,
  onSelectTemplate
}) => {
  const scrollToTemplates = () => {
    const templatesSection = document.getElementById('templates-section');
    if (templatesSection) {
      templatesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <SunIcon className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Welcome to SolarMate
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Design your perfect solar power system with our professional calculator.
          Choose a template or start from scratch.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <ZapIcon className="h-8 w-8 text-blue-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Accurate Calculations
          </h3>
          <p className="text-gray-600">
            Get precise system sizing based on your specific requirements.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <BatteryIcon className="h-8 w-8 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Battery Options
          </h3>
          <p className="text-gray-600">
            Compare different battery types and configurations.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="flex justify-center mb-4">
            <SunIcon className="h-8 w-8 text-yellow-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Solar Optimization
          </h3>
          <p className="text-gray-600">
            Optimize your system for maximum solar efficiency.
          </p>
        </div>
      </div>

      {/* Main Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-white rounded-lg shadow-lg p-8 transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Start from Scratch
          </h2>
          <p className="text-gray-600 mb-6">
            Build your system from the ground up with complete control over every aspect.
          </p>
          <button
            onClick={onStartFromScratch}
            className="w-full bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Start Designing
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 transform transition-transform hover:scale-105">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            View Examples
          </h2>
          <p className="text-gray-600 mb-6">
            Explore our example systems to understand different configurations.
          </p>
          <button
            onClick={scrollToTemplates}
            className="w-full bg-gray-600 text-white px-6 py-3 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
          >
            View Examples
          </button>
        </div>
      </div>

      {/* Templates Section */}
      <div id="templates-section" className="bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">
          Choose a Template
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {applianceTemplates.map((template) => (
            <div
              key={template.id}
              className="border rounded-lg p-6 hover:shadow-md transition-shadow transform hover:scale-105"
            >
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {template.name}
              </h3>
              <p className="text-gray-600 mb-4">
                {template.description}
              </p>
              <button
                onClick={() => onSelectTemplate(template.id)}
                className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
              >
                Use Template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 