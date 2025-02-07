interface MapErrorProps {
  error: string;
}

export const MapError = ({ error }: MapErrorProps) => {
  const isBillingError = error.toLowerCase().includes('billing');
  
  return (
    <div className="p-4 text-center space-y-2">
      <p className="text-red-500 font-medium">
        {isBillingError ? 'Google Maps API billing needs to be enabled' : 'Error loading map'}
      </p>
      <p className="text-sm text-muted-foreground">
        {error}
      </p>
    </div>
  );
};