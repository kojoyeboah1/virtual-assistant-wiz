import { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
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

  if (!apiKey) {
    return (
      <div className={`w-full h-[200px] rounded-lg bg-muted flex items-center justify-center ${className}`}>
        <p className="text-muted-foreground text-sm">Google Maps API key not configured</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey}
      onError={(error) => {
        console.error('Google Maps loading error:', error);
        toast({
          title: "Error loading map",
          description: "There was an error loading Google Maps",
          variant: "destructive",
        });
      }}
    >
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