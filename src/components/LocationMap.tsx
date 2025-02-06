import { useRef, useEffect, memo } from "react";
import { MapLoader } from "./map/MapLoader";
import { MapError } from "./map/MapError";
import { useMapInitializer } from "@/hooks/useMapInitializer";

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  location?: Location;
  onLocationSelect?: (location: Location) => void;
  isEditable?: boolean;
  className?: string;
  readonly?: boolean;
}

const LocationMap = memo(({ 
  location, 
  onLocationSelect, 
  isEditable = false,
  className,
  readonly 
}: LocationMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const {
    loadError,
    isLoaded,
    apiKey,
    initializeMap,
  } = useMapInitializer({
    location: location || { lat: 5.6037, lng: -0.1870 }, // Default to Accra, Ghana
    isEditable,
    onLocationSelect,
    readonly,
  });

  useEffect(() => {
    if (mapRef.current && isLoaded && apiKey) {
      initializeMap(mapRef.current);
    }
  }, [isLoaded, apiKey, initializeMap]);

  if (loadError) {
    return <MapError error={loadError} />;
  }

  if (!isLoaded || !apiKey) {
    return <MapLoader />;
  }

  return (
    <div 
      ref={mapRef}
      className={`w-full h-[400px] rounded-lg shadow-md ${className || ''}`}
      style={{ 
        minHeight: '200px',
        touchAction: 'none', // Prevent touch events from propagating
        WebkitOverflowScrolling: 'touch',
        position: 'relative',
        zIndex: 1
      }}
      onClick={(e) => e.stopPropagation()}
    />
  );
});

LocationMap.displayName = 'LocationMap';

export default LocationMap;