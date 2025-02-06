import { useState, useEffect, useCallback, useRef } from "react";
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
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const scriptLoadedRef = useRef(false);

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

  useEffect(() => {
    if (!apiKey || scriptLoadedRef.current || window.google || document.querySelector('script[src*="maps.googleapis.com"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.id = 'google-maps-script';
    
    script.onload = () => {
      scriptLoadedRef.current = true;
      setIsLoaded(true);
    };
    
    script.onerror = () => {
      setLoadError("Failed to load Google Maps");
      sessionStorage.removeItem('google_maps_api_key');
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, [apiKey]);

  const initializeMap = useCallback((mapElement: HTMLElement) => {
    if (!mapElement || !window.google || mapRef.current) return;

    try {
      const defaultLocation = location || { lat: 5.6037, lng: -0.1870 }; // Default to Accra, Ghana
      const newMap = new window.google.maps.Map(mapElement, {
        center: defaultLocation,
        zoom: 13,
        disableDefaultUI: readonly,
        draggable: !readonly,
        gestureHandling: 'greedy', // This will help with mobile scrolling
        scrollwheel: true,
        zoomControl: true,
        mapTypeControl: true,
        streetViewControl: false,
        fullscreenControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      });

      mapRef.current = newMap;

      // Prevent scroll propagation
      mapElement.addEventListener('touchmove', (e) => {
        e.stopPropagation();
      }, { passive: false });

      mapElement.addEventListener('wheel', (e) => {
        e.stopPropagation();
      }, { passive: false });

      if (location) {
        const newMarker = new window.google.maps.Marker({
          position: location,
          map: newMap,
          draggable: isEditable,
        });
        markerRef.current = newMarker;

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
          
          if (markerRef.current) {
            markerRef.current.setPosition(newLocation);
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
            
            markerRef.current = newMarker;
          }
          
          onLocationSelect(newLocation);
        });
      }
    } catch (err) {
      console.error('Error initializing map:', err);
      setLoadError("Failed to initialize map");
    }
  }, [location, isEditable, onLocationSelect, readonly]);

  useEffect(() => {
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
      if (mapRef.current) {
        google.maps.event.clearInstanceListeners(mapRef.current);
      }
    };
  }, []);

  return {
    apiKey,
    loadError,
    isLoaded,
    initializeMap,
  };
};