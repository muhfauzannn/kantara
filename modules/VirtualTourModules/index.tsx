"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MapPin } from "lucide-react";

type VirtualTourStop = {
  title: string;
  description: string;
  image: string;
};

type VirtualTour = {
  id: string;
  title: string;
  location: string;
  description: string;
  heroImage: string;
  embedUrl: string;
  highlights: string[];
  stops: VirtualTourStop[];
  canEmbed?: boolean;
  themes: string[];
};

const tours: VirtualTour[] = [
  {
    id: "jakarta-gedung-kesenian",
    title: "Gedung Kesenian Jakarta",
    location: "DKI Jakarta",
    description:
      "Tur 360° di Gedung Kesenian Jakarta, menelusuri auditorium bersejarah dan detail arsitektur kolonial.",
    heroImage: "/kesenian/kesenian1.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/gedung-kesenian-jakarta/src/index.htm",
    canEmbed: true,
    highlights: [
      "Interior auditorium dan panggung utama",
      "Detail arsitektur kolonial dan ornamen",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Area Utama",
        description:
          "Fokus pada area auditorium utama dan panggung pertunjukan.",
        image: "/kesenian/kesenian1.jpg",
      },
    ],
  },
  {
    id: "jakarta-museum-wayang",
    title: "Museum Wayang Jakarta",
    location: "DKI Jakarta",
    description:
      "Eksplor koleksi wayang Nusantara di Museum Wayang Jakarta melalui sudut pandang 360°.",
    heroImage: "/kesenian/kesenian2.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-wayang/src/index.htm",
    canEmbed: true,
    highlights: [
      "Koleksi wayang dari berbagai daerah",
      "Ruang pamer tematik dan detail ornamen",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya"],
    stops: [
      {
        title: "Ruang Pamer Utama",
        description:
          "Menelusuri ruang pamer berisi koleksi wayang dan penjelasan singkatnya.",
        image: "/kesenian/kesenian2.jpeg",
      },
    ],
  },
  {
    id: "sumsel-taman-wisata-sriwijaya",
    title: "Taman Wisata Kerajaan Sriwijaya",
    location: "Sumatera Selatan",
    description:
      "Tur 360° di kawasan Taman Wisata Kerajaan Sriwijaya, mengenal jejak kejayaan maritim Nusantara.",
    heroImage: "/kesenian/kesenian3.webp",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/kawasan-taman-wisata-kerajaan-sriwijaya-twks/src/index.htm",
    canEmbed: true,
    highlights: [
      "Area taman dan situs peninggalan Sriwijaya",
      "Panorama sungai dan lanskap sekitar",
    ],
    themes: ["Panorama Alam", "Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Area Taman",
        description:
          "Berjalan menyusuri area taman dan kanal yang merefleksikan masa kejayaan Sriwijaya.",
        image: "/kesenian/kesenian3.webp",
      },
    ],
  },
  {
    id: "sumsel-museum-smb-ii",
    title: "Museum Sultan Mahmud Badaruddin II",
    location: "Sumatera Selatan",
    description:
      "Menelusuri koleksi sejarah Kesultanan Palembang di Museum Sultan Mahmud Badaruddin II secara virtual.",
    heroImage: "/kesenian/kesenian4.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-sultan-mahmud-badaruddin-ii/src/index.htm",
    canEmbed: true,
    highlights: [
      "Koleksi artefak Kesultanan Palembang",
      "Interior bangunan bersejarah di tepi Sungai Musi",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya"],
    stops: [
      {
        title: "Ruang Koleksi Utama",
        description:
          "Melihat koleksi utama yang menceritakan sejarah Palembang dan Sultan Mahmud Badaruddin II.",
        image: "/kesenian/kesenian4.jpg",
      },
    ],
  },
  {
    id: "sumsel-alquran-al-akbar",
    title: "Al-Qur'an Al Akbar",
    location: "Sumatera Selatan",
    description:
      "Mengunjungi kompleks Al-Qur'an Al Akbar dengan panel kayu berukiran ayat suci raksasa melalui tampilan 360°.",
    heroImage: "/kesenian/kesenian5.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/al-quran-al-akbar/src/index.htm",
    canEmbed: true,
    highlights: [
      "Panel kayu berukiran ayat Al-Qur'an raksasa",
      "Suasana religius dan arsitektur unik",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Ruang Panel Utama",
        description:
          "Melihat deretan panel ukiran ayat Al-Qur'an yang tersusun menjulang tinggi.",
        image: "/kesenian/kesenian5.jpeg",
      },
    ],
  },
  {
    id: "jateng-candi-borobudur",
    title: "Candi Borobudur",
    location: "Jawa Tengah",
    description:
      "Tur 360° di Candi Borobudur, menyusuri lorong relief hingga puncak stupa dengan panorama sekeliling.",
    heroImage: "/kesenian/kesenian1.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/candi-borobudur/src/index.htm",
    canEmbed: true,
    highlights: [
      "Relief cerita dan stupa-stupa Borobudur",
      "Panorama perbukitan dan pedesaan sekitar",
    ],
    themes: ["Warisan Budaya", "Ritual Historis", "Panorama Alam"],
    stops: [
      {
        title: "Teras Candi",
        description:
          "Berjalan di teras candi sambil mengamati relief dan pemandangan sekitar.",
        image: "/kesenian/kesenian1.jpg",
      },
    ],
  },
  {
    id: "babel-museum-timah",
    title: "Museum Timah Indonesia",
    location: "Kep. Bangka Belitung",
    description:
      "Tur 360° di Museum Timah Indonesia untuk memahami sejarah pertambangan timah di Bangka Belitung.",
    heroImage: "/kesenian/kesenian2.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-timah-indonesia/src/index.htm",
    canEmbed: true,
    highlights: [
      "Koleksi alat dan dokumentasi pertambangan timah",
      "Interior museum bersejarah",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya"],
    stops: [
      {
        title: "Ruang Koleksi",
        description:
          "Melihat koleksi yang menjelaskan proses dan sejarah pertambangan timah.",
        image: "/kesenian/kesenian2.jpeg",
      },
    ],
  },
  {
    id: "sulsel-leang-maros",
    title: "Leang Maros",
    location: "Sulawesi Selatan",
    description:
      "Menjelajahi kawasan Leang Maros dan lanskap karst sekitarnya melalui tur virtual 360°.",
    heroImage: "/rumah/rumah4.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/leang-maros/src/index.htm",
    canEmbed: true,
    highlights: [
      "Lanskap karst dan gua prasejarah",
      "Suasana alam di sekitar Leang Maros",
    ],
    themes: ["Panorama Alam", "Ritual Historis"],
    stops: [
      {
        title: "Area Gua",
        description:
          "Melihat pintu masuk gua dan bentang alam karst di sekelilingnya.",
        image: "/rumah/rumah4.jpg",
      },
    ],
  },
  {
    id: "jatim-situs-trowulan",
    title: "Situs Trowulan",
    location: "Jawa Timur",
    description:
      "Tur 360° di Situs Trowulan, pusat peninggalan arkeologis Kerajaan Majapahit di Jawa Timur.",
    heroImage: "/kesenian/kesenian3.webp",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/situs-trowulan/src/index.htm",
    canEmbed: true,
    highlights: [
      "Sisa-sisa bangunan dan struktur Majapahit",
      "Area taman dan situs penggalian",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Area Situs",
        description:
          "Berjalan di sekitar situs utama yang menyimpan jejak peninggalan Majapahit.",
        image: "/kesenian/kesenian3.webp",
      },
    ],
  },
  {
    id: "jatim-pacitan-prasejarah",
    title: "Hunian Prasejarah Pacitan",
    location: "Jawa Timur",
    description:
      "Mengunjungi Hunian Prasejarah Pacitan secara virtual, mengenal jejak awal manusia di kawasan ini.",
    heroImage: "/kesenian/kesenian4.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/hunian-prasejarah-pacitan/src/index.htm",
    canEmbed: true,
    highlights: [
      "Lingkungan hunian prasejarah dan formasi batu",
      "Suasana alam sekitar Pacitan",
    ],
    themes: ["Panorama Alam", "Warisan Budaya"],
    stops: [
      {
        title: "Area Hunian",
        description:
          "Melihat lokasi hunian prasejarah dan lanskap batuan di sekitarnya.",
        image: "/kesenian/kesenian4.jpg",
      },
    ],
  },
  {
    id: "sumbar-dharmasraya",
    title: "Dharmasraya",
    location: "Sumatera Barat",
    description:
      "Tur 360° yang memperkenalkan kawasan Dharmasraya dan jejak sejarah di sekitarnya.",
    heroImage: "/kesenian/kesenian5.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/dharmasraya/src/index.htm",
    canEmbed: true,
    highlights: [
      "Panorama lanskap Dharmasraya",
      "Jejak sejarah dan budaya setempat",
    ],
    themes: ["Warisan Budaya", "Panorama Alam"],
    stops: [
      {
        title: "Area Utama",
        description:
          "Mengamati kawasan utama yang menjadi fokus dokumentasi Dharmasraya.",
        image: "/kesenian/kesenian5.jpeg",
      },
    ],
  },
  {
    id: "diy-keraton-yogyakarta",
    title: "Keraton Yogyakarta",
    location: "DI Yogyakarta",
    description:
      "Menelusuri kompleks Keraton Yogyakarta secara virtual, lengkap dengan bangsal dan pelataran utamanya.",
    heroImage: "/kesenian/kesenian6.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/keraton-yogyakarta/src/index.htm",
    canEmbed: true,
    highlights: [
      "Bangsal dan pelataran utama Keraton",
      "Detail arsitektur Jawa klasik",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Pelataran Keraton",
        description:
          "Berjalan melewati pelataran dan bangsal utama Keraton Yogyakarta.",
        image: "/kesenian/kesenian6.jpg",
      },
    ],
  },
  {
    id: "diy-candi-prambanan",
    title: "Candi Prambanan",
    location: "DI Yogyakarta",
    description:
      "Tur 360° di kompleks Candi Prambanan dengan fokus pada candi-candi utama dan reliefnya.",
    heroImage: "/kesenian/kesenian7.webp",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/candi-prambanan/src/index.htm",
    canEmbed: true,
    highlights: [
      "Candi utama dan pelataran Prambanan",
      "Relief kisah Ramayana dan detail arsitektur",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Kompleks Candi Utama",
        description:
          "Mengamati candi-candi utama dari berbagai sudut pandang.",
        image: "/kesenian/kesenian7.webp",
      },
    ],
  },
  {
    id: "diy-monumen-jogja-kembali",
    title: "Monumen Yogya Kembali",
    location: "DI Yogyakarta",
    description:
      "Mengunjungi Monumen Yogya Kembali secara virtual, mengenang sejarah perjuangan kemerdekaan di Yogyakarta.",
    heroImage: "/kesenian/kesenian8.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/monumen-yogya-kembali/src/index.htm",
    canEmbed: true,
    highlights: [
      "Bangunan monumen dan ruang diorama",
      "Simbol perjuangan rakyat Yogyakarta",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Area Monumen",
        description:
          "Melihat bentuk monumen dan area sekitarnya dari berbagai sudut.",
        image: "/kesenian/kesenian8.jpg",
      },
    ],
  },
  {
    id: "diy-museum-gunungapi-merapi",
    title: "Museum Gunungapi Merapi",
    location: "DI Yogyakarta",
    description:
      "Tur 360° di Museum Gunungapi Merapi, mempelajari aktivitas vulkanik dan dampaknya bagi masyarakat.",
    heroImage: "/kesenian/kesenian9.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-gunungapi-merapi/src/index.htm",
    canEmbed: true,
    highlights: [
      "Koleksi material vulkanik dan edukasi kebencanaan",
      "Ruang pamer mengenai aktivitas Merapi",
    ],
    themes: ["Galeri & Museum", "Panorama Alam"],
    stops: [
      {
        title: "Ruang Edukasi",
        description:
          "Menelusuri ruang pamer yang menjelaskan aktivitas Gunung Merapi.",
        image: "/kesenian/kesenian9.jpg",
      },
    ],
  },
  {
    id: "diy-museum-affandi",
    title: "Museum Affandi",
    location: "DI Yogyakarta",
    description:
      "Mengunjungi Museum Affandi secara virtual, melihat galeri karya dan rumah sang maestro.",
    heroImage: "/kesenian/kesenian5.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-affandi/src/index.htm",
    canEmbed: true,
    highlights: [
      "Galeri lukisan Affandi dan koleksi pribadi",
      "Suasana studio dan rumah bergaya unik",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya"],
    stops: [
      {
        title: "Galeri Utama",
        description:
          "Berjalan di dalam galeri yang memajang karya-karya Affandi.",
        image: "/kesenian/kesenian5.jpeg",
      },
    ],
  },
  {
    id: "diy-candi-sewu",
    title: "Candi Sewu",
    location: "DI Yogyakarta",
    description:
      "Tur 360° di kompleks Candi Sewu yang berada dekat dengan Prambanan, dengan susunan candi yang megah.",
    heroImage: "/kesenian/kesenian6.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/candi-sewu/src/index.htm",
    canEmbed: true,
    highlights: [
      "Kompleks candi Buddha dengan banyak bangunan",
      "Suasana tenang di sekitar kompleks candi",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Kompleks Candi",
        description:
          "Melihat deretan candi dari berbagai sudut pandang panorama.",
        image: "/kesenian/kesenian6.jpg",
      },
    ],
  },
  {
    id: "jabar-museum-sri-baduga",
    title: "Museum Sri Baduga",
    location: "Jawa Barat",
    description:
      "Menelusuri Museum Sri Baduga secara virtual untuk mengenal sejarah dan budaya Jawa Barat.",
    heroImage: "/rumah/rumah1.jpeg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/museum-sri-baduga/src/index.htm",
    canEmbed: true,
    highlights: [
      "Koleksi sejarah dan budaya Sunda",
      "Ruang pamer tematik Jawa Barat",
    ],
    themes: ["Galeri & Museum", "Warisan Budaya"],
    stops: [
      {
        title: "Ruang Pamer",
        description:
          "Berjalan di ruang pamer koleksi budaya Jawa Barat di Museum Sri Baduga.",
        image: "/rumah/rumah1.jpeg",
      },
    ],
  },
  {
    id: "jabar-tebing-keraton",
    title: "Tebing Keraton",
    location: "Jawa Barat",
    description:
      "Tur 360° di Tebing Keraton, menikmati panorama hutan dan kabut di perbukitan Bandung.",
    heroImage: "/rumah/rumah2.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/tebing-keraton/src/index.htm",
    canEmbed: true,
    highlights: [
      "Panorama perbukitan dan hutan Bandung",
      "Titik pandang populer untuk menikmati matahari terbit",
    ],
    themes: ["Panorama Alam"],
    stops: [
      {
        title: "Titik Pandang",
        description:
          "Mengamati alam Bandung dari ketinggian Tebing Keraton secara panorama.",
        image: "/rumah/rumah2.jpg",
      },
    ],
  },
  {
    id: "jabar-alun-masjid-raya-bandung",
    title: "Alun-alun & Masjid Raya Bandung",
    location: "Jawa Barat",
    description:
      "Menjelajahi Alun-alun dan Masjid Raya Bandung secara virtual dengan suasana kota dan ruang publiknya.",
    heroImage: "/rumah/rumah3.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/alun-alun-dan-masjid-raya-bandung/src/index.htm",
    canEmbed: true,
    highlights: [
      "Lapangan alun-alun dan area publik",
      "Fasad Masjid Raya Bandung dan sekitarnya",
    ],
    themes: ["Warisan Budaya", "Ritual Historis"],
    stops: [
      {
        title: "Area Alun-alun",
        description:
          "Berada di tengah alun-alun dengan pandangan langsung ke Masjid Raya Bandung.",
        image: "/rumah/rumah3.jpg",
      },
    ],
  },
  {
    id: "bali-nusa-penida",
    title: "Nusa Penida Cliffside",
    location: "Nusa Penida, Bali",
    description:
      "Rasakan suasana tebing dan pantai Nusa Penida melalui tur 360° dengan panorama laut biru.",
    heroImage: "/kesenian/kesenian6.jpg",
    embedUrl:
      "https://indonesiavirtualtour.com/storage/destination/nusa-penida/src/index.htm",
    canEmbed: true,
    highlights: [
      "Panorama tebing dan laut Nusa Penida",
      "Jalur tepi tebing dan area pantai",
    ],
    themes: ["Panorama Alam"],
    stops: [
      {
        title: "Tebing Utama",
        description:
          "Melihat tebing dan laut lepas dari sudut pandang panorama.",
        image: "/kesenian/kesenian6.jpg",
      },
    ],
  },
];

