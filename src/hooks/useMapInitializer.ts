import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/components/ui/use-toast";
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

  // Cache API key in session storage to prevent frequent requests
  useEffect(() => {
    const cachedKey = sessionStorage.getItem('google_maps_api_key');
    if (cachedKey) {
      setApiKey(cachedKey);
      return;
    }

    const fetchApiKey = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('get-secret', {
          body: { secretName: 'GOOGLE_MAPS_API_KEY' }
        });
        
        if (error || !data?.data) {
          console.error('Error fetching API key:', error);
          setLoadError("Could not load Google Maps API key");
          return;
        }

        sessionStorage.setItem('google_maps_api_key', data.data);
        setApiKey(data.data);
      } catch (err) {
        console.error('Error in fetchApiKey:', err);
        setLoadError("Could not load Google Maps API key");
      }
    };

    fetchApiKey();
  }, []);

  // Load Google Maps script only once
  useEffect(() => {
    if (!apiKey || window.google || document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    script.onload = () => {
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setLoadError("Failed to load Google Maps");
      sessionStorage.removeItem('google_maps_api_key');
    };
    
    document.head.appendChild(script);
  }, [apiKey]);

  const initializeMap = useCallback((mapElement: HTMLElement) => {
    if (!mapElement || !window.google || map) return;

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

        if (isEditable && onLocationSelect) {
          newMarker.addListener('dragend', () => {
            const position = newMarker.getPosition();
            if (position) {
              onLocationSelect({
                lat: position.lat(),
                lng: position.lng(),
              });
            }
          });
        }
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
            
            newMarker.addListener('dragend', () => {
              const position = newMarker.getPosition();
              if (position) {
                onLocationSelect({
                  lat: position.lat(),
                  lng: position.lng(),
                });
              }
            });
            
            setMarker(newMarker);
          }
          
          onLocationSelect(newLocation);
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setLoadError("Failed to initialize map");
    }
  }, [location, isEditable, onLocationSelect, readonly, map, marker]);

  // Cleanup function
  useEffect(() => {
    return () => {
      if (marker) {
        marker.setMap(null);
      }
      if (map) {
        // @ts-ignore
        map.unbindAll();
      }
    };
  }, [map, marker]);

  return {
    apiKey,
    loadError,
    isLoaded,
    initializeMap,
  };
};