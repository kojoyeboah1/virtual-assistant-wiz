import { useEffect, useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  lat: number;
  lng: number;
}

interface LocationMapProps {
  location?: Location;
  onLocationSelect?: (location: Location) => void;
  isEditable?: boolean;
}

const LocationMap = ({ location, onLocationSelect, isEditable = false }: LocationMapProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'GOOGLE_MAPS_API_KEY' }
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        if (!data) {
          console.error('No API key returned from function');
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        console.log('Successfully fetched API key');
        setApiKey(data.data); // Access the key from data.data
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

  const defaultCenter = {
    lat: location?.lat || 0,
    lng: location?.lng || 0,
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    if (!isEditable || !onLocationSelect || !e.latLng) return;
    
    const newLocation = {
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    };
    
    onLocationSelect(newLocation);
  };

  if (!apiKey) {
    return <div>Loading map...</div>;
  }

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "400px" }}
        center={defaultCenter}
        zoom={13}
        onClick={handleMapClick}
      >
        {location && <Marker position={location} />}
      </GoogleMap>
    </LoadScript>
  );
};

export default LocationMap;