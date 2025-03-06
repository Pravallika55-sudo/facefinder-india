
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { MapIcon } from 'lucide-react';

interface HeroSectionProps {
  className?: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ className }) => {
  return (
    <section className={cn("text-center py-12 relative", className)}>
      <div className="max-w-4xl mx-auto px-4">
        <Badge className="mb-5 px-3 py-1 bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800 animate-fade-in">
          <MapIcon className="h-3.5 w-3.5 mr-1.5" />
          <span>Visual Recognition Technology</span>
        </Badge>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight animate-slide-up">
          <span className="inline-block">Face</span>{" "}
          <span className="inline-block relative">
            Finder
            <span className="absolute inset-x-0 bottom-2 h-3 bg-blue-200/50 dark:bg-blue-800/50 -z-10 transform skew-x-12"></span>
          </span>{" "}
          <span className="inline-block">India</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-slide-up animate-delay-200">
          Upload a portrait and our AI will analyze facial features to identify possible locations across India where the person might be found.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-slide-up animate-delay-300">
          <div className="flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium">Advanced Facial Recognition</span>
          </div>
          
          <div className="flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-3">
              <svg className="h-4 w-4 text-blue-600 dark:text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <span className="text-sm font-medium">Pan-India Coverage</span>
          </div>
          
          <div className="flex items-center px-4 py-2 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-100 dark:border-gray-700">
            <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-3">
              <svg className="h-4 w-4 text-purple-600 dark:text-purple-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <span className="text-sm font-medium">High Confidence Analysis</span>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent"></div>
    </section>
  );
};

export default HeroSection;
