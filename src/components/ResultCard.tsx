
import React from 'react';
import { cn } from '@/lib/utils';
import { MapPin, User, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface LocationData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  confidence: number;
}

interface ResultCardProps {
  personImage?: string;
  location?: LocationData;
  isLoading?: boolean;
  className?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({
  personImage,
  location,
  isLoading = false,
  className,
}) => {
  // Format the date for the current time
  const currentDate = new Date();
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(currentDate);
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
  }).format(currentDate);
  
  return (
    <Card className={cn("overflow-hidden glass-card border", className)}>
      <div className="p-1">
        <div className="relative p-4 pb-0">
          <div className="flex items-start gap-4">
            {isLoading ? (
              <Skeleton className="h-16 w-16 rounded-full" />
            ) : (
              <div className="relative flex-shrink-0">
                <div className="h-16 w-16 rounded-full overflow-hidden ring-4 ring-primary/20 shadow-lg">
                  {personImage ? (
                    <img
                      src={personImage}
                      alt="Person"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-400 dark:text-gray-500" />
                    </div>
                  )}
                </div>
                {personImage && (
                  <div className="absolute -bottom-1 -right-1 bg-green-500 text-white rounded-full p-1 shadow-lg">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                )}
              </div>
            )}
            <div className="flex-1 min-w-0">
              {isLoading ? (
                <>
                  <Skeleton className="h-5 w-32 mb-2" />
                  <Skeleton className="h-4 w-40" />
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 mb-1">
                    <h3 className="font-semibold text-lg truncate">
                      {location ? `Face found in ${location.name}` : 'No location detected'}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                    <MapPin className="h-3.5 w-3.5" />
                    <span className="truncate">
                      {location ? `${location.state}, India` : 'Upload an image to begin detection'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-y-4 gap-x-6 mt-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-20" />
                ) : (
                  <p className="text-sm font-medium">{formattedDate}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                <Clock className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <p className="text-sm font-medium">{formattedTime}</p>
                )}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400">Confidence</p>
                {isLoading ? (
                  <Skeleton className="h-4 w-12" />
                ) : (
                  <p className="text-sm font-medium">
                    {location ? `${Math.round(location.confidence * 100)}%` : 'N/A'}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {location && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              <h4 className="text-sm font-medium mb-2">Other possible locations:</h4>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">Hyderabad (63%)</Badge>
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">Jaipur (51%)</Badge>
                <Badge variant="outline" className="bg-gray-50 dark:bg-gray-800">Pune (44%)</Badge>
              </div>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
};

export default ResultCard;
