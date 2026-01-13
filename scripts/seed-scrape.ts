/**
 * Suvi Training - Web Scraping & Database Seeding Script (v2)
 *
 * Features:
 * - Scrapes course data from suviacademy.com
 * - Downloads images locally to public/uploads/courses/
 * - Uses placeholder for failed downloads
 * - Seeds database with local image paths
 *
 * Usage:
 *   npx ts-node scripts/seed-scrape.ts
 *   npx ts-node scripts/seed-scrape.ts --dry-run
 */

import axios from "axios";
import * as cheerio from "cheerio";
import * as fs from "fs";
import * as path from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const BASE_URL = "https://suviacademy.com";
const DRY_RUN = process.argv.includes("--dry-run");

// Directories
const PUBLIC_DIR = path.join(process.cwd(), "public");
const UPLOADS_DIR = path.join(PUBLIC_DIR, "uploads", "courses");
const PLACEHOLDER_PATH = "/uploads/courses/placeholder.jpg";

// ============================================
// Type Definitions
// ============================================
interface ScrapedCourse {
    judul: string;
    slug: string;
    deskripsi: string | null;
    kategori: string;
    durasi: string;
    harga: number | null;
    gambar_url: string | null;
}

// ============================================
// Category Mapping
// ============================================
const CATEGORY_MAP: Record<string, string> = {
    "ms office": "Perkantoran",
    word: "Perkantoran",
    excel: "Perkantoran",
    "power point": "Perkantoran",
    access: "Perkantoran",
    "desain grafis": "Desain",
    "corel draw": "Desain",
    photoshop: "Desain",
    animasi: "Desain",
    teknisi: "Teknis",
    komputer: "Teknis",
    akuntansi: "Bisnis",
    bisnis: "Bisnis",
    manajemen: "Bisnis",
    perpajakan: "Bisnis",
    digital: "Digital",
    marketing: "Digital",
    website: "Digital",
    sosial: "Digital",
    media: "Digital",
};

// ============================================
// Price Mapping (Estimated prices in IDR)
// ============================================
const PRICE_MAP: Record<string, number> = {
    Perkantoran: 1500000,
    Desain: 2000000,
    Teknis: 2500000,
    Bisnis: 1800000,
    Digital: 2200000,
    Lainnya: 1500000,
};

// ============================================
// Utility Functions
// ============================================
function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
}

function categorize(title: string): string {
    const lowerTitle = title.toLowerCase();
    for (const [keyword, category] of Object.entries(CATEGORY_MAP)) {
        if (lowerTitle.includes(keyword)) {
            return category;
        }
    }
    return "Lainnya";
}

function fixImageUrl(url: string | undefined): string | null {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    if (url.startsWith("//")) return `https:${url}`;
    if (url.startsWith("/")) return `${BASE_URL}${url}`;
    return `${BASE_URL}/${url}`;
}

function ensureDirectoryExists(dir: string): void {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
    }
}

// ============================================
// Image Downloading
// ============================================
async function downloadImage(
    imageUrl: string,
    slug: string
): Promise<string | null> {
    try {
        console.log(`   📷 Downloading: ${imageUrl}`);

        const response = await axios.get(imageUrl, {
            responseType: "arraybuffer",
            timeout: 10000,
            headers: {
                "User-Agent":
                    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
            },
        });

        // Determine file extension from content-type or URL
        const contentType = response.headers["content-type"] || "";
        let ext = ".jpg";
        if (contentType.includes("png")) ext = ".png";
        else if (contentType.includes("webp")) ext = ".webp";
        else if (contentType.includes("gif")) ext = ".gif";
        else if (imageUrl.includes(".png")) ext = ".png";
        else if (imageUrl.includes(".webp")) ext = ".webp";

        const filename = `${slug}${ext}`;
        const filepath = path.join(UPLOADS_DIR, filename);
        const publicPath = `/uploads/courses/${filename}`;

        // Write file
        fs.writeFileSync(filepath, Buffer.from(response.data));
        console.log(`   ✅ Saved: ${publicPath}`);

        return publicPath;
    } catch (error) {
        console.log(
            `   ⚠️  Download failed: ${error instanceof Error ? error.message : "Unknown error"}`
        );
        return null;
    }
}

