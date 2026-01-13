import { Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { HeroSection } from "@/components/HeroSection";
import { CourseCard } from "@/components/CourseCard";

// Type for course data
type Course = {
  id: number;
  judul: string;
  slug: string;
  deskripsi: string | null;
  kategori: string;
  durasi: string;
  harga: ReturnType<typeof Number> | null;
  gambar_url: string | null;
};

async function getCourses(): Promise<Course[]> {
  try {
    const courses = await db.kursus.findMany({
      where: { is_active: true },
      orderBy: { created_at: "desc" },
    });
    return courses.map((c) => ({
      ...c,
      harga: c.harga ? Number(c.harga) : null,
    }));
  } catch (error) {
    console.error("Database connection error:", error);
    return [];
  }
}

export default async function HomePage() {
  const courses = await getCourses();

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Programs Section */}
      <section id="program" className="py-20 scroll-mt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-2xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-pink-100/80 border border-pink-200/50">
              <Sparkles className="w-4 h-4 text-pink-600" />
              <span className="text-sm font-medium text-pink-700">
                Pilihan Terbaik
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900">
              Program Unggulan
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Berbagai pilihan program pelatihan untuk meningkatkan skill dan daya saing di dunia kerja
            </p>
          </div>

          {/* Course Grid */}
          {courses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {courses.map((course) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  judul={course.judul}
                  slug={course.slug}
                  deskripsi={course.deskripsi}
                  kategori={course.kategori}
                  durasi={course.durasi}
                  harga={course.harga ? Number(course.harga) : null}
                  gambar_url={course.gambar_url}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Belum ada program tersedia. Silakan jalankan seeding terlebih dahulu.
              </p>
              <code className="mt-4 inline-block px-4 py-2 bg-gray-100 rounded-lg text-sm font-mono">
                npm run db:seed
              </code>
            </div>
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dipercaya oleh Lembaga Terkemuka
            </h3>
            <p className="mt-2 text-gray-600">
              Suvi Training bermitra dengan berbagai instansi untuk memberikan pelatihan berkualitas
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-16">
            {/* BNSP Logo Placeholder */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="
                  w-24 h-24 rounded-2xl
                  bg-gradient-to-br from-amber-100 to-amber-50
                  border-2 border-amber-200
                  flex items-center justify-center
                  shadow-lg shadow-amber-100/50
                "
              >
                <span className="text-amber-600 font-bold text-xl">BNSP</span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Badan Nasional Sertifikasi Profesi
              </p>
            </div>

            {/* Prakerja Logo Placeholder */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="
                  w-24 h-24 rounded-2xl
                  bg-gradient-to-br from-blue-100 to-blue-50
                  border-2 border-blue-200
                  flex items-center justify-center
                  shadow-lg shadow-blue-100/50
                "
              >
                <span className="text-blue-600 font-bold text-lg">PRAKERJA</span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Kartu Prakerja Indonesia
              </p>
            </div>

            {/* Kemendikbud Logo Placeholder */}
            <div className="flex flex-col items-center gap-3">
              <div
                className="
                  w-24 h-24 rounded-2xl
                  bg-gradient-to-br from-red-100 to-red-50
                  border-2 border-red-200
                  flex items-center justify-center
                  shadow-lg shadow-red-100/50
                "
              >
                <span className="text-red-600 font-bold text-xs text-center leading-tight">
                  KEMENDIK<br />BUDRISTEK
                </span>
              </div>
              <p className="text-sm font-medium text-gray-600">
                Kementerian Pendidikan
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="
              relative overflow-hidden
              max-w-4xl mx-auto
              px-8 py-12 sm:px-12 sm:py-16
              rounded-3xl
              bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
              shadow-2xl shadow-purple-500/25
            "
          >
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Siap Tingkatkan Skill Anda?
              </h2>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                Konsultasikan kebutuhan pelatihan Anda dengan tim kami.
                Gratis dan tanpa komitmen!
              </p>
              <a
                href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20konsultasi%20tentang%20program%20pelatihan%20di%20Suvi%20Training"
                target="_blank"
                rel="noopener noreferrer"
                className="
                  inline-flex items-center gap-3
                  mt-8 px-8 py-4 rounded-2xl
                  bg-white hover:bg-gray-50
                  text-purple-700 font-bold text-lg
                  shadow-xl
                  transition-all duration-300
                  hover:scale-105 active:scale-100
                "
              >
                <span>Konsultasi Gratis</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-white mb-2">
              Suvi Training
            </h4>
            <p className="text-gray-400 mb-6">
              Lembaga Pelatihan Kerja (LPK) Terakreditasi
            </p>
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} Suvi Training. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
