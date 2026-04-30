import LoadingSpinner from "./LoadingSpinner";
import Modal from "./Modal";

interface MapLoadingFallbackProps {
  isOpen: boolean;
}

export default function MapLoadingFallback({ isOpen }: MapLoadingFallbackProps) {
  return (
    <Modal
      isOpen={isOpen}
      className="map-modal"
      ariaLabel="Loading map"
    >
      <div className="map-modal-inner relative">
          <div className="map-label">Santacruz, Mumbai, Maharashtra 400055</div>
          <div className="map-frame flex items-center justify-center bg-surface2">
            <LoadingSpinner />
          </div>
      </div>
    </Modal>
  );
}
