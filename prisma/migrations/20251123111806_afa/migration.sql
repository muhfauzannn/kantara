-- CreateEnum
CREATE TYPE "jenisKebudayaan" AS ENUM ('SUKU_ADAT', 'RUMAH_ADAT', 'MAKANAN_KHAS', 'KESENIAN_DAERAH');

-- CreateTable
CREATE TABLE "daerah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "longitude" DOUBLE PRECISION,
    "latitude" DOUBLE PRECISION,
    "icon" TEXT,
    "backgroundImg" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daerah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kebudayaan" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jenis" "jenisKebudayaan" NOT NULL,
    "daerahId" TEXT NOT NULL,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kebudayaan_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "kebudayaan" ADD CONSTRAINT "kebudayaan_daerahId_fkey" FOREIGN KEY ("daerahId") REFERENCES "daerah"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
