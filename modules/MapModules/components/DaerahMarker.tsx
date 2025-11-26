"use client";

import { Marker, Popup } from "react-leaflet";
import { Icon, Marker as LeafletMarker } from "leaflet";
import { useMemo, useRef, forwardRef, useImperativeHandle } from "react";
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

const DaerahMarker = forwardRef<any, DaerahMarkerProps>(
  ({ daerah, icon }, ref) => {
    const markerRef = useRef<LeafletMarker | null>(null);

    useImperativeHandle(ref, () => ({
      openPopup: () => {
        if (markerRef.current) {
          markerRef.current.openPopup();
        }
      },
    }));

    const markerIcon = useMemo(() => {
      if (!daerah.icon) {
        return icon;
      }

      return new Icon({
        ...icon.options,
        iconUrl: daerah.icon,
        iconRetinaUrl: daerah.icon,
      });
    }, [daerah.icon, icon]);

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
        icon={markerIcon}
        eventHandlers={{
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
);

DaerahMarker.displayName = "DaerahMarker";

export default DaerahMarker;