async function processImageForCourse(
    course: ScrapedCourse
): Promise<ScrapedCourse> {
    if (!course.gambar_url) {
        return { ...course, gambar_url: PLACEHOLDER_PATH };
    }

    if (DRY_RUN) {
        return course; // Don't download in dry-run mode
    }

    const localPath = await downloadImage(course.gambar_url, course.slug);
    return {
        ...course,
        gambar_url: localPath || PLACEHOLDER_PATH,
    };
}

// ============================================
// Placeholder Image Generation
// ============================================
function createPlaceholderImage(): void {
    const placeholderPath = path.join(UPLOADS_DIR, "placeholder.jpg");

    if (fs.existsSync(placeholderPath)) {
        console.log("📷 Placeholder image already exists");
        return;
    }

    // Create a simple 1x1 gray pixel JPEG as placeholder
    // In production, you'd want a proper placeholder image
    const grayPixelJpeg = Buffer.from([
        0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
        0x01, 0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43,
        0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08, 0x07, 0x07, 0x07, 0x09,
        0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
        0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20,
        0x24, 0x2e, 0x27, 0x20, 0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29,
        0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27, 0x39, 0x3d, 0x38, 0x32,
        0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
        0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00,
        0x01, 0x05, 0x01, 0x01, 0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00,
        0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08,
        0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00, 0x02, 0x01, 0x03,
        0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d,
        0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06,
        0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
        0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72,
        0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
        0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45,
        0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
        0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75,
        0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
        0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3,
        0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
        0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9,
        0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
        0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4,
        0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xff, 0xda, 0x00, 0x08, 0x01, 0x01,
        0x00, 0x00, 0x3f, 0x00, 0xfb, 0xd5, 0xdb, 0x20, 0xa8, 0xf1, 0x7f, 0xff,
        0xd9,
    ]);

    fs.writeFileSync(placeholderPath, grayPixelJpeg);
    console.log("📷 Created placeholder image");
}

// ============================================
// Scraping Functions
// ============================================
async function fetchPage(url: string) {
    console.log(`📥 Fetching: ${url}`);
    const { data } = await axios.get(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        },
    });
    return cheerio.load(data);
}

async function scrapeHomepage(): Promise<ScrapedCourse[]> {
    const $ = await fetchPage(BASE_URL);
    const courses: ScrapedCourse[] = [];

    $("li").each((_, element) => {
        const $el = $(element);
        const text = $el.text().trim();

        const coursePatterns = [
            "MS Office",
            "Desain Grafis",
            "Teknisi Komputer",
            "Animasi",
            "Akuntansi",
            "Bisnis Manajemen",
            "Perpajakan",
            "Digital",
            "Website",
            "Sosial Media",
        ];

        for (const pattern of coursePatterns) {
            if (text.includes(pattern) && text.length < 100) {
                const exists = courses.some((c) => c.judul === text);
                if (!exists && text.length > 3) {
                    const imgElement = $el.find("img").first();
                    const imgSrc = imgElement.attr("src") || imgElement.attr("data-src");
                    const kategori = categorize(text);

                    courses.push({
                        judul: text,
                        slug: slugify(text),
                        deskripsi: `Program pelatihan ${text} di Suvi Training dengan instruktur bersertifikasi BNSP.`,
                        kategori,
                        durasi: "2-3 bulan",
                        harga: PRICE_MAP[kategori] || PRICE_MAP["Lainnya"],
                        gambar_url: fixImageUrl(imgSrc),
                    });
                }
                break;
            }
        }
    });

    return courses;
}

