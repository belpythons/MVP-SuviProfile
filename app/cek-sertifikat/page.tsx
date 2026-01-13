"use client";

import { useState, useTransition } from "react";
import { Search, Loader2, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { verifyCertificate, CertificateResult } from "./actions";
import { CertificateCard } from "@/components/CertificateCard";

export default function CertificateCheckerPage() {
    const [query, setQuery] = useState("");
    const [result, setResult] = useState<CertificateResult | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        startTransition(async () => {
            const res = await verifyCertificate(query);
            setResult(res);
        });
    };

    const currentUrl =
        typeof window !== "undefined"
            ? `${window.location.origin}/cek-sertifikat?no=${encodeURIComponent(result?.data?.nomorSertifikat || "")}`
            : "";

    return (
        <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-200">
                <div className="container mx-auto px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="font-medium">Kembali ke Beranda</span>
                    </Link>
                </div>
            </header>

            <div className="container mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="max-w-2xl mx-auto text-center mb-12">
                    <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-amber-100 border border-amber-200">
                        <Search className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-medium text-amber-700">
                            Verifikasi Sertifikat
                        </span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
                        Cek Keaslian Sertifikat
                    </h1>
                    <p className="text-lg text-gray-600">
                        Masukkan nomor sertifikat untuk memverifikasi keaslian dan melihat
                        detail alumni Suvi Training.
                    </p>
                </div>

                {/* Search Form */}
                <div className="max-w-xl mx-auto mb-12">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Contoh: SUVI-2024-001-OFC"
                                className="
                  w-full px-6 py-4 pr-14
                  text-lg rounded-2xl
                  border-2 border-gray-200
                  focus:border-purple-400 focus:ring-4 focus:ring-purple-100
                  outline-none transition-all
                  placeholder:text-gray-400
                "
                                disabled={isPending}
                            />
                            <button
                                type="submit"
                                disabled={isPending || !query.trim()}
                                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-3 rounded-xl
                  bg-gradient-to-r from-purple-600 to-pink-600
                  hover:from-purple-700 hover:to-pink-700
                  disabled:from-gray-400 disabled:to-gray-400
                  text-white
                  transition-all duration-200
                  hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed disabled:hover:scale-100
                "
                            >
                                {isPending ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Search className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </form>

                    {/* Sample Numbers */}
                    <div className="mt-4 text-center">
                        <p className="text-sm text-gray-500 mb-2">Contoh nomor untuk testing:</p>
                        <div className="flex flex-wrap justify-center gap-2">
                            {["SUVI-2024-001-OFC", "SUVI-2024-002-DSN", "SUVI-2024-003-DGM"].map(
                                (no) => (
                                    <button
                                        key={no}
                                        onClick={() => setQuery(no)}
                                        className="px-3 py-1.5 text-xs font-mono bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                                    >
                                        {no}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>

                {/* Results */}
                <div className="max-w-3xl mx-auto">
                    {result && (
                        <>
                            {result.found && result.data ? (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <CertificateCard
                                        nama={result.data.nama}
                                        nomorSertifikat={result.data.nomorSertifikat}
                                        kompetensi={result.data.kompetensi}
                                        tanggalLulus={new Date(result.data.tanggalLulus)}
                                        verificationUrl={currentUrl}
                                    />
                                </div>
                            ) : (
                                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
                                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                                            <AlertCircle className="w-8 h-8 text-red-500" />
                                        </div>
                                        <h3 className="text-xl font-bold text-red-800 mb-2">
                                            Sertifikat Tidak Ditemukan
                                        </h3>
                                        <p className="text-red-600 max-w-md mx-auto">
                                            {result.error ||
                                                "Pastikan nomor sertifikat yang Anda masukkan sudah benar. Jika masih bermasalah, hubungi admin kami."}
                                        </p>
                                        <a
                                            href="https://wa.me/6281234567890?text=Halo%20Admin,%20saya%20ingin%20memverifikasi%20sertifikat%20saya"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="
                        inline-flex items-center gap-2
                        mt-6 px-6 py-3 rounded-xl
                        bg-red-600 hover:bg-red-700
                        text-white font-semibold
                        transition-colors
                      "
                                        >
                                            Hubungi Admin
                                        </a>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Empty State */}
                    {!result && !isPending && (
                        <div className="text-center py-12">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
                                <Search className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                Masukkan Nomor Sertifikat
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Ketik nomor sertifikat di kolom pencarian di atas untuk memulai
                                verifikasi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
