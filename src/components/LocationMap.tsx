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

export const LocationMap = ({ 
  location, 
  onLocationSelect, 
  isEditable = false,
  className,
  readonly 
}: LocationMapProps) => {
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

  if (loadError) {
    return <MapError error={loadError} />;
  }

  if (!isLoaded || !apiKey) {
    return <MapLoader />;
  }

  return (
    <div 
      id="map" 
      className={`w-full h-[400px] rounded-lg shadow-md ${className || ''}`}
      style={{ minHeight: '200px' }}
      ref={(element) => {
        if (element) {
          setTimeout(() => {
            initializeMap(element);
          }, 100);
        }
      }}
    />
  );
};

export default LocationMap;