# Kantara - Indonesian Culture Explorer

Kantara AI adalah platform berbasis web yang memanfaatkan kecerdasan buatan untuk melestarikan dan mengeksplorasi budaya Indonesia secara interaktif. Melalui peta dinamis dan chatbot budaya, pengguna dapat menelusuri, memahami, dan terhubung dengan kekayaan budaya Nusantara.

## Features

- 🗺️ **Peta Budaya Interaktif** - Jelajahi budaya 38 provinsi Indonesia melalui peta interaktif
- 🤖 **Chatbot Budaya AI** - Tanyakan apa saja tentang budaya Indonesia dengan AI bertenaga Gemini
- 🎨 **Database Budaya** - Informasi lengkap tentang kesenian, makanan, rumah adat, dan suku

## Getting Started

### Prerequisites

- Node.js 18+ installed
- pnpm package manager
- Gemini API Key ([Get it here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository

```bash
git clone <repository-url>
cd kantara
```

2. Install dependencies

```bash
pnpm install
```

3. Setup environment variables

```bash
cp .env.example .env.local
```

4. Add your Gemini API key to `.env.local`

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

5. Setup the database

```bash
pnpm db:seed
```

### Run the development server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
