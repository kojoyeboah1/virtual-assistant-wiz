import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Location {
  lat: number;
  lng: number;
}

interface UseMapInitializerProps {
  location?: Location;
  isEditable?: boolean;
  onLocationSelect?: (location: Location) => void;
  readonly?: boolean;
}

export const useMapInitializer = ({
  location,
  isEditable,
  onLocationSelect,
  readonly,
}: UseMapInitializerProps) => {
  const [apiKey, setApiKey] = useState<string>("");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [marker, setMarker] = useState<google.maps.Marker | null>(null);
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

  useEffect(() => {
    if (!apiKey || window.google || map) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => {
      setLoadError("Failed to load Google Maps");
      toast({
        title: "Error loading map",
        description: "Failed to load Google Maps",
        variant: "destructive",
      });
    };
    document.head.appendChild(script);

    return () => {
      if (marker) {
        marker.setMap(null);
      }
      setMap(null);
      setMarker(null);
    };
  }, [apiKey, map, marker, toast]);

  const initializeMap = (mapElement: HTMLElement) => {
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

  return {
    apiKey,
    loadError,
    isLoaded,
    initializeMap,
  };
};