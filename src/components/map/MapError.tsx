interface MapErrorProps {
  error: string;
}

export const MapError = ({ error }: MapErrorProps) => {
  return (
    <div className="p-4 text-red-500 bg-red-50 rounded-lg">
      Error loading map: {error}
    </div>
  );
};