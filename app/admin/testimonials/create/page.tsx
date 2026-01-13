"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
    ArrowLeft,
    Save,
    Loader2,
    Star,
    CheckCircle,
    AlertCircle,
    User,
    X,
} from "lucide-react";
import { createTestimonial } from "../actions";
import { UploadButton } from "@/lib/uploadthing";

export default function CreateTestimonialPage() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Form state
    const [namaSiswa, setNamaSiswa] = useState("");
    const [pekerjaan, setPekerjaan] = useState("");
    const [isiReview, setIsiReview] = useState("");
    const [rating, setRating] = useState(5);
    const [fotoUrl, setFotoUrl] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const result = await createTestimonial({
                nama_siswa: namaSiswa,
                pekerjaan: pekerjaan || undefined,
                isi_review: isiReview,
                rating,
                foto_url: fotoUrl || undefined,
            });

            if (result.success) {
                setMessage({ type: "success", text: "Testimoni berhasil ditambahkan!" });
                setTimeout(() => {
                    router.push("/admin/testimonials");
                }, 1500);
            } else {
                setMessage({
                    type: "error",
                    text: result.error || "Gagal menambahkan testimoni",
                });
            }
        });
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/testimonials"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar</span>
            </Link>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Tambah Testimoni</h1>
                <p className="text-gray-600 mt-1">
                    Tambahkan testimoni baru dari alumni
                </p>
            </div>

            {/* Message */}
            {message && (
                <div
                    className={`p-4 rounded-xl flex items-center gap-3 ${message.type === "success"
                            ? "bg-green-50 border border-green-200"
                            : "bg-red-50 border border-red-200"
                        }`}
                >
                    {message.type === "success" ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-red-600" />
                    )}
                    <p
                        className={
                            message.type === "success" ? "text-green-700" : "text-red-700"
                        }
                    >
                        {message.text}
                    </p>
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                    {/* Photo Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Foto Alumni (Opsional)
                        </label>
                        <div className="flex items-start gap-4">
                            {/* Preview */}
                            <div className="relative">
                                {fotoUrl ? (
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src={fotoUrl}
                                            alt="Preview foto"
                                            fill
                                            className="object-cover"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setFotoUrl("")}
                                            className="absolute -top-1 -right-1 p-1 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center border-2 border-dashed border-gray-300">
                                        <User className="w-10 h-10 text-gray-400" />
                                    </div>
                                )}
                            </div>
                            <div className="flex-1">
                                <UploadButton
                                    endpoint="testimonialPhotoUploader"
                                    onUploadBegin={() => setIsUploading(true)}
                                    onClientUploadComplete={(res) => {
                                        setIsUploading(false);
                                        if (res && res[0]) {
                                            setFotoUrl(res[0].ufsUrl);
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        setIsUploading(false);
                                        setMessage({
                                            type: "error",
                                            text: `Upload gagal: ${error.message}`,
                                        });
                                    }}
                                    appearance={{
                                        button: `px-4 py-2 rounded-lg text-sm font-medium transition-all ${isUploading
                                                ? "bg-gray-400 cursor-not-allowed"
                                                : "bg-purple-100 hover:bg-purple-200 text-purple-700"
                                            }`,
                                        allowedContent: "text-xs text-gray-500 mt-1",
                                    }}
                                    content={{
                                        button({ ready, isUploading }) {
                                            if (isUploading) return "Mengupload...";
                                            if (ready)
                                                return fotoUrl ? "Ganti Foto" : "Upload Foto";
                                            return "Memuat...";
                                        },
                                        allowedContent: "PNG, JPG (Max 2MB)",
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nama Alumni <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={namaSiswa}
                            onChange={(e) => setNamaSiswa(e.target.value)}
                            required
                            placeholder="Contoh: Budi Santoso"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        />
                    </div>

                    {/* Job */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pekerjaan (Opsional)
                        </label>
                        <input
                            type="text"
                            value={pekerjaan}
                            onChange={(e) => setPekerjaan(e.target.value)}
                            placeholder="Contoh: Web Developer di PT ABC"
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                        />
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating <span className="text-red-500">*</span>
                        </label>
                        <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => setRating(value)}
                                    className="p-1 focus:outline-none"
                                >
                                    <Star
                                        className={`w-8 h-8 transition-colors ${value <= rating
                                                ? "text-amber-400 fill-amber-400"
                                                : "text-gray-300 hover:text-amber-200"
                                            }`}
                                    />
                                </button>
                            ))}
                            <span className="ml-2 text-sm text-gray-600">
                                {rating} dari 5
                            </span>
                        </div>
                    </div>

                    {/* Review */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Isi Review <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            value={isiReview}
                            onChange={(e) => setIsiReview(e.target.value)}
                            required
                            rows={4}
                            placeholder="Tulis review dari alumni..."
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                            Minimal 10 karakter
                        </p>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end gap-4">
                    <Link
                        href="/admin/testimonials"
                        className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                    >
                        Batal
                    </Link>
                    <button
                        type="submit"
                        disabled={isPending}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-bold transition-colors"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Menyimpan...</span>
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                <span>Simpan Testimoni</span>
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}
