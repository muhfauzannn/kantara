import { jenisKebudayaan } from "@prisma/client";

type FallbackKebudayaan = {
  id: string;
  nama: string;
  jenis: jenisKebudayaan;
  images: string[];
  description: string;
  createdAt: Date;
  updatedAt: Date;
  virtualTour: string | null;
  daerahId: string;
};

export type FallbackDaerah = {
  id: string;
  nama: string;
  description: string;
  latitude: number | null;
  longitude: number | null;
  icon: string | null;
  backgroundImg: string | null;
  images: string[];
  createdAt: Date;
  updatedAt: Date;
  kebudayaans: FallbackKebudayaan[];
};

const now = new Date();

export const fallbackDaerahData: FallbackDaerah[] = [
  {
    id: "fallback-jakarta",
    nama: "DKI Jakarta",
    description:
      "Ibu kota dengan keragaman budaya Betawi dan pengaruh dari seluruh Nusantara.",
    latitude: -6.2088,
    longitude: 106.8456,
    icon: "/icon/bali.png",
    backgroundImg: null,
    images: ["/kesenian/kesenian1.jpg", "/rumah/rumah1.jpeg"],
    createdAt: now,
    updatedAt: now,
    kebudayaans: [
      {
        id: "fallback-jakarta-suku",
        nama: "Suku Betawi",
        jenis: "SUKU_ADAT",
        images: ["/suku/suku1.jpeg"],
        description:
          "Suku asli Jakarta dengan perpaduan budaya Arab, Tionghoa, dan Eropa.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jakarta",
      },
      {
        id: "fallback-jakarta-makanan",
        nama: "Kerak Telor",
        jenis: "MAKANAN_KHAS",
        images: ["/makanan/makanan1.webp"],
        description:
          "Kuliner khas Betawi berbahan ketan dan telur dengan cita rasa gurih.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jakarta",
      },
      {
        id: "fallback-jakarta-kesenian",
        nama: "Tari Topeng Betawi",
        jenis: "KESENIAN_DAERAH",
        images: ["/kesenian/kesenian1.jpg"],
        description:
          "Pertunjukan tari dengan topeng karakter mencerminkan dinamika kehidupan kota.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jakarta",
      },
    ],
  },
  {
    id: "fallback-jabar",
    nama: "Jawa Barat",
    description:
      "Rumah bagi budaya Sunda dengan alam pegunungan dan tradisi yang ramah.",
    latitude: -6.9175,
    longitude: 107.6191,
    icon: "/icon/bali.png",
    backgroundImg: null,
    images: ["/kesenian/kesenian2.jpeg", "/rumah/rumah2.jpg"],
    createdAt: now,
    updatedAt: now,
    kebudayaans: [
      {
        id: "fallback-jabar-suku",
        nama: "Suku Sunda",
        jenis: "SUKU_ADAT",
        images: ["/suku/suku2.jpeg"],
        description:
          "Suku besar di Tatar Pasundan dengan filosofi silih asah, silih asih.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jabar",
      },
      {
        id: "fallback-jabar-kesenian",
        nama: "Tari Jaipong",
        jenis: "KESENIAN_DAERAH",
        images: ["/kesenian/kesenian7.webp"],
        description:
          "Tari dinamis yang memadukan gerakan ketuk tilu dan pencak silat.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jabar",
      },
      {
        id: "fallback-jabar-makanan",
        nama: "Nasi Timbel",
        jenis: "MAKANAN_KHAS",
        images: ["/makanan/makanan2.jpg"],
        description:
          "Nasi hangat dibungkus daun pisang dengan lauk lalap dan sambal.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jabar",
      },
    ],
  },
  {
    id: "fallback-bali",
    nama: "Bali",
    description:
      "Pulau Dewata dengan arsitektur pura dan upacara keagamaan yang khas.",
    latitude: -8.6705,
    longitude: 115.2126,
    icon: "/icon/bali.png",
    backgroundImg: null,
    images: ["/kesenian/kesenian6.jpg", "/rumah/rumah4.jpg"],
    createdAt: now,
    updatedAt: now,
    kebudayaans: [
      {
        id: "fallback-bali-kesenian",
        nama: "Tari Kecak",
        jenis: "KESENIAN_DAERAH",
        images: ["/kesenian/kesenian6.jpg"],
        description:
          "Tari kolosal dengan paduan suara 'cak' menggambarkan kisah Ramayana.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-bali",
      },
      {
        id: "fallback-bali-makanan",
        nama: "Bebek Betutu",
        jenis: "MAKANAN_KHAS",
        images: ["/makanan/makanan4.jpg"],
        description:
          "Bebek berbumbu rempah lengkap yang dimasak perlahan dalam balutan daun.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-bali",
      },
      {
        id: "fallback-bali-rumah",
        nama: "Gapura Candi Bentar",
        jenis: "RUMAH_ADAT",
        images: ["/rumah/rumah4.jpg"],
        description:
          "Pintu masuk khas arsitektur Bali yang melambangkan keseimbangan sekala-niskala.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-bali",
      },
    ],
  },
  {
    id: "fallback-sumbar",
    nama: "Sumatera Barat",
    description:
      "Tanah Minangkabau dengan tradisi matrilineal dan kuliner mendunia.",
    latitude: -0.9493,
    longitude: 100.3543,
    icon: "/icon/bali.png",
    backgroundImg: null,
    images: ["/kesenian/kesenian5.jpeg", "/rumah/rumah5.jpeg"],
    createdAt: now,
    updatedAt: now,
    kebudayaans: [
      {
        id: "fallback-sumbar-suku",
        nama: "Suku Minangkabau",
        jenis: "SUKU_ADAT",
        images: ["/suku/suku5.jpeg"],
        description:
          "Suku matrilineal terbesar yang dikenal dengan falsafah adat basandi syarak.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-sumbar",
      },
      {
        id: "fallback-sumbar-rumah",
        nama: "Rumah Gadang",
        jenis: "RUMAH_ADAT",
        images: ["/rumah/rumah5.jpeg"],
        description:
          "Rumah adat beratap gonjong yang melambangkan tanduk kerbau.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-sumbar",
      },
      {
        id: "fallback-sumbar-makanan",
        nama: "Rendang",
        jenis: "MAKANAN_KHAS",
        images: ["/makanan/makanan5.jpg"],
        description:
          "Olahan daging bercita rasa kaya rempah yang dimasak hingga kering.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-sumbar",
      },
    ],
  },
  {
    id: "fallback-jogja",
    nama: "DI Yogyakarta",
    description:
      "Kota budaya dengan warisan keraton, candi, dan karya seni kontemporer.",
    latitude: -7.7956,
    longitude: 110.3695,
    icon: "/icon/bali.png",
    backgroundImg: null,
    images: ["/kesenian/kesenian7.webp", "/rumah/rumah3.jpg"],
    createdAt: now,
    updatedAt: now,
    kebudayaans: [
      {
        id: "fallback-jogja-kesenian",
        nama: "Tari Bedhaya",
        jenis: "KESENIAN_DAERAH",
        images: ["/kesenian/kesenian7.webp"],
        description:
          "Tari sakral keraton yang menggambarkan harmoni antara manusia dan alam.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jogja",
      },
      {
        id: "fallback-jogja-makanan",
        nama: "Gudeg",
        jenis: "MAKANAN_KHAS",
        images: ["/makanan/makanan3.jpg"],
        description:
          "Masakan nangka muda bercita rasa manis yang disajikan dengan sambal krecek.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jogja",
      },
      {
        id: "fallback-jogja-rumah",
        nama: "Rumah Joglo",
        jenis: "RUMAH_ADAT",
        images: ["/rumah/rumah3.jpg"],
        description:
          "Rumah tradisional dengan atap bergelombang melambangkan strata sosial.",
        createdAt: now,
        updatedAt: now,
        virtualTour: null,
        daerahId: "fallback-jogja",
      },
    ],
  },
];

export const getFallbackDaerahById = (id: string) =>
  fallbackDaerahData.find((item) => item.id === id) ?? null;
