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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7538.027498944637!2d72.83559!3d19.07283!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9c676018b43%3A0x75f29a4205098f99!2sSantacruz%2C%20Mumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1700000000000"
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