const VirtualTourModules = () => {
  const [selectedTourId, setSelectedTourId] = useState(tours[0]?.id);
  const [fullscreenTour, setFullscreenTour] = useState<VirtualTour | null>(
    null
  );
  const [activeTheme, setActiveTheme] = useState<string | null>(null);
  const [isNarrationLoading, setIsNarrationLoading] = useState(false);
  const [isNarrationPlaying, setIsNarrationPlaying] = useState(false);
  const narrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<string[]>([]);

  const stats = useMemo(() => {
    const regions = new Set(tours.map((tour) => tour.location));
    return {
      totalTours: tours.length,
      totalRegions: regions.size,
    };
  }, []);

  const themedHighlights = useMemo(() => {
    const allThemes = tours.flatMap((tour) => tour.themes || []);
    return Array.from(new Set(allThemes));
  }, []);

  const filteredTours = useMemo(() => {
    if (!activeTheme) return tours;
    return tours.filter((tour) => tour.themes?.includes(activeTheme));
  }, [activeTheme]);

  const toursForList = activeTheme ? filteredTours : tours;
  const showNoThemeMatches = Boolean(activeTheme) && toursForList.length === 0;
  const activeCollection = toursForList.length ? toursForList : tours;

  useEffect(() => {
    if (!toursForList.length) return;
    const exists = toursForList.some((tour) => tour.id === selectedTourId);
    if (!exists) {
      setSelectedTourId(toursForList[0].id);
    }
  }, [toursForList, selectedTourId]);

  const activeTour =
    activeCollection.find((tour) => tour.id === selectedTourId) ??
    activeCollection[0];

  const openFullscreen = (tour: VirtualTour) => {
    if (tour.canEmbed === false) {
      window.open(tour.embedUrl, "_blank", "noopener,noreferrer");
      return;
    }
    setFullscreenTour(tour);
  };

  const closeFullscreen = () => setFullscreenTour(null);

  const stopNarration = () => {
    setIsNarrationPlaying(false);
    setIsNarrationLoading(false);
    if (narrationAudioRef.current) {
      narrationAudioRef.current.pause();
      narrationAudioRef.current.currentTime = 0;
      narrationAudioRef.current = null;
    }
  };

  const handleNarration = async () => {
    if (isNarrationPlaying) {
      stopNarration();
      return;
    }

    try {
      setIsNarrationLoading(true);
      const payload = {
        text: `${activeTour.description}
Highlight: ${activeTour.highlights.join(", ")}
${
  chatMessages.length
    ? `User context: ${chatMessages[chatMessages.length - 1]}`
    : ""
}`,
        daerahNama: activeTour.title,
      };
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Gagal membuat narasi AI.");
      }

      const blob = await response.blob();
      const audioUrl = URL.createObjectURL(blob);
      const audio = new Audio(audioUrl);
      narrationAudioRef.current = audio;

      audio.onended = () => {
        URL.revokeObjectURL(audioUrl);
        stopNarration();
      };

      audio.onerror = () => {
        URL.revokeObjectURL(audioUrl);
        stopNarration();
        alert("Gagal memutar audio narasi.");
      };

      await audio.play();
      setIsNarrationPlaying(true);
      setIsNarrationLoading(false);
    } catch (error) {
      console.error("Narration error:", error);
      stopNarration();
      alert(
        "Tidak dapat memutar narasi AI sekarang. Pastikan ElevenLabs & Gemini sudah dikonfigurasi."
      );
    }
  };

  const handleChatSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    setChatMessages((prev) => [...prev.slice(-4), chatInput.trim()]);
    setChatInput("");
  };

  useEffect(() => () => stopNarration(), []);

  return (
    <>
      <section className="bg-gradient-to-b from-red-50 via-white to-yellow-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16">
        <header className="text-center max-w-3xl mx-auto mb-12">
          <p className="text-sm uppercase tracking-widest text-red-500">
            Virtual Tour
          </p>
          <h1 className="text-4xl font-semibold mt-2 mb-4 text-gray-900">
            Jelajah Nusantara secara Imersif
          </h1>
          <p className="text-gray-600">
            Pilih salah satu rute dan nikmati pengalaman tur 360° lengkap
            dengan narasi budaya, highlight visual, dan tips singkat sebelum
            Anda benar benar berkunjung.
          </p>
        </header>

        <div className="mb-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-red-600">
              Kurasi
            </p>
            <p className="mt-2 text-4xl font-semibold text-gray-900">
              {stats.totalTours}
              <span className="text-base font-medium text-gray-500 ml-2">
                tur interaktif
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Koleksi tur budaya yang bisa Anda jalani langsung dari layar
              perangkat.
            </p>
          </div>
          <div className="rounded-3xl border border-red-100 bg-gradient-to-br from-red-50 to-white p-6 shadow-sm">
            <p className="text-sm uppercase tracking-[0.3em] text-red-600">
              Sebaran Daerah
            </p>
            <p className="mt-2 text-4xl font-semibold text-gray-900">
              {stats.totalRegions}
              <span className="text-base font-medium text-gray-500 ml-2">
                lokasi
              </span>
            </p>
            <p className="mt-2 text-sm text-gray-600">
              Dari ibukota hingga kawasan bersejarah di luar Jawa.
            </p>
          </div>
          <div className="rounded-3xl border border-red-200 bg-gradient-to-br from-red-600 to-red-500 text-white p-6 shadow-lg">
            <p className="text-sm uppercase tracking-[0.3em] text-white/80">
              Tema Tur
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {themedHighlights.map((theme) => {
                const isActive = activeTheme === theme;
                return (
                  <button
                    key={theme}
                    onClick={() =>
                      setActiveTheme((prev) => (prev === theme ? null : theme))
                    }
                    className={`rounded-full px-3 py-1 text-sm transition ${
                      isActive
                        ? "bg-white/90 text-gray-900"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    {theme}
                  </button>
                );
              })}
            </div>
            <p className="mt-3 text-sm text-gray-200">
              Pilih tur favorit Anda dan mulai jelajah.
            </p>
            {activeTheme && (
              <button
                onClick={() => setActiveTheme(null)}
                className="mt-3 text-xs uppercase tracking-[0.3em] text-gray-400 hover:text-white transition"
              >
                Reset tema
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <aside className="bg-white/80 backdrop-blur rounded-3xl shadow-lg p-4 h-fit">
            <p className="text-sm font-semibold text-gray-500 mb-4">
              Pilih destinasi
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-3 max-h-[420px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {showNoThemeMatches ? (
                  <div className="rounded-2xl border border-dashed border-gray-200 bg-white/80 p-4 text-sm text-gray-600">
                    Belum ada tur dengan tema <strong>{activeTheme}</strong>.
                    Silakan pilih tema lain.
                  </div>
                ) : (
                  toursForList.map((tour) => {
                    const isActive = tour.id === activeTour.id;
                    return (
                      <button
                        key={tour.id}
                        onClick={() => setSelectedTourId(tour.id)}
                        className={`text-left rounded-2xl border transition-all p-4 ${
                          isActive
                            ? "border-red-500 bg-gradient-to-br from-red-500/10 to-white shadow-md"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        <p className="text-[11px] uppercase tracking-[0.3em] text-gray-500">
                          {tour.location}
                        </p>
                        <p className="font-semibold text-gray-900">
                          {tour.title}
                        </p>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
            <div className="mt-6 space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-900">
                Tips menikmati virtual tour:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Gunakan headphone untuk efek audio 3D.</li>
                <li>Perbesar tampilan video dan aktifkan resolusi 4K.</li>
                <li>
                  Catat spot favorit lalu tandai di{" "}
                  <Link href="/map" className="text-red-600 underline">
                    peta interaktif
                  </Link>
                  .
                </li>
              </ul>
            </div>
          </aside>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
              <div className="relative h-72 sm:h-96">
                <Image
                  src={activeTour.heroImage}
                  alt={activeTour.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
                  <div className="flex items-center gap-2 text-sm uppercase tracking-[0.3em] text-white/80">
                    <MapPin className="w-4 h-4" />
                    {activeTour.location}
                  </div>
                  <h2 className="text-3xl font-semibold">{activeTour.title}</h2>
                  <p className="text-white/90">{activeTour.description}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap gap-3">
                  {activeTour.highlights.map((highlight) => (
                    <span
                      key={highlight}
                      className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-sm"
                    >
                      {highlight}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button asChild>
                    <a href="#virtual-tour-viewer">Mulai Tur Virtual</a>
                  </Button>
                </div>
              </div>
            </div>

            <div
              id="virtual-tour-viewer"
              className="bg-white rounded-3xl shadow-xl p-6"
            >
              {activeTour.canEmbed !== false ? (
                <>
                  <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-500">
                        Virtual Tour 360°
                      </p>
                      <p className="text-xs text-gray-500">
                        Gunakan cursor atau sentuhan untuk berkeliling, lalu
                        klik tombol di samping untuk tampilan layar penuh.
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openFullscreen(activeTour)}
                    >
                      Perbesar
                    </Button>
                  </div>
                  <div className="aspect-video rounded-2xl overflow-hidden shadow-lg">
                    <iframe
                      src={activeTour.embedUrl}
                      title={activeTour.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-gray-500">
                      Virtual tour eksternal
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          activeTour.embedUrl,
                          "_blank",
                          "noopener,noreferrer"
                        )
                      }
                    >
                      Kunjungi Tur
                    </Button>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Tur ini dibuka di situs resmi penyedia dan tidak dapat
                    ditampilkan langsung di dalam aplikasi karena pengaturan
                    keamanan situs tersebut.
                  </p>
                </>
              )}
              <p className="text-xs text-gray-400 mt-4">
                Virtual tour dihadirkan melalui Indonesia Virtual Tour
              </p>
            </div>

            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                  Narasi AI
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  Dengarkan cerita tentang {activeTour.title}
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Sistem akan merangkai deskripsi singkat seperti saat Anda
                  menekan tombol audio di peta. Cocok untuk mengenal destinasi
                  sebelum mulai tur.
                </p>
              </div>
              <button
                onClick={handleNarration}
                disabled={isNarrationLoading}
                className="w-full rounded-2xl bg-red-500 text-white py-3 font-semibold shadow-lg hover:bg-red-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isNarrationLoading
                  ? "Menyiapkan narasi..."
                  : isNarrationPlaying
                  ? "Hentikan Audio"
                  : "Putar Narasi AI"}
              </button>
              <p className="text-xs text-gray-500 text-center">
                Suara: ElevenLabs · Konten: Gemini 2.0 · Bahasa: Indonesia
              </p>
            </div>
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-red-500">
                  Chat Lokasi
                </p>
                <h3 className="text-lg font-semibold text-gray-900 mt-1">
                  Beri tahu AI Anda berada di mana
                </h3>
                <p className="text-sm text-gray-600 mt-2">
                  Pesan terakhir akan dipakai sebagai konteks sebelum narasi
                  diputar, sehingga penjelasan lebih relevan dengan bagian yang
                  sedang Anda lihat.
                </p>
              </div>
              <div className="h-32 rounded-2xl border border-dashed border-gray-200 p-3 overflow-y-auto text-sm text-gray-700 space-y-2">
                {chatMessages.length === 0 ? (
                  <p className="text-gray-500">
                    Belum ada chat. Ceritakan ke AI bagian budaya yang sedang
                    Anda jelajahi (contoh: “Saya lagi lihat panggung utama
                    Gedung Kesenian”).
                  </p>
                ) : (
                  chatMessages.map((msg, idx) => (
                    <div key={`${msg}-${idx}`}>
                      <p className="text-[11px] uppercase tracking-[0.3em] text-gray-400">
                        Anda
                      </p>
                      <p>{msg}</p>
                    </div>
                  ))
                )}
              </div>
              <form onSubmit={handleChatSubmit} className="space-y-2">
                <textarea
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Tuliskan lokasi/spot yang sedang Anda lihat..."
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                  rows={2}
                />
                <Button
                  type="submit"
                  className="w-full"
                  disabled={!chatInput.trim()}
                >
                  Kirim Chat Lokasi
                </Button>
              </form>
              {chatMessages.length > 0 && (
                <p className="text-[11px] text-gray-400 text-center">
                  Narasi berikutnya akan menyertakan konteks ini.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
      {fullscreenTour && (
        <div className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex flex-col">
          <div className="flex items-center justify-between px-6 py-4 text-white border-b border-white/10">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-red-200">
                Mode layar penuh
              </p>
              <p className="text-xl font-semibold">{fullscreenTour.title}</p>
              <p className="text-sm text-white/70">{fullscreenTour.location}</p>
            </div>
            <button
              onClick={closeFullscreen}
              className="rounded-full border border-white/30 px-4 py-2 text-sm font-medium hover:bg-white/10 transition"
            >
              Tutup
            </button>
          </div>
          <div className="flex-1 p-4">
            <div className="h-full rounded-3xl bg-black shadow-2xl overflow-hidden">
              <iframe
                src={fullscreenTour.embedUrl}
                title={fullscreenTour.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualTourModules;