// ============================================
// Fallback: Manual Course Data
// ============================================
function getManualCourseData(): ScrapedCourse[] {
    return [
        {
            judul: "MS Office - Word, Excel, Power Point, MS. Access",
            slug: "ms-office-word-excel-power-point-access",
            deskripsi:
                "Program pelatihan Microsoft Office lengkap meliputi Word, Excel, PowerPoint, dan Access untuk kebutuhan administrasi perkantoran modern.",
            kategori: "Perkantoran",
            durasi: "2 bulan",
            harga: 1500000,
            gambar_url: null,
        },
        {
            judul: "Desain Grafis dengan Corel Draw",
            slug: "desain-grafis-corel-draw",
            deskripsi:
                "Pelajari teknik desain grafis profesional menggunakan CorelDRAW untuk membuat logo, brosur, dan materi promosi.",
            kategori: "Desain",
            durasi: "2 bulan",
            harga: 2000000,
            gambar_url: null,
        },
        {
            judul: "Desain Grafis dengan Photoshop",
            slug: "desain-grafis-photoshop",
            deskripsi:
                "Kuasai Adobe Photoshop untuk editing foto, manipulasi gambar, dan desain digital profesional.",
            kategori: "Desain",
            durasi: "2 bulan",
            harga: 2000000,
            gambar_url: null,
        },
        {
            judul: "Teknisi Komputer",
            slug: "teknisi-komputer",
            deskripsi:
                "Pelatihan teknis perbaikan dan perawatan komputer, troubleshooting hardware dan software.",
            kategori: "Teknis",
            durasi: "3 bulan",
            harga: 2500000,
            gambar_url: null,
        },
        {
            judul: "Animasi",
            slug: "animasi",
            deskripsi:
                "Belajar membuat animasi 2D dan 3D untuk kebutuhan multimedia, game, dan konten digital kreatif.",
            kategori: "Desain",
            durasi: "3 bulan",
            harga: 2000000,
            gambar_url: null,
        },
        {
            judul: "Akuntansi",
            slug: "akuntansi",
            deskripsi:
                "Pelatihan dasar dan menengah akuntansi, pembukuan, dan penggunaan software akuntansi.",
            kategori: "Bisnis",
            durasi: "3 bulan",
            harga: 1800000,
            gambar_url: null,
        },
        {
            judul: "Bisnis Manajemen",
            slug: "bisnis-manajemen",
            deskripsi:
                "Pelajari dasar-dasar manajemen bisnis, perencanaan usaha, dan strategi pengembangan bisnis.",
            kategori: "Bisnis",
            durasi: "2 bulan",
            harga: 1800000,
            gambar_url: null,
        },
        {
            judul: "Perpajakan",
            slug: "perpajakan",
            deskripsi:
                "Pelatihan perpajakan untuk memahami sistem pajak Indonesia, pengisian SPT, dan administrasi pajak.",
            kategori: "Bisnis",
            durasi: "2 bulan",
            harga: 1800000,
            gambar_url: null,
        },
        {
            judul: "Digital Marketing",
            slug: "digital-marketing",
            deskripsi:
                "Kuasai strategi pemasaran digital, SEO, SEM, social media marketing, dan content marketing.",
            kategori: "Digital",
            durasi: "3 bulan",
            harga: 2200000,
            gambar_url: null,
        },
        {
            judul: "Website Development",
            slug: "website-development",
            deskripsi:
                "Belajar membuat website dari nol menggunakan HTML, CSS, dan CMS populer seperti WordPress.",
            kategori: "Digital",
            durasi: "3 bulan",
            harga: 2200000,
            gambar_url: null,
        },
        {
            judul: "Sosial Media Management",
            slug: "sosial-media-management",
            deskripsi:
                "Pelatihan pengelolaan akun sosial media profesional untuk personal branding dan bisnis.",
            kategori: "Digital",
            durasi: "2 bulan",
            harga: 2200000,
            gambar_url: null,
        },
    ];
}

// ============================================
// Sample Data Functions
// ============================================
function getSampleTestimoni() {
    return [
        {
            nama_siswa: "Rina Kusuma",
            pekerjaan: "Admin di PT. Maju Bersama",
            isi_review:
                "Berkat pelatihan MS Office di Suvi Training, saya berhasil mendapatkan pekerjaan impian sebagai admin. Materinya sangat praktis!",
            rating: 5,
        },
        {
            nama_siswa: "Budi Santoso",
            pekerjaan: "Freelance Designer",
            isi_review:
                "Kursus Desain Grafis di sini sangat membantu. Instrukturnya sabar dan berpengalaman. Sekarang saya sudah punya banyak klien!",
            rating: 5,
        },
        {
            nama_siswa: "Dewi Lestari",
            pekerjaan: "Digital Marketer",
            isi_review:
                "Materi Digital Marketing sangat update dan relevan dengan kebutuhan industri saat ini. Recommended banget!",
            rating: 4,
        },
    ];
}

