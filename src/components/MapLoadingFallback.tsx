import LoadingSpinner from "./LoadingSpinner";

interface MapLoadingFallbackProps {
  isOpen: boolean;
}

export default function MapLoadingFallback({ isOpen }: MapLoadingFallbackProps) {
  return (
    <>
      <div
        className={`map-overlay ${isOpen ? "active" : ""}`}
      ></div>
      <div
        className={`map-modal ${isOpen ? "active" : ""}`}
        role="dialog"
        aria-label="Loading map"
        aria-hidden={!isOpen}
      >
        <div className="map-modal-inner relative">
          <div className="map-label">Santacruz, Mumbai, Maharashtra 400055</div>
          <div className="map-frame flex items-center justify-center bg-surface2">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    </>
  );
}
