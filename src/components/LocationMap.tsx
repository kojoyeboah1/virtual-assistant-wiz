import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

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

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

export const LocationMap = ({ 
  location, 
  onLocationSelect, 
  isEditable = false,
  className,
  readonly 
}: LocationMapProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
  const { toast } = useToast();

  // Fetch API key from Supabase Edge Function
  useEffect(() => {
    const fetchApiKey = async () => {
      try {
        console.log('Fetching Google Maps API key...');
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'GOOGLE_MAPS_API_KEY' }
        });
        
        if (error) {
          console.error('Supabase function error:', error);
          setLoadError("Could not load Google Maps API key");
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        if (!data?.data) {
          console.error('No API key returned from function');
          setLoadError("Could not load Google Maps API key");
          toast({
            title: "Error loading map",
            description: "Could not load Google Maps API key",
            variant: "destructive",
          });
          return;
        }

        console.log('Successfully fetched API key');
        setApiKey(data.data);
      } catch (err) {
        console.error('Error in fetchApiKey:', err);
        setLoadError("Could not load Google Maps API key");
        toast({
          title: "Error loading map",
          description: "Could not load Google Maps API key",
          variant: "destructive",
        });
      }
    };

    fetchApiKey();
  }, [toast]);

  // Initialize map when API key is available
  useEffect(() => {
    if (!apiKey || window.google || map) return;

    const initializeMap = () => {
      const mapElement = document.getElementById('map');
      if (!mapElement) return;

      try {
        const defaultLocation = location || { lat: 0, lng: 0 };
        const newMap = new window.google.maps.Map(mapElement, {
          center: defaultLocation,
          zoom: 13,
          disableDefaultUI: readonly,
          draggable: !readonly,
          gestureHandling: readonly ? 'none' : 'cooperative',
        });

        setMap(newMap);

        if (location) {
          const newMarker = new window.google.maps.Marker({
            position: location,
            map: newMap,
            draggable: isEditable,
          });
          setMarker(newMarker);
        }

        if (isEditable && onLocationSelect) {
          newMap.addListener('click', (e: google.maps.MapMouseEvent) => {
            const newLocation = {
              lat: e.latLng!.lat(),
              lng: e.latLng!.lng(),
            };
            
            if (marker) {
              marker.setPosition(newLocation);
            } else {
              const newMarker = new window.google.maps.Marker({
                position: newLocation,
                map: newMap,
                draggable: true,
              });
              setMarker(newMarker);
            }
            
            onLocationSelect(newLocation);
          });
        }
      } catch (err) {
        console.error('Error initializing map:', err);
        setLoadError("Failed to initialize map");
        toast({
          title: "Error",
          description: "Failed to initialize map",
          variant: "destructive",
        });
      }
    };

    // Load Google Maps script
    if (!document.querySelector('script[src*="maps.googleapis.com/maps/api"]')) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        setIsLoaded(true);
        initializeMap();
      };
      script.onerror = () => {
        setLoadError("Failed to load Google Maps");
        toast({
          title: "Error loading map",
          description: "Failed to load Google Maps",
          variant: "destructive",
        });
      };
      document.head.appendChild(script);
    } else {
      setIsLoaded(true);
      initializeMap();
    }

    return () => {
      if (marker) {
        marker.setMap(null);
      }
      setMap(null);
      setMarker(null);
    };
  }, [apiKey, location, isEditable, onLocationSelect, readonly, toast]);

  if (loadError) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        Error loading map: {loadError}
      </div>
    );
  }

  if (!isLoaded || !apiKey) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading map...</span>
      </div>
    );
  }

  return (
    <div 
      id="map" 
      className={`w-full h-[400px] rounded-lg shadow-md ${className || ''}`}
      style={{ minHeight: '200px' }}
    />
  );
};

export default LocationMap;