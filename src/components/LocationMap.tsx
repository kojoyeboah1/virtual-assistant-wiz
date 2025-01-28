import { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...'); // Debug log
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'GOOGLE_MAPS_API_KEY' }
        });
        
        if (error) {
          console.error('Supabase function error:', error); // Debug log
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          console.error('No data returned from function'); // Debug log
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        console.log('Successfully fetched API key'); // Debug log
        setApiKey(data);
      } catch (err) {
        console.error('Error in fetchApiKey:', err);
        toast({
          title: "Error loading map",
          description: "Could not load Google Maps API key",
          variant: "destructive",
        });
      }
    };

    fetchApiKey();
  }, [toast]);

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
        <p className="text-muted-foreground text-sm">Loading map...</p>
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