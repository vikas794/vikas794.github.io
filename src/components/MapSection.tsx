import { motion } from "motion/react";
import { X } from "lucide-react";

interface MapSectionProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MapSection({ isOpen, onClose }: MapSectionProps) {
  return (
    <>
      <div 
        className={`map-overlay ${isOpen ? "active" : ""}`} 
        id="mapOverlay"
        onClick={onClose}
      ></div>
      <div 
        className={`map-modal ${isOpen ? "active" : ""}`} 
        id="mapModal" 
        role="dialog" 
        aria-label="Location map" 
        aria-hidden={!isOpen}
      >
        <div className="map-modal-inner relative">
          <button 
            className="map-close absolute top-3 right-4 z-10 p-2 bg-surface2 rounded-md hover:bg-surface transition-colors" 
            id="mapClose" 
            aria-label="Close map"
            onClick={onClose}
          >
            <X size={18} className="text-text-muted hover:text-text" />
          </button>
          <div className="map-label">Santacruz, Mumbai, Maharashtra 400055</div>
          {isOpen && (
            <iframe
              id="mapFrame"
              className="map-frame"
              // src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d15000!2d72.843072!3d19.078712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zMTnCsDA0JzQzLjQiTiA3MsKwNTAnNDQuMyJF!5e0!3m2!1sen!2sin!4v1775209698083!5m2!1sen!2sin"
              src="https://www.google.com/maps?q=Santacruz+East+Mumbai&z=14&output=embed"
              // src="https://maps.google.com/maps?q=19.078712,72.843072&z=13&output=embed"
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Santacruz Mumbai map"
            ></iframe>
          )}
        </div>
      </div>
    </>
  );
}
