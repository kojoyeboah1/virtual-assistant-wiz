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
    location,
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
        touchAction: 'pan-x pan-y', // Enable touch scrolling
        WebkitOverflowScrolling: 'touch' // Improve iOS scrolling
      }}
      onClick={(e) => e.stopPropagation()} // Prevent click propagation
    />
  );
});

LocationMap.displayName = 'LocationMap';

export default LocationMap;