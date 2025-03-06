
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { Spinner } from 'lucide-react';

interface MapViewProps {
  personImage?: string;
  isProcessing?: boolean;
  detectedLocations?: {
    id: string;
    name: string;
    state: string;
    lat: number;
    lng: number;
    confidence: number;
  }[];
  className?: string;
  onLocationSelect?: (locationId: string) => void;
}

const MapView: React.FC<MapViewProps> = ({
  personImage,
  isProcessing = false,
  detectedLocations = [],
  className,
  onLocationSelect,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  
  // Simulated location data for demo purposes
  const simulatedLocations = [
    { id: '1', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877, confidence: 0.92 },
    { id: '2', name: 'Delhi', state: 'Delhi', lat: 28.613, lng: 77.209, confidence: 0.87 },
    { id: '3', name: 'Bangalore', state: 'Karnataka', lat: 12.972, lng: 77.594, confidence: 0.78 },
    { id: '4', name: 'Chennai', state: 'Tamil Nadu', lat: 13.083, lng: 80.270, confidence: 0.65 },
    { id: '5', name: 'Kolkata', state: 'West Bengal', lat: 22.573, lng: 88.364, confidence: 0.59 },
  ];
  
  const locations = detectedLocations.length > 0 ? detectedLocations : simulatedLocations;
  
  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  const handleMarkerClick = (locationId: string) => {
    if (onLocationSelect) {
      onLocationSelect(locationId);
    }
  };
  
  return (
    <div className={cn("relative rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg", className)}>
      {!mapLoaded || isProcessing ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 z-10">
          <Spinner className="w-8 h-8 text-primary animate-spin" />
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            {isProcessing ? 'Analyzing image locations...' : 'Loading map...'}
          </p>
        </div>
      ) : null}
      
      <div
        ref={mapContainerRef}
        className="w-full h-full min-h-[500px] bg-blue-50 dark:bg-gray-800"
        style={{
          opacity: mapLoaded && !isProcessing ? 1 : 0.3,
          transition: 'opacity 0.5s ease-in-out',
        }}
      >
        {/* India Map SVG - Simple version for visualization */}
        <svg
          viewBox="0 0 640 750"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full object-contain p-4"
        >
          <path
            d="M385.33 139.49L379.92 132.54L373.31 120.35L354.95 94.85L337.54 91.12L319.18 87.9L298.23 94.85L279.87 101.79L264.9 119.4L254.08 132.54L244.9 149.82L244.9 169.6L233.13 186.88L214.78 192.87L201.15 194.77L186.18 207.91L176.05 226.14L169.72 246.87L160.13 269.13L155.15 287.36L152.51 308.09L147.95 328.81L139.31 346.09L126.62 360.18L121.64 377.45L122.59 395.73L134.33 404.86L143.92 413.96L154.05 421.95L170.67 431.09L186.59 448.36L198.33 456.5L214 457.45L231.85 460.63L252.15 458.4L268.77 450.26L274.64 432.99L280.51 414.76L288.74 404.67L297.87 394.59L308.41 389.55L324.56 390.5L336.72 399.64L343.49 416.91L353.08 434.18L366.21 447.32L380.23 457.45L391.49 478.18L393.64 496.45L398.67 515.64L408.87 533.86L422.95 544L434.28 561.27L443.46 583.91L455.2 596.09L465.74 606.18L476.79 615.32L492.97 622.27L508.69 623.22L521.85 613.13L534.05 600.95L541.38 581.73L549.2 562.5L560.49 545.23L571.33 539.18L583.08 539.18L593.18 553.27L603.72 564.32L612.44 574.41L620.67 596.09L623.28 615.32L620.67 637L615.69 657.68L611.49 679.36L606.95 701.05L611.49 723.68L618.82 729.27L629.38 726.86L634.82 707.64L637 685.95L642.43 666.77L651.2 647.59L654.28 627.36L660.59 606.64L669.79 586.41L676.08 567.18L687.82 547L702.38 529.68L715.08 511.45L722.82 484.64L727.38 465.41L727.38 444.68L722.82 421.09L713.23 401.86L704.59 384.59L694.05 364.36L685.41 347.09L676.79 327.86L669.44 309.64L660.59 290.41L652.38 271.18L646.08 252.91L636.9 234.68L627.72 213.95L614.62 197.64L598.87 185.45L579.95 177.32L559.59 174.09L539.23 174.09L521.85 179.09L504.44 184.09L484.08 187.32L466.67 194.27L455.2 206.91L451.64 225.18L439.9 232.36L421.54 237.36H402.77L385.33 246.5L368.87 258.68L361.08 276.95L352.85 295.18L341.08 307.36L324.56 318.59L308.41 318.59L290.46 313.54L271.69 307.59L254.08 301.64L237.18 292.5L222.21 277.45L209.08 262.41L195.95 247.36L183.28 234.23L174.41 216.91L159.18 204.77L144.21 195.64L133.38 186.5L123.26 168.27L121.18 151L128.77 132.73L141.44 123.59L153.18 111.41L161.38 95.09L169.59 78.77L179.64 62.45L193.18 46.14L205.8 29.82L219.28 14.77L233.13 0L249.95 14.09L261.28 32.32L275.13 48.64L284.74 68.86L295.13 89.59L309.08 105.9L329.85 117.13L351.9 122.13L368.87 124.4L385.33 139.49Z"
            fill="currentColor"
            fillOpacity="0.05"
            stroke="currentColor"
            strokeOpacity="0.2"
            strokeWidth="2"
          />
          
          {/* Location Markers */}
          {locations.map((location) => {
            // Convert geographic coordinates to SVG coordinates (approximation)
            const svgX = (location.lng - 68) * 14;
            const svgY = (35 - location.lat) * 20;
            
            return (
              <g
                key={location.id}
                transform={`translate(${svgX}, ${svgY})`}
                onClick={() => handleMarkerClick(location.id)}
                className="cursor-pointer transition-transform hover:scale-110"
              >
                <circle
                  cx="0"
                  cy="0"
                  r="10"
                  fill="url(#pulseGradient)"
                  className="animate-pulse-slow"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="6"
                  fill="#3b82f6"
                  stroke="white"
                  strokeWidth="2"
                />
                {personImage && (
                  <image
                    href={personImage}
                    x="-15"
                    y="-15"
                    height="30"
                    width="30"
                    className="rounded-full"
                    clipPath="url(#circleClip)"
                  />
                )}
                <text
                  x="0"
                  y="25"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-xs font-medium pointer-events-none"
                >
                  {location.name}
                </text>
                <text
                  x="0"
                  y="38"
                  textAnchor="middle"
                  fill="currentColor"
                  className="text-xs opacity-70 pointer-events-none"
                >
                  {Math.round(location.confidence * 100)}%
                </text>
              </g>
            );
          })}
          
          {/* Definitions for effects */}
          <defs>
            <clipPath id="circleClip">
              <circle cx="0" cy="0" r="15" />
            </clipPath>
            <radialGradient id="pulseGradient" cx="0.5" cy="0.5" r="0.5">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

export default MapView;
