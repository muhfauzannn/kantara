"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect, useState } from "react";
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

const Map = () => {
  const [daerahData, setDaerahData] = useState<DaerahData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
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
      center={[-2.5489, 118.0149]} // Koordinat tengah Indonesia
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Dynamic markers from database */}
      {daerahData.map((daerah) => (
        <DaerahMarker key={daerah.id} daerah={daerah} icon={customIcon} />
      ))}
    </MapContainer>
  );
};

export default Map;
