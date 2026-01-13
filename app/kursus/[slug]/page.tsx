import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import {
    ArrowLeft,
    Clock,
    Award,
    Users,
    CheckCircle,
    Star,
    BookOpen,
} from "lucide-react";
import { db } from "@/lib/db";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { SyllabusAccordion } from "@/components/SyllabusAccordion";
import { StickyMobileCTA } from "@/components/StickyMobileCTA";

// ============================================
// Types
// ============================================
interface CourseDetailPageProps {
    params: Promise<{ slug: string }>;
}

// ============================================
// Data Fetching
// ============================================
async function getCourse(slug: string) {
    try {
        const course = await db.kursus.findUnique({
            where: { slug, is_active: true },
        });
        return course;
    } catch (error) {
        console.error("Error fetching course:", error);
        return null;
    }
}

// ============================================
// Metadata Generation
// ============================================
export async function generateMetadata({
    params,
}: CourseDetailPageProps): Promise<Metadata> {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        return {
            title: "Kursus Tidak Ditemukan",
        };
    }

    return {
        title: course.judul,
        description:
            course.deskripsi ||
            `Ikuti program ${course.judul} di Suvi Training dengan instruktur bersertifikasi BNSP.`,
        openGraph: {
            title: `${course.judul} | Suvi Training`,
            description: course.deskripsi || undefined,
            images: course.gambar_url ? [course.gambar_url] : undefined,
        },
    };
}

// ============================================
// Benefits Data
// ============================================
const BENEFITS = [
    { icon: Award, text: "Sertifikat BNSP" },
    { icon: BookOpen, text: "Modul Lengkap" },
    { icon: Users, text: "Kelas Kecil (Max 15)" },
    { icon: Star, text: "Instruktur Berpengalaman" },
];

// ============================================
// Page Component
// ============================================
export default async function CourseDetailPage({
    params,
}: CourseDetailPageProps) {
    const { slug } = await params;
    const course = await getCourse(slug);

    if (!course) {
        notFound();
    }

    const price = course.harga ? Number(course.harga) : null;
    const formatPrice = (p: number | null) => {
        if (!p) return "Hubungi Admin";
        return `Rp ${p.toLocaleString("id-ID")}`;
    };

    // JSON-LD Structured Data
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Course",
        name: course.judul,
        description: course.deskripsi,
        provider: {
            "@type": "Organization",
            name: "Suvi Training",
            url: "https://suviacademy.com",
        },
        ...(price && {
            offers: {
                "@type": "Offer",
                price: price,
                priceCurrency: "IDR",
                availability: "https://schema.org/InStock",
            },
        }),
        hasCourseInstance: {
            "@type": "CourseInstance",
            courseMode: "onsite",
            duration: course.durasi,
        },
    };

    return (
        <>
            {/* JSON-LD */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-gray-50">
                {/* Header */}
                <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                    <div className="container mx-auto px-4 py-4">
                        <Link
                            href="/#program"
                            className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            <span className="font-medium">Kembali ke Program</span>
                        </Link>
                    </div>
                </header>

                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* ============================================ */}
                        {/* Left Column - Main Content (70%) */}
                        {/* ============================================ */}
                        <div className="lg:w-[70%] space-y-8">
                            {/* Hero Image */}
                            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-xl">
                                <Image
                                    src={course.gambar_url || "/uploads/courses/placeholder.jpg"}
                                    alt={course.judul}
                                    fill
                                    className="object-cover"
                                    priority
                                    sizes="(max-width: 1024px) 100vw, 70vw"
                                />
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm text-sm font-semibold text-gray-800 shadow-lg">
                                        {course.kategori}
                                    </span>
                                </div>
                            </div>

                            {/* Title & Meta */}
                            <div>
                                <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 leading-tight">
                                    {course.judul}
                                </h1>
                                <div className="mt-4 flex flex-wrap items-center gap-4 text-gray-600">
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5" />
                                        <span>{course.durasi}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Award className="w-5 h-5 text-amber-500" />
                                        <span>Bersertifikasi BNSP</span>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Tentang Program
                                </h2>
                                <p className="text-gray-600 leading-relaxed">
                                    {course.deskripsi ||
                                        `Program pelatihan ${course.judul} dirancang untuk membekali peserta dengan keterampilan praktis yang dibutuhkan di dunia kerja. Dengan instruktur bersertifikasi BNSP dan metode pembelajaran yang fokus pada praktik, peserta akan siap menghadapi tantangan karir modern.`}
                                </p>
                            </div>

                            {/* Syllabus */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <SyllabusAccordion
                                    kategori={course.kategori}
                                    syllabus={Array.isArray(course.syllabus) ? (course.syllabus as string[]) : null}
                                />
                            </div>

                            {/* Mobile CTA - Visible only on mobile before sticky bar appears */}
                            <div className="lg:hidden">
                                <WhatsAppButton courseName={course.judul} courseId={course.id} />
                            </div>
                        </div>

                        {/* ============================================ */}
                        {/* Right Column - Sticky Sidebar (30%) */}
                        {/* ============================================ */}
                        <div className="lg:w-[30%]">
                            <div className="lg:sticky lg:top-24 space-y-6">
                                {/* Price Card */}
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                                    <div className="text-center mb-6">
                                        <p className="text-sm text-gray-500 mb-1">
                                            Investasi Pembelajaran
                                        </p>
                                        <p className="text-3xl font-extrabold text-gray-900">
                                            {formatPrice(price)}
                                        </p>
                                        {price && (
                                            <p className="text-sm text-gray-500 mt-1">/program</p>
                                        )}
                                    </div>

                                    {/* Benefits */}
                                    <div className="space-y-3 mb-6">
                                        <p className="font-semibold text-gray-800">
                                            Yang Anda Dapatkan:
                                        </p>
                                        {BENEFITS.map((benefit, index) => (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 text-gray-600"
                                            >
                                                <div className="p-1.5 rounded-lg bg-green-100">
                                                    <benefit.icon className="w-4 h-4 text-green-600" />
                                                </div>
                                                <span className="text-sm">{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* CTA Button */}
                                    <WhatsAppButton courseName={course.judul} courseId={course.id} />

                                    {/* Additional Info */}
                                    <div className="mt-4 pt-4 border-t border-gray-100">
                                        <div className="flex items-start gap-2 text-sm text-gray-500">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                            <span>
                                                Konsultasi gratis sebelum mendaftar
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Trust Card */}
                                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="p-2 rounded-xl bg-white shadow-sm">
                                            <Star className="w-5 h-5 text-amber-500" />
                                        </div>
                                        <div>
                                            <p className="font-semibold text-gray-900">
                                                1000+ Alumni
                                            </p>
                                            <p className="text-sm text-gray-600">Sudah Terlatih</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        Bergabunglah dengan ribuan alumni Suvi Training yang telah
                                        berhasil meningkatkan karir mereka.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sticky Mobile CTA */}
                <StickyMobileCTA courseName={course.judul} price={price} />
            </main>
        </>
    );
}
