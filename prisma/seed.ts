import "dotenv/config";
import { PrismaClient } from "../lib/generated/prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Available images from each category for random selection
  const availableImages = {
    suku: [
      "suku1.jpeg",
      "suku2.jpeg",
      "suku3.jpg",
      "suku4.jpg",
      "suku5.jpeg",
      "suku6.jpeg",
      "suku7.webp",
      "suku8.jpeg",
      "suku9.webp",
    ],
    rumah: [
      "rumah1.jpeg",
      "rumah2.jpg",
      "rumah3.jpg",
      "rumah4.jpg",
      "rumah5.jpeg",
      "rumah6.jpg",
      "rumah7.jpeg",
      "rumah8.jpeg",
      "rumah9.jpg",
    ],
    makanan: [
      "makanan1.webp",
      "makanan2.jpg",
      "makanan3.jpg",
      "makanan4.jpg",
      "makanan5.jpg",
      "makanan6.jpg",
      "makanan7.jpg",
      "makanan8.jpeg",
      "makanan9.jpeg",
      "makanan10.jpg",
    ],
    kesenian: [
      "kesenian1.jpg",
      "kesenian2.jpeg",
      "kesenian3.webp",
      "kesenian4.jpg",
      "kesenian5.jpeg",
      "kesenian6.jpg",
      "kesenian7.webp",
      "kesenian8.jpg",
      "kesenian9.jpg",
    ],
  };

  // Function to get random images from different categories for daerah
  function getRandomDaerahImages() {
    const categories = ["suku", "rumah", "makanan", "kesenian"];
    const selectedImages: string[] = [];

    categories.forEach((category) => {
      const categoryImages =
        availableImages[category as keyof typeof availableImages];
      const randomIndex = Math.floor(Math.random() * categoryImages.length);
      selectedImages.push(`/${category}/${categoryImages[randomIndex]}`);
    });

    return selectedImages;
  }

  // Data Daerah dengan koordinat dan kebudayaan asli Indonesia
  const daerahData = [
    {
      nama: "DKI Jakarta",
      description:
        "Ibu kota Indonesia yang merupakan pusat pemerintahan dan bisnis dengan keragaman budaya dari seluruh Nusantara.",
      longitude: 106.8456,
      latitude: -6.2088,
      icon: "/icon/bali.png", // Menggunakan icon yang tersedia
      backgroundImg: null,
    },
    {
      nama: "Jawa Barat",
      description:
        "Provinsi dengan budaya Sunda yang kaya, terkenal dengan keramahan dan kearifan lokal yang masih terjaga.",
      longitude: 107.6186,
      latitude: -6.9175,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Jawa Tengah",
      description:
        "Pusat budaya Jawa dengan warisan kerajaan Mataram, Majapahit, dan berbagai candi bersejarah.",
      longitude: 110.3695,
      latitude: -7.7956,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "DI Yogyakarta",
      description:
        "Kota pelajar dan budaya yang mempertahankan tradisi kerajaan Ngayogyakarta Hadiningrat.",
      longitude: 110.3695,
      latitude: -7.7956,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Jawa Timur",
      description:
        "Provinsi dengan kekayaan budaya yang beragam, dari Majapahit hingga budaya Madura.",
      longitude: 112.2384,
      latitude: -7.536,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Bali",
      description:
        "Pulau Dewata dengan budaya Hindu yang kental dan seni tradisional yang masih hidup.",
      longitude: 115.2126,
      latitude: -8.6705,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Sumatera Barat",
      description:
        "Tanah Minangkabau dengan sistem matrilineal dan budaya merantau yang terkenal.",
      longitude: 100.3543,
      latitude: -0.9493,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Sumatera Utara",
      description:
        "Provinsi dengan keragaman suku Batak, Melayu, dan budaya yang kaya di sekitar Danau Toba.",
      longitude: 98.6738,
      latitude: 3.5952,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
    {
      nama: "Kalimantan Timur",
      description:
        "Tanah Dayak dengan budaya rumah betang dan kearifan lokal dalam menjaga hutan.",
      longitude: 116.8194,
      latitude: 0.5387,
      icon: "/icon/bali.png",
      backgroundImg: null,
    },
  ];

  // Helper function untuk membuat kebudayaan
  async function createKebudayaan(daerahId: string, kebudayaans: any[]) {
    for (const kebudayaan of kebudayaans) {
      await prisma.kebudayaan.create({
        data: {
          nama: kebudayaan.nama,
          description: kebudayaan.description,
          jenis: kebudayaan.jenis,
          daerahId: daerahId,
          images: kebudayaan.images,
          virtualTour: kebudayaan.virtualTour || null,
        },
      });
    }
  }

  // Create Daerah dan Kebudayaan
  let sukuIndex = 1;
  let rumahIndex = 1;
  let makananIndex = 1;
  let kesenianIndex = 1;

  for (let i = 0; i < daerahData.length; i++) {
    const daerah = daerahData[i];

    const createdDaerah = await prisma.daerah.create({
      data: {
        nama: daerah.nama,
        description: daerah.description,
        longitude: daerah.longitude,
        latitude: daerah.latitude,
        icon: daerah.icon,
        backgroundImg: daerah.backgroundImg,
        images: getRandomDaerahImages(),
      },
    });

    // Data kebudayaan berdasarkan daerah
    const kebudayaanData = [];

    // Suku Adat
    if (daerah.nama === "DKI Jakarta") {
      kebudayaanData.push({
        nama: "Suku Betawi",
        description:
          "Suku asli Jakarta dengan budaya campuran berbagai etnis yang membentuk identitas unik Betawi.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpeg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Jawa Barat") {
      kebudayaanData.push({
        nama: "Suku Sunda",
        description:
          "Suku mayoritas di Jawa Barat yang dikenal dengan filosofi hidup yang harmonis dan ramah.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpeg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Jawa Tengah") {
      kebudayaanData.push({
        nama: "Suku Jawa",
        description:
          "Suku terbesar di Indonesia dengan filosofi hidup Jawa yang kaya akan nilai-nilai luhur dan kebijaksanaan.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Bali") {
      kebudayaanData.push({
        nama: "Suku Bali",
        description:
          "Suku asli Bali yang mayoritas beragama Hindu dengan tradisi dan upacara keagamaan yang kaya.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Sumatera Barat") {
      kebudayaanData.push({
        nama: "Suku Minangkabau",
        description:
          "Suku matrilineal terbesar di dunia dengan budaya merantau dan adat istiadat yang kuat.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpeg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Sumatera Utara") {
      kebudayaanData.push({
        nama: "Suku Batak",
        description:
          "Suku dengan sub-etnis yang beragam seperti Batak Toba, Karo, Simalungun dengan budaya yang kental.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpeg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "DI Yogyakarta") {
      kebudayaanData.push({
        nama: "Suku Jawa Yogyakarta",
        description:
          "Suku Jawa dengan ciri khas budaya keraton yang masih terjaga hingga saat ini.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.webp`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Jawa Timur") {
      kebudayaanData.push({
        nama: "Suku Jawa Timur",
        description:
          "Suku dengan keragaman budaya dari Jawa hingga Madura dengan karakteristik yang unik.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.jpeg`],
      });
      sukuIndex++;
    } else if (daerah.nama === "Kalimantan Timur") {
      kebudayaanData.push({
        nama: "Suku Dayak",
        description:
          "Suku asli Kalimantan dengan budaya rumah betang dan kearifan lokal dalam menjaga hutan.",
        jenis: "SUKU_ADAT",
        images: [`/suku/suku${sukuIndex}.webp`],
      });
      sukuIndex++;
    }

    // Rumah Adat
    if (daerah.nama === "DKI Jakarta") {
      kebudayaanData.push({
        nama: "Rumah Kebaya",
        description:
          "Rumah tradisional Betawi dengan bentuk atap seperti pelana yang melengkung menyerupai kebaya.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpeg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Jawa Barat") {
      kebudayaanData.push({
        nama: "Rumah Adat Sunda",
        description:
          "Rumah tradisional Sunda dengan atap berbentuk seperti perahu terbalik yang disebut julang ngapak.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Jawa Tengah") {
      kebudayaanData.push({
        nama: "Rumah Joglo",
        description:
          "Rumah tradisional Jawa dengan atap berbentuk piramid yang melambangkan hubungan antara bumi dan langit.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Bali") {
      kebudayaanData.push({
        nama: "Rumah Gapura Candi Bentar",
        description:
          "Arsitektur rumah tradisional Bali dengan gapura candi bentar sebagai pintu masuk yang bermakna spiritual.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Sumatera Barat") {
      kebudayaanData.push({
        nama: "Rumah Gadang",
        description:
          "Rumah adat Minangkabau dengan atap berbentuk tanduk kerbau yang melambangkan kemenangan dalam legenda.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpeg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Sumatera Utara") {
      kebudayaanData.push({
        nama: "Rumah Bolon",
        description:
          "Rumah tradisional Batak dengan konstruksi panggung dan ukiran yang khas.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "DI Yogyakarta") {
      kebudayaanData.push({
        nama: "Rumah Joglo Yogyakarta",
        description:
          "Rumah tradisional Joglo khas Yogyakarta dengan nilai filosofis yang mendalam.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpeg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Jawa Timur") {
      kebudayaanData.push({
        nama: "Rumah Limasan",
        description:
          "Rumah tradisional Jawa Timur dengan atap limasan yang khas.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpeg`],
      });
      rumahIndex++;
    } else if (daerah.nama === "Kalimantan Timur") {
      kebudayaanData.push({
        nama: "Rumah Betang",
        description:
          "Rumah panjang tradisional Dayak yang dihuni oleh beberapa keluarga dalam satu bangunan.",
        jenis: "RUMAH_ADAT",
        images: [`/rumah/rumah${rumahIndex}.jpg`],
      });
      rumahIndex++;
    }

    // Makanan Khas
    const makananNames = [
      "Kerak Telor",
      "Nasi Timbel",
      "Gudeg",
      "Bebek Betutu",
      "Rendang",
      "Bika Ambon",
      "Soto Banjar",
      "Rawon",
      "Pempek",
    ];

    kebudayaanData.push({
      nama: makananNames[i] || `Makanan Khas ${daerah.nama}`,
      description: `Makanan tradisional khas ${daerah.nama} yang memiliki cita rasa unik dan warisan budaya yang kaya.`,
      jenis: "MAKANAN_KHAS",
      images: [
        `/makanan/makanan${makananIndex}.${
          makananIndex === 1
            ? "webp"
            : makananIndex === 8 || makananIndex === 9
            ? "jpeg"
            : "jpg"
        }`,
      ],
    });
    makananIndex++;

    // Kesenian Daerah
    const kesenianNames = [
      "Tari Topeng Betawi",
      "Tari Jaipong",
      "Tari Bedhaya",
      "Tari Kecak",
      "Tari Piring",
      "Tari Tor-Tor",
      "Tari Gandrung",
      "Tari Reog Ponorogo",
      "Tari Hudoq",
    ];

    kebudayaanData.push({
      nama: kesenianNames[i] || `Kesenian ${daerah.nama}`,
      description: `Kesenian tradisional ${daerah.nama} yang merupakan warisan budaya leluhur dan masih dilestarikan hingga kini.`,
      jenis: "KESENIAN_DAERAH",
      images: [
        `/kesenian/kesenian${kesenianIndex}.${
          kesenianIndex === 2 || kesenianIndex === 5
            ? "jpeg"
            : kesenianIndex === 3 || kesenianIndex === 7
            ? "webp"
            : "jpg"
        }`,
      ],
    });
    kesenianIndex++;

    // Create kebudayaan untuk daerah ini
    await createKebudayaan(createdDaerah.id, kebudayaanData);
  }

  console.log("Seed data berhasil ditambahkan!");
  console.log(`- ${daerahData.length} daerah berhasil dibuat`);
  console.log(`- ${daerahData.length * 4} kebudayaan berhasil dibuat`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
