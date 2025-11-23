"use client";

import { Marker, Popup, Tooltip } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useRef } from "react";
import DaerahPopup from "./DaerahPopup";

interface DaerahData {
  id: string;
  nama: string;
  description: string;
  latitude: number;
  longitude: number;
  icon: string | null;
  backgroundImg: string | null;
  images: string[];
  kebudayaans: Array<{
    id: string;
    nama: string;
    jenis: string;
    images: string[];
  }>;
}

interface DaerahMarkerProps {
  daerah: DaerahData;
  icon: Icon;
}

export default function DaerahMarker({ daerah, icon }: DaerahMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const markerRef = useRef<any>(null);

  // Create a custom icon with hover effect
  const hoverIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconSize: [30, 48], // Slightly larger on hover
    iconAnchor: [15, 48],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  const handleMouseOver = () => {
    setIsHovered(true);
    if (markerRef.current) {
      // Open tooltip on hover
      markerRef.current.openTooltip();
    }
  };

  const handleMouseOut = () => {
    setIsHovered(false);
    if (markerRef.current) {
      // Close tooltip on mouse out
      markerRef.current.closeTooltip();
    }
  };

  const handleClick = () => {
    if (markerRef.current) {
      // Open popup on click
      markerRef.current.openPopup();
    }
  };

  return (
    <Marker
      ref={markerRef}
      position={[daerah.latitude, daerah.longitude]}
      icon={isHovered ? hoverIcon : icon}
      eventHandlers={{
        mouseover: handleMouseOver,
        mouseout: handleMouseOut,
        click: handleClick,
      }}
    >
      {/* Tooltip for hover effect */}
      <Tooltip
        permanent={false}
        direction="top"
        offset={[0, -40]}
        className="custom-tooltip"
      >
        <div className="bg-white p-2 rounded shadow-lg border">
          <h4 className="font-semibold text-sm text-gray-800">{daerah.nama}</h4>
          <p className="text-xs text-gray-600 mt-1 max-w-40 line-clamp-2">
            {daerah.description.length > 60
              ? `${daerah.description.substring(0, 60)}...`
              : daerah.description}
          </p>
          {daerah.kebudayaans.length > 0 && (
            <p className="text-xs text-blue-600 mt-1">
              {daerah.kebudayaans.length} kebudayaan
            </p>
          )}
        </div>
      </Tooltip>

      {/* Popup for detailed information */}
      <Popup
        minWidth={320}
        maxWidth={400}
        closeButton={true}
        autoPan={true}
        className="custom-popup"
      >
        <DaerahPopup daerah={daerah} />
      </Popup>
    </Marker>
  );
}
