
import React, { useState, useCallback } from 'react';
import { toast } from 'sonner';
import AnimatedBackground from '@/components/AnimatedBackground';
import HeroSection from '@/components/HeroSection';
import UploadArea from '@/components/UploadArea';
import MapView from '@/components/MapView';
import ResultCard from '@/components/ResultCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Share2, Download, RefreshCw } from 'lucide-react';

interface LocationData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  confidence: number;
}

const Index = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAnalysisComplete, setIsAnalysisComplete] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  
  // Simulated location data for demo
  const simulatedLocations = [
    { id: '1', name: 'Mumbai', state: 'Maharashtra', lat: 19.076, lng: 72.877, confidence: 0.92 },
    { id: '2', name: 'Delhi', state: 'Delhi', lat: 28.613, lng: 77.209, confidence: 0.87 },
    { id: '3', name: 'Bangalore', state: 'Karnataka', lat: 12.972, lng: 77.594, confidence: 0.78 },
    { id: '4', name: 'Chennai', state: 'Tamil Nadu', lat: 13.083, lng: 80.270, confidence: 0.65 },
    { id: '5', name: 'Kolkata', state: 'West Bengal', lat: 22.573, lng: 88.364, confidence: 0.59 },
  ];
  
  const handleImageUpload = useCallback((imageUrl: string, file: File) => {
    setUploadedImage(imageUrl);
    setUploadedFile(file);
    setIsAnalysisComplete(false);
    setSelectedLocation(null);
  }, []);
  
  const handleAnalyze = useCallback(() => {
    if (!uploadedImage) {
      toast.error('Please upload an image first');
      return;
    }
    
    setIsProcessing(true);
    setIsAnalysisComplete(false);
    
    // Simulate processing time
    setTimeout(() => {
      // Set the first location as selected for demonstration
      setSelectedLocation(simulatedLocations[0]);
      setIsProcessing(false);
      setIsAnalysisComplete(true);
      
      toast.success('Analysis complete', {
        description: 'High confidence match found in Mumbai, Maharashtra',
      });
    }, 3000);
  }, [uploadedImage]);
  
  const handleLocationSelect = useCallback((locationId: string) => {
    const location = simulatedLocations.find(loc => loc.id === locationId);
    if (location) {
      setSelectedLocation(location);
      
      toast.info(`Selected ${location.name}, ${location.state}`, {
        description: `Confidence level: ${Math.round(location.confidence * 100)}%`,
      });
    }
  }, []);
  
  const handleReset = useCallback(() => {
    setUploadedImage(null);
    setUploadedFile(null);
    setIsProcessing(false);
    setIsAnalysisComplete(false);
    setSelectedLocation(null);
    
    toast.info('Reset complete', {
      description: 'Upload a new image to start again',
    });
  }, []);
  
  const handleShare = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: 'Face Finder India Results',
        text: `I found a match in ${selectedLocation?.name}, ${selectedLocation?.state} with ${Math.round((selectedLocation?.confidence || 0) * 100)}% confidence!`,
        url: window.location.href,
      }).catch(error => {
        console.error('Error sharing:', error);
        toast.error('Could not share results');
      });
    } else {
      // Fallback
      toast.info('Sharing is not supported on this browser');
    }
  }, [selectedLocation]);
  
  return (
    <div className="min-h-screen relative">
      <AnimatedBackground />
      
      <main className="container mx-auto px-4 py-8 relative z-10">
        <HeroSection />
        
        <div className="max-w-6xl mx-auto mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5">
              <div className="space-y-8">
                <UploadArea 
                  onImageUploaded={handleImageUpload}
                  className="animate-fade-in"
                />
                
                {uploadedImage && (
                  <div className="flex justify-center animate-slide-up">
                    <Button
                      onClick={handleAnalyze}
                      disabled={isProcessing}
                      size="lg"
                      className="relative group overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center">
                        {isProcessing ? 'Processing...' : 'Find in India'}
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                      <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                    </Button>
                  </div>
                )}
                
                {isAnalysisComplete && (
                  <div className="flex flex-wrap gap-3 justify-center animate-fade-in">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleShare}
                    >
                      <Share2 className="h-4 w-4" />
                      Share Results
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => {
                        if (uploadedImage) {
                          const link = document.createElement('a');
                          link.href = uploadedImage;
                          link.download = 'face-finder-result.jpg';
                          link.click();
                          
                          toast.success('Image downloaded');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                      Download Image
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={handleReset}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Start Over
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-7">
              <div className="space-y-8">
                <MapView
                  personImage={uploadedImage || undefined}
                  isProcessing={isProcessing}
                  detectedLocations={isAnalysisComplete ? simulatedLocations : []}
                  onLocationSelect={handleLocationSelect}
                  className="animate-fade-in h-[400px]"
                />
                
                {(isProcessing || isAnalysisComplete) && (
                  <ResultCard
                    personImage={uploadedImage || undefined}
                    location={selectedLocation || undefined}
                    isLoading={isProcessing}
                    className="animate-slide-up"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        
        <footer className="mt-20 text-center text-sm text-gray-500 dark:text-gray-400 pb-8 animate-fade-in animate-delay-1000">
          <p>Face Finder India • Powered by Advanced Visual Recognition</p>
          <p className="mt-1">© {new Date().getFullYear()} All rights reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default Index;
