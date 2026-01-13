# 🎓 Suvi Training - LPK Profile Website

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.1-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)
![Prisma](https://img.shields.io/badge/Prisma-6.19-2D3748?logo=prisma)
![MySQL](https://img.shields.io/badge/MySQL-8.x-4479A1?logo=mysql)

**Website profil resmi Suvi Training - Lembaga Pelatihan Kerja (LPK) Terakreditasi**

[Demo](#) • [Documentation](#) • [Report Bug](#)

</div>

---

## 📋 Table of Contents

1. [Overview Project](#-overview-project)
2. [Tech Stack](#-tech-stack)
3. [Step by Step Installation](#-step-by-step-installation)
4. [Application Mechanism & Flow](#-application-mechanism--flow)

---

## 🎯 Overview Project

**Suvi Training** adalah website profil modern untuk Lembaga Pelatihan Kerja (LPK) yang berbasis di Bontang, Indonesia. Website ini dirancang untuk menampilkan program pelatihan, memfasilitasi pendaftaran calon peserta, dan menyediakan fitur verifikasi sertifikat alumni.

### 🌟 Key Features

| Feature | Description |
|---------|-------------|
| **📚 Course Catalog** | Menampilkan daftar program pelatihan dengan kategori, harga, dan durasi |
| **🎨 Modern UI/UX** | Desain responsif dengan animasi smooth menggunakan Tailwind CSS |
| **💬 WhatsApp Integration** | Tombol CTA yang terhubung langsung ke WhatsApp untuk lead generation |
| **📜 Certificate Verification** | Fitur publik untuk verifikasi keaslian sertifikat alumni |
| **🔐 Admin Dashboard** | Panel admin yang terproteksi untuk manajemen kursus dan leads |
| **🔍 SEO Optimized** | Metadata, Open Graph, dan struktur yang SEO-friendly |

### 🎯 Target Users

- **Calon Peserta**: Melihat program pelatihan dan mendaftar via WhatsApp
- **Alumni**: Memverifikasi sertifikat yang dimiliki
- **Admin**: Mengelola konten kursus, melihat lead, dan mengelola sertifikat

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 16.1.1 | React framework dengan App Router & Turbopack |
| **React** | 19.2.3 | UI library |
| **TypeScript** | 5.x | Type-safe JavaScript |
| **Tailwind CSS** | 4.x | Utility-first CSS framework |
| **Lucide React** | 0.562+ | Modern icon library |

### Backend & Database
| Technology | Version | Purpose |
|------------|---------|---------|
| **Prisma ORM** | 6.19 | Type-safe database client |
| **MySQL** | 8.x | Relational database |
| **NextAuth.js** | 5.0 (Beta) | Authentication with Credentials provider |
| **bcryptjs** | 3.x | Password hashing |

### Development Tools
| Technology | Purpose |
|------------|---------|
| **ESLint** | Code linting |
| **Cheerio** | Web scraping untuk seeding data |
| **Axios** | HTTP client |

### Project Structure

```
MVP-SuviProfile/
├── app/                    # Next.js App Router
│   ├── admin/              # Protected admin routes
│   │   ├── courses/        # Course management (CRUD)
│   │   ├── dashboard/      # Admin dashboard
│   │   └── leads/          # Lead management
│   ├── api/auth/           # NextAuth API routes
│   ├── auth/               # Login page
│   ├── cek-sertifikat/     # Certificate verification page
│   ├── kursus/[slug]/      # Dynamic course detail page
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Homepage
├── components/             # Reusable React components
│   ├── ui/                 # Shadcn/Radix UI components
│   ├── CourseCard.tsx      # Course card component
│   ├── HeroSection.tsx     # Landing page hero
│   ├── WhatsAppButton.tsx  # WhatsApp CTA button
│   └── ...
├── lib/                    # Utility functions
│   ├── db.ts               # Prisma client singleton
│   └── utils.ts            # Helper utilities
├── prisma/
│   └── schema.prisma       # Database schema
├── public/
│   └── uploads/courses/    # Course images
├── scripts/
│   └── seed-scrape.ts      # Database seeding script
├── auth.ts                 # NextAuth configuration
├── middleware.ts           # Route protection middleware
└── package.json
```

---

## 🚀 Step by Step Installation

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20.x or higher) - [Download](https://nodejs.org/)
- **MySQL** (v8.x) - [Download](https://dev.mysql.com/downloads/)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/MVP-SuviProfile.git
cd MVP-SuviProfile
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database Connection
# Format: mysql://USER:PASSWORD@HOST:PORT/DATABASE
DATABASE_URL="mysql://root:yourpassword@localhost:3306/suvi_training"

# NextAuth Configuration
AUTH_SECRET="your-super-secret-key-min-32-characters"
AUTH_URL="http://localhost:3000"

# Optional: NextAuth Trust Host (for production)
AUTH_TRUST_HOST=true
```

> ⚠️ **Important**: The `DATABASE_URL` must use the `mysql://` protocol. Do not use `prisma://` unless you're using Prisma Accelerate.

### Step 4: Setup the Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database (creates tables)
npm run db:push

# Seed the database with sample data
npm run db:seed
```

### Step 5: Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Step 6: Create Admin Account (Optional)

To access the admin dashboard, you need to create an admin account directly in the database:

```sql
-- Run this in MySQL console or a GUI tool like MySQL Workbench
INSERT INTO admins (email, password, name, created_at, updated_at)
VALUES (
  'admin@suvi.com',
  '$2a$10$YourHashedPasswordHere',  -- Use bcrypt hash
  'Admin Suvi',
  NOW(),
  NOW()
);
```

Or create a seeder script to add an admin.

---

## 🔄 Application Mechanism & Flow

### 1. Public User Flow (Calon Peserta)

```
┌─────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Homepage   │────▶│ Course List  │────▶│  Course Detail  │
│  (page.tsx) │     │  (Section)   │     │ (/kursus/[slug])│
└─────────────┘     └──────────────┘     └─────────────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │ WhatsApp Button │
                                         │  (Lead Capture) │
                                         └─────────────────┘
                                                   │
                                                   ▼
                                         ┌─────────────────┐
                                         │  WhatsApp Chat  │
                                         │  (Redirect)     │
                                         └─────────────────┘
```

**Flow Description:**
1. User lands on the **Homepage** and sees the Hero section with CTA
2. User scrolls to view **Course List** section with all available programs
3. User clicks on a course to view the **Course Detail** page with syllabus
4. User clicks the **WhatsApp Button** to inquire about the course
5. A **Lead** is optionally recorded in the database before redirecting to WhatsApp

### 2. Certificate Verification Flow (Alumni)

```
┌─────────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Cek Sertifikat     │────▶│   Input Nomor   │────▶│  Verification   │
│  (/cek-sertifikat)  │     │   Sertifikat    │     │     Result      │
└─────────────────────┘     └─────────────────┘     └─────────────────┘
                                     │                       │
                                     ▼                       ▼
                            ┌─────────────────┐     ┌─────────────────┐
                            │  Server Action  │     │  Certificate    │
                            │  (actions.ts)   │     │     Card        │
                            └─────────────────┘     └─────────────────┘
```

**Flow Description:**
1. Alumni navigates to `/cek-sertifikat` page
2. Enters the certificate number in the search form
3. **Server Action** queries the database for the certificate
4. Result is displayed: Certificate found (with details) or not found

### 3. Admin Authentication Flow

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Admin Route    │────▶│   Middleware    │────▶│  Login Page     │
│  (/admin/*)     │     │  (middleware.ts)│     │  (/auth/login)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                               │                         │
                               │ (Authenticated)         │
                               ▼                         ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │  Admin Dashboard│     │   NextAuth.js   │
                        │  (/admin/...)   │     │   (auth.ts)     │
                        └─────────────────┘     └─────────────────┘
```

**Flow Description:**
1. When accessing any `/admin/*` route, **Middleware** intercepts the request
2. If not authenticated, redirects to `/auth/login`
3. Admin enters credentials, **NextAuth.js** validates against the database
4. On success, redirects to **Admin Dashboard**

### 4. Admin Dashboard Features

```
┌─────────────────────────────────────────────────────────────────┐
│                        ADMIN DASHBOARD                          │
├─────────────────┬─────────────────┬─────────────────────────────┤
│   📊 Dashboard  │   📚 Courses    │   📋 Leads                   │
│   - Statistics  │   - List/CRUD   │   - View leads              │
│   - Overview    │   - Add/Edit    │   - Update status           │
│                 │   - Syllabus    │   - Export (planned)        │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### 5. Data Flow Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                           CLIENT                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   React      │  │   Server     │  │   Client     │            │
│  │   Components │  │   Components │  │   Components │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      NEXT.JS SERVER                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐            │
│  │   API Routes │  │   Server     │  │   Middleware │            │
│  │   (/api/*)   │  │   Actions    │  │              │            │
│  └──────────────┘  └──────────────┘  └──────────────┘            │
└────────────────────────────┬─────────────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────────────┐
│                      DATA LAYER                                   │
│  ┌──────────────┐  ┌──────────────┐                              │
│  │   Prisma     │──│   MySQL      │                              │
│  │   ORM        │  │   Database   │                              │
│  └──────────────┘  └──────────────┘                              │
└──────────────────────────────────────────────────────────────────┘
```

### 6. Database Schema Overview

```
┌─────────────┐       ┌─────────────┐
│   admins    │       │   kursus    │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ email       │       │ judul       │
│ password    │       │ slug        │
│ name        │       │ deskripsi   │
│ created_at  │       │ kategori    │
│ updated_at  │       │ durasi      │
└─────────────┘       │ harga       │
                      │ gambar_url  │
                      │ syllabus    │
                      │ is_active   │
                      └──────┬──────┘
                             │
                             │ 1:N
                             ▼
                      ┌─────────────┐
                      │   leads     │
                      ├─────────────┤
                      │ id          │
                      │ nama        │
                      │ no_wa       │
                      │ kursus_id   │───▶ FK to kursus
                      │ source      │
                      │ status      │
                      │ catatan     │
                      └─────────────┘

┌─────────────┐       ┌─────────────┐
│ sertifikat  │       │  testimoni  │
├─────────────┤       ├─────────────┤
│ id          │       │ id          │
│ nama        │       │ nama_siswa  │
│ nomor_*     │       │ pekerjaan   │
│ kompetensi  │       │ isi_review  │
│ tanggal_*   │       │ rating      │
└─────────────┘       │ foto_url    │
                      │ is_active   │
                      └─────────────┘
```

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio GUI |
| `npm run db:migrate` | Run database migrations |

---

## 🔧 Troubleshooting

### Database Connection Error (P5010)

If you see `Cannot fetch data from service: fetch failed`:

1. **Check MySQL is running**
2. **Verify DATABASE_URL format**: Must start with `mysql://`
3. **Regenerate Prisma client**: `npm run db:generate`
4. **Clear cache**: Delete `.next` folder and restart

### Middleware Deprecation Warning

Next.js 16 shows a warning about middleware convention. This is cosmetic and doesn't affect functionality.

---

## 📄 License

This project is proprietary software for Suvi Training LPK.

---

<div align="center">

**Made with ❤️ for Suvi Training**

[↑ Back to Top](#-suvi-training---lpk-profile-website)

</div>
