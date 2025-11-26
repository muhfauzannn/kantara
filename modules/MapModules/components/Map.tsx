"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState, useRef } from "react";
import DaerahMarker from "./DaerahMarker";

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

// Fix untuk icon marker Leaflet di Next.js
const customIcon = new Icon({
  iconUrl: "/icon/bali.png",
  iconRetinaUrl: "/icon/bali@2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

interface MapProps {
  selectedDaerahId?: string | null;
}

const Map = ({ selectedDaerahId }: MapProps) => {
  const [daerahData, setDaerahData] = useState<DaerahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    -2.5489, 118.0149,
  ]);
  const [mapZoom, setMapZoom] = useState(5);
  const markerRefs = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    // Fix untuk Leaflet di Next.js
    delete (Icon.Default.prototype as any)._getIconUrl;
    Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });

    // Fetch daerah data
    fetchDaerahData();
  }, []);

  // Open popup and zoom to selected daerah when selectedDaerahId changes
  useEffect(() => {
    if (selectedDaerahId && daerahData.length > 0) {
      const selectedDaerah = daerahData.find((d) => d.id === selectedDaerahId);
      if (selectedDaerah) {
        // Update map center and zoom to selected daerah
        setMapCenter([selectedDaerah.latitude, selectedDaerah.longitude]);
        setMapZoom(10);

        // Wait a bit for map to be ready and open popup
        setTimeout(() => {
          markerRefs.current[selectedDaerahId]?.openPopup();
        }, 500);
      }
    }
  }, [selectedDaerahId, daerahData]);

  const fetchDaerahData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/daerah");
      const result = await response.json();

      if (result.success) {
        setDaerahData(result.data);
      } else {
        setError("Failed to fetch daerah data");
      }
    } catch (err) {
      console.error("Error fetching daerah data:", err);
      setError("Error fetching daerah data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
          <button
            onClick={fetchDaerahData}
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={mapCenter}
      zoom={mapZoom}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dynamic markers from database */}
      {daerahData.map((daerah) => (
        <DaerahMarker
          key={daerah.id}
          daerah={daerah}
          icon={customIcon}
          ref={(el) => {
            if (el) {
              markerRefs.current[daerah.id] = el;
            }
          }}
        />
      ))}
    </MapContainer>
  );
};

export default Map;
