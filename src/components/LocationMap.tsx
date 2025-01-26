import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface LocationMapProps {
  location?: { lat: number; lng: number };
  onLocationSelect?: (location: { lat: number; lng: number }) => void;
  className?: string;
  readonly?: boolean;
}

const defaultCenter = { lat: 40.7128, lng: -74.0060 }; // New York City

export const LocationMap = ({ 
  location, 
  onLocationSelect,
  className = "",
  readonly = false 
}: LocationMapProps) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  
  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (readonly || !onLocationSelect || !e.latLng) return;
    onLocationSelect({
      lat: e.latLng.lat(),
      lng: e.latLng.lng()
    });
  }, [onLocationSelect, readonly]);

  return (
    <LoadScript googleMapsApiKey={process.env.GOOGLE_MAPS_API_KEY || ''}>
      <GoogleMap
        mapContainerClassName={`w-full h-[200px] rounded-lg ${className}`}
        center={location || defaultCenter}
        zoom={13}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};