function getSampleSertifikat() {
    return [
        {
            nama: "Ahmad Rahman",
            nomor_sertifikat: "SUVI-2024-001-OFC",
            kompetensi: "Microsoft Office Specialist",
            tanggal_lulus: new Date("2024-06-15"),
        },
        {
            nama: "Siti Aminah",
            nomor_sertifikat: "SUVI-2024-002-DSN",
            kompetensi: "Graphic Design Professional",
            tanggal_lulus: new Date("2024-07-20"),
        },
        {
            nama: "Eko Prasetyo",
            nomor_sertifikat: "SUVI-2024-003-DGM",
            kompetensi: "Digital Marketing Specialist",
            tanggal_lulus: new Date("2024-08-10"),
        },
    ];
}

// ============================================
// Main Seeding Function
// ============================================
async function main() {
    console.log("🚀 Suvi Training Database Seeder v2.0");
    console.log("=====================================\n");

    if (DRY_RUN) {
        console.log("📋 DRY RUN MODE - No changes will be made\n");
    } else {
        // Ensure upload directory exists
        ensureDirectoryExists(UPLOADS_DIR);
        createPlaceholderImage();
    }

    // Get course data
    let courses: ScrapedCourse[] = [];

    try {
        console.log("🌐 Attempting to scrape suviacademy.com...");
        courses = await scrapeHomepage();

        if (courses.length < 5) {
            console.log("⚠️  Insufficient data scraped, using manual data\n");
            courses = getManualCourseData();
        }
    } catch (error) {
        console.log("⚠️  Scraping failed, using manual data");
        console.log(
            `   Error: ${error instanceof Error ? error.message : "Unknown error"}\n`
        );
        courses = getManualCourseData();
    }

    // Process images
    if (!DRY_RUN) {
        console.log("\n📷 Processing images...\n");
        const processedCourses: ScrapedCourse[] = [];
        for (const course of courses) {
            const processed = await processImageForCourse(course);
            processedCourses.push(processed);
        }
        courses = processedCourses;
    }

    // Display courses
    console.log(`\n📚 Courses to seed (${courses.length}):\n`);
    courses.forEach((c, i) => {
        console.log(`   ${i + 1}. ${c.judul}`);
        console.log(`      Kategori: ${c.kategori} | Durasi: ${c.durasi}`);
        console.log(
            `      Harga: Rp ${c.harga?.toLocaleString("id-ID") || "-"}`
        );
        console.log(`      Image: ${c.gambar_url || "placeholder"}\n`);
    });

    if (DRY_RUN) {
        console.log("✅ Dry run complete. Run without --dry-run to seed database.");
        return;
    }

    // Seed courses
    console.log("\n💾 Seeding courses...\n");
    for (const course of courses) {
        await prisma.kursus.upsert({
            where: { slug: course.slug },
            update: {
                judul: course.judul,
                deskripsi: course.deskripsi,
                kategori: course.kategori,
                durasi: course.durasi,
                harga: course.harga,
                gambar_url: course.gambar_url,
            },
            create: {
                judul: course.judul,
                slug: course.slug,
                deskripsi: course.deskripsi,
                kategori: course.kategori,
                durasi: course.durasi,
                harga: course.harga,
                gambar_url: course.gambar_url,
                is_active: true,
            },
        });
        console.log(`   ✅ ${course.judul}`);
    }

    // Seed testimoni (skip if already exists)
    console.log("\n💬 Seeding testimoni...\n");
    const existingTestimoni = await prisma.testimoni.count();
    if (existingTestimoni === 0) {
        const testimoniData = getSampleTestimoni();
        for (const testimoni of testimoniData) {
            await prisma.testimoni.create({ data: testimoni });
            console.log(`   ✅ ${testimoni.nama_siswa}`);
        }
    } else {
        console.log(`   ⏭️  Skipped (${existingTestimoni} already exist)`);
    }

    // Seed sertifikat
    console.log("\n📜 Seeding sertifikat...\n");
    const sertifikatData = getSampleSertifikat();
    for (const sertifikat of sertifikatData) {
        await prisma.sertifikat.upsert({
            where: { nomor_sertifikat: sertifikat.nomor_sertifikat },
            update: sertifikat,
            create: sertifikat,
        });
        console.log(`   ✅ ${sertifikat.nomor_sertifikat}`);
    }

    console.log("\n🎉 Database seeding completed!\n");
}

main()
    .catch((e) => {
        console.error("❌ Error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
