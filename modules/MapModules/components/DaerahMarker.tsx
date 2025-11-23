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
    iconUrl: "/icon/bali.png",
    iconRetinaUrl:
      "/icon/bali@2x.png",
    // shadowUrl: "/icon/bali-shadow.png",
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
