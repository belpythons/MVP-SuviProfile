import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

// ============================================
// Default Syllabus Data by Category
// ============================================
const SYLLABUS_MAP: Record<string, string[]> = {
    Perkantoran: [
        "Pengenalan Microsoft Office",
        "Microsoft Word Mahir",
        "Microsoft Excel Produktif",
        "Microsoft PowerPoint Impactful",
        "Project Akhir",
    ],
    Desain: [
        "Pengenalan Desain Grafis",
        "Penguasaan Tools",
        "Teknik Desain Lanjut",
        "Proyek Portofolio",
    ],
    Teknis: [
        "Dasar Hardware Komputer",
        "Troubleshooting Hardware",
        "Instalasi Software & OS",
        "Jaringan Dasar",
        "Praktik Lapangan",
    ],
    Bisnis: [
        "Dasar-dasar Bisnis",
        "Manajemen Keuangan",
        "Strategi Pemasaran",
        "Operasional Bisnis",
        "Business Plan Final",
    ],
    Digital: [
        "Pengenalan Digital Marketing",
        "Social Media Marketing",
        "Search Engine Optimization",
        "Paid Advertising",
        "Proyek Kampanye Digital",
    ],
};

// ============================================
// Course Data
// ============================================
const coursesData = [
    {
        judul: "MS Office - Word, Excel, Power Point, MS. Access",
        slug: "ms-office-word-excel-power-point-access",
        deskripsi:
            "Program pelatihan Microsoft Office lengkap meliputi Word, Excel, PowerPoint, dan Access untuk kebutuhan administrasi perkantoran modern.",
        kategori: "Perkantoran",
        durasi: "2 bulan",
        harga: 1500000,
    },
    {
        judul: "Desain Grafis dengan Corel Draw",
        slug: "desain-grafis-corel-draw",
        deskripsi:
            "Pelajari teknik desain grafis profesional menggunakan CorelDRAW untuk membuat logo, brosur, dan materi promosi.",
        kategori: "Desain",
        durasi: "2 bulan",
        harga: 2000000,
    },
    {
        judul: "Desain Grafis dengan Photoshop",
        slug: "desain-grafis-photoshop",
        deskripsi:
            "Kuasai Adobe Photoshop untuk editing foto, manipulasi gambar, dan desain digital profesional.",
        kategori: "Desain",
        durasi: "2 bulan",
        harga: 2000000,
    },
    {
        judul: "Teknisi Komputer",
        slug: "teknisi-komputer",
        deskripsi:
            "Pelatihan teknis perbaikan dan perawatan komputer, troubleshooting hardware dan software.",
        kategori: "Teknis",
        durasi: "3 bulan",
        harga: 2500000,
    },
    {
        judul: "Digital Marketing",
        slug: "digital-marketing",
        deskripsi:
            "Kuasai strategi pemasaran digital, SEO, SEM, social media marketing, dan content marketing.",
        kategori: "Digital",
        durasi: "3 bulan",
        harga: 2200000,
    },
    {
        judul: "Akuntansi",
        slug: "akuntansi",
        deskripsi:
            "Pelatihan dasar dan menengah akuntansi, pembukuan, dan penggunaan software akuntansi.",
        kategori: "Bisnis",
        durasi: "3 bulan",
        harga: 1800000,
    },
];

// ============================================
// Testimoni Data
// ============================================
const testimoniData = [
    {
        nama_siswa: "Rina Kusuma",
        pekerjaan: "Admin di PT. Maju Bersama",
        isi_review:
            "Berkat pelatihan MS Office di Suvi Training, saya berhasil mendapatkan pekerjaan impian sebagai admin.",
        rating: 5,
    },
    {
        nama_siswa: "Budi Santoso",
        pekerjaan: "Freelance Designer",
        isi_review:
            "Kursus Desain Grafis sangat membantu. Instrukturnya sabar dan berpengalaman.",
        rating: 5,
    },
];

// ============================================
// Sertifikat Data
// ============================================
const sertifikatData = [
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

// ============================================
// Main Seed Function
// ============================================
async function main() {
    console.log("🚀 Starting database seed...\n");

    // 1. Create Admin User
    console.log("👤 Creating admin user...");
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await prisma.admin.upsert({
        where: { email: "admin@suvi.com" },
        update: { password: hashedPassword },
        create: {
            email: "admin@suvi.com",
            password: hashedPassword,
            name: "Administrator",
        },
    });
    console.log("   ✅ Admin: admin@suvi.com / admin123\n");

    // 2. Seed Courses with Syllabus
    console.log("📚 Seeding courses...");
    for (const course of coursesData) {
        const syllabus = SYLLABUS_MAP[course.kategori] || [];
        await prisma.kursus.upsert({
            where: { slug: course.slug },
            update: {
                ...course,
                syllabus: syllabus,
            },
            create: {
                ...course,
                syllabus: syllabus,
                is_active: true,
            },
        });
        console.log(`   ✅ ${course.judul}`);
    }

    // 3. Seed Testimoni
    console.log("\n💬 Seeding testimoni...");
    const existingTestimoni = await prisma.testimoni.count();
    if (existingTestimoni === 0) {
        for (const t of testimoniData) {
            await prisma.testimoni.create({ data: t });
            console.log(`   ✅ ${t.nama_siswa}`);
        }
    } else {
        console.log(`   ⏭️ Skipped (${existingTestimoni} already exist)`);
    }

    // 4. Seed Sertifikat
    console.log("\n📜 Seeding sertifikat...");
    for (const s of sertifikatData) {
        await prisma.sertifikat.upsert({
            where: { nomor_sertifikat: s.nomor_sertifikat },
            update: s,
            create: s,
        });
        console.log(`   ✅ ${s.nomor_sertifikat}`);
    }

    console.log("\n🎉 Database seed completed!\n");
}

main()
    .catch((e) => {
        console.error("❌ Seed error:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
