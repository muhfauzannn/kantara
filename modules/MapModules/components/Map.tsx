"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";
import { useEffect } from "react";

// Fix untuk icon marker Leaflet di Next.js
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const Map = () => {
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
  }, []);

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

      {/* Contoh marker untuk beberapa lokasi budaya di Indonesia */}
      <Marker position={[-6.2088, 106.8456]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Jakarta</h3>
            <p className="text-sm">Ibu kota Indonesia - Kota Metropolitan</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[-7.7956, 110.3695]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Yogyakarta</h3>
            <p className="text-sm">Kota budaya - Candi Borobudur & Prambanan</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[-8.6705, 115.2126]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Bali</h3>
            <p className="text-sm">Pulau Dewata - Destinasi wisata budaya</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[-0.7893, 113.9213]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Kalimantan</h3>
            <p className="text-sm">Budaya Dayak - Rumah Betang</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[5.5483, 95.3238]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Banda Aceh</h3>
            <p className="text-sm">Serambi Mekkah - Masjid Raya Baiturrahman</p>
          </div>
        </Popup>
      </Marker>

      <Marker position={[-0.9493, 100.3543]} icon={customIcon}>
        <Popup>
          <div className="p-2">
            <h3 className="font-bold text-lg">Padang</h3>
            <p className="text-sm">Budaya Minangkabau - Rumah Gadang</p>
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
