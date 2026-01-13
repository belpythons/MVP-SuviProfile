import Link from "next/link";
import { ArrowRight, Award, BadgeCheck, Sparkles } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden">
            {/* Background Gradient Mesh */}
            <div className="absolute inset-0 -z-10">
                {/* Base gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50" />

                {/* Animated gradient orbs */}
                <div
                    className="
            absolute top-1/4 -left-32 w-96 h-96
            bg-gradient-to-br from-purple-400/30 to-pink-400/30
            rounded-full blur-3xl
            animate-pulse
          "
                />
                <div
                    className="
            absolute bottom-1/4 -right-32 w-80 h-80
            bg-gradient-to-br from-blue-400/25 to-cyan-400/25
            rounded-full blur-3xl
            animate-pulse delay-1000
          "
                />
                <div
                    className="
            absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
            w-[600px] h-[600px]
            bg-gradient-to-r from-violet-300/20 via-pink-300/20 to-orange-300/20
            rounded-full blur-3xl
            animate-pulse delay-500
          "
                />

                {/* Grid pattern overlay */}
                <div
                    className="
            absolute inset-0 opacity-[0.02]
            bg-[linear-gradient(to_right,#000_1px,transparent_1px),linear-gradient(to_bottom,#000_1px,transparent_1px)]
            bg-[size:4rem_4rem]
          "
                />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-purple-100/80 border border-purple-200/50 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium text-purple-700">
                            Lembaga Pelatihan Kerja Terakreditasi
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                        <span className="text-gray-900">Upgrade Skill,</span>
                        <br />
                        <span
                            className="
                bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
                bg-clip-text text-transparent
              "
                        >
                            Raih Karir Impian
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Tingkatkan kompetensi Anda dengan pelatihan berkualitas dari instruktur
                        bersertifikasi <strong className="text-gray-800">BNSP</strong>.
                        Tersedia program <strong className="text-gray-800">Prakerja</strong> untuk
                        membantu perjalanan karir Anda.
                    </p>

                    {/* CTA Buttons */}
                    <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="#program"
                            className="
                group inline-flex items-center gap-2
                px-8 py-4 rounded-2xl
                bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500
                hover:from-purple-700 hover:via-pink-700 hover:to-orange-600
                text-white font-bold text-lg
                shadow-xl shadow-purple-500/25
                hover:shadow-2xl hover:shadow-purple-500/30
                transition-all duration-300
                hover:scale-105 active:scale-100
              "
                        >
                            <span>Lihat Program</span>
                            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/cek-sertifikat"
                            className="
                inline-flex items-center gap-2
                px-8 py-4 rounded-2xl
                bg-white/80 hover:bg-white
                border-2 border-gray-200 hover:border-purple-300
                text-gray-700 hover:text-purple-700
                font-semibold text-lg
                backdrop-blur-sm
                shadow-lg shadow-gray-200/50
                transition-all duration-300
                hover:scale-105 active:scale-100
              "
                        >
                            <BadgeCheck className="w-5 h-5" />
                            <span>Cek Sertifikat</span>
                        </Link>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-16 flex flex-wrap items-center justify-center gap-8">
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 border border-gray-200/50 backdrop-blur-sm">
                            <Award className="w-8 h-8 text-amber-500" />
                            <div className="text-left">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tersertifikasi
                                </p>
                                <p className="font-bold text-gray-900">BNSP</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 border border-gray-200/50 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                                <span className="text-white font-bold text-xs">PK</span>
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Mitra Resmi
                                </p>
                                <p className="font-bold text-gray-900">Prakerja</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/60 border border-gray-200/50 backdrop-blur-sm">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-sm">
                                10+
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Program
                                </p>
                                <p className="font-bold text-gray-900">Tersedia</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
