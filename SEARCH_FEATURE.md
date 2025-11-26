# Fitur Search Daerah

## Overview

Fitur search ini menggunakan kombinasi filtering database dan AI (Gemini) untuk menemukan daerah yang paling relevan dengan query pengguna.

## Cara Kerja

### 1. Filtering Database (Tahap Pertama)

Ketika user melakukan pencarian, sistem akan mencari daerah berdasarkan:

- Nama daerah (case-insensitive)
- Deskripsi daerah
- Nama kebudayaan yang terkait
- Deskripsi kebudayaan

Jika ditemukan hasil dengan filtering biasa, sistem akan langsung mengembalikan hasil tersebut.

### 2. Gemini AI Fallback (Tahap Kedua)

Jika tidak ditemukan hasil dari filtering database, sistem akan:

1. Mengambil semua data daerah dari database
2. Mengirim konteks daerah + query user ke Gemini API
3. Meminta Gemini untuk menganalisis dan menemukan daerah yang paling cocok
4. Gemini akan mengembalikan ID daerah yang paling relevan (maksimal 3) **beserta penjelasan** mengapa daerah tersebut cocok dengan pencarian

### 3. Hasil Pencarian

Sistem akan menampilkan:

- Summary hasil pencarian
- Badge "Hasil dari AI" jika menggunakan Gemini
- Grid card daerah dengan:
  - Gambar atau initial letter dengan gradient
  - Nama daerah
  - **AI Explanation** (jika hasil dari Gemini): Penjelasan singkat mengapa daerah ini cocok dengan pencarian
  - Deskripsi singkat
  - Jumlah kebudayaan
  - Link ke peta

### 4. Auto-redirect ke Peta

Jika hanya ada 1 hasil pencarian:

- Otomatis redirect ke halaman `/map?daerah={id}`
- Peta akan zoom ke lokasi daerah tersebut
- Popup marker akan terbuka otomatis

## API Endpoints

### GET /api/daerah/search

Query parameter:

- `q` (required): Search query

Response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "nama": "Nama Daerah",
      "description": "...",
      "latitude": 0.0,
      "longitude": 0.0,
      "icon": "...",
      "backgroundImg": "...",
      "images": [],
      "kebudayaans": [],
      "aiExplanation": "Penjelasan dari AI (hanya ada jika matchedBy = 'gemini_ai')"
    }
  ],
  "matchedBy": "direct_search" | "gemini_ai" | "gemini_no_match",
  "summary": "Deskripsi hasil pencarian"
}
```

**Field `aiExplanation`**: Hanya tersedia ketika hasil pencarian berasal dari Gemini AI (`matchedBy: "gemini_ai"`). Berisi penjelasan 1-2 kalimat mengapa daerah tersebut cocok dengan query pencarian user.

## Environment Variables

Pastikan `GEMINI_API_KEY` sudah di-set di file `.env`:

```
GEMINI_API_KEY=your_api_key_here
```

## Files Modified/Created

1. `/app/api/daerah/search/route.ts` - Search API endpoint
2. `/app/search/page.tsx` - Search results page
3. `/modules/SearchModules/index.tsx` - Search results component
4. `/components/elements/Navbar/index.tsx` - Updated dengan search functionality
5. `/modules/MapModules/components/Map.tsx` - Updated untuk support auto-zoom ke daerah

## Usage

1. User mengetik query di search bar di Navbar
2. Tekan Enter atau klik icon search
3. Redirect ke `/search?q={query}`
4. Sistem akan mencari daerah yang relevan
5. Klik hasil pencarian untuk zoom ke peta
