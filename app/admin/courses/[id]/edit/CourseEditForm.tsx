"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
    Save,
    Loader2,
    Plus,
    Trash2,
    GripVertical,
    ArrowLeft,
    CheckCircle,
    AlertCircle,
    ImageIcon,
    X,
} from "lucide-react";
import Link from "next/link";
import { updateCourse } from "@/app/admin/courses/actions";
import { UploadButton } from "@/lib/uploadthing";

interface CourseEditFormProps {
    course: {
        id: number;
        judul: string;
        deskripsi: string;
        harga: number | null;
        gambar_url: string;
        syllabus: string[];
        is_active: boolean;
    };
}

export function CourseEditForm({ course }: CourseEditFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState<{
        type: "success" | "error";
        text: string;
    } | null>(null);

    // Form state
    const [judul, setJudul] = useState(course.judul);
    const [deskripsi, setDeskripsi] = useState(course.deskripsi);
    const [harga, setHarga] = useState(course.harga?.toString() || "");
    const [gambar_url, setGambarUrl] = useState(course.gambar_url);
    const [syllabus, setSyllabus] = useState<string[]>(course.syllabus);
    const [is_active, setIsActive] = useState(course.is_active);
    const [isUploading, setIsUploading] = useState(false);

    const addSyllabusItem = () => {
        setSyllabus([...syllabus, ""]);
    };

    const removeSyllabusItem = (index: number) => {
        setSyllabus(syllabus.filter((_, i) => i !== index));
    };

    const updateSyllabusItem = (index: number, value: string) => {
        const updated = [...syllabus];
        updated[index] = value;
        setSyllabus(updated);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const result = await updateCourse(course.id, {
                judul,
                deskripsi,
                harga: harga ? parseFloat(harga) : null,
                gambar_url,
                syllabus: syllabus.filter((s) => s.trim() !== ""),
                is_active,
            });

            if (result.success) {
                setMessage({ type: "success", text: "Perubahan berhasil disimpan!" });
                router.refresh();
            } else {
                setMessage({
                    type: "error",
                    text: result.error || "Gagal menyimpan perubahan",
                });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Back Link */}
            <Link
                href="/admin/courses"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-purple-600 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Kembali ke Daftar</span>
            </Link>

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

            {/* Main Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Judul Kursus
                    </label>
                    <input
                        type="text"
                        value={judul}
                        onChange={(e) => setJudul(e.target.value)}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Deskripsi
                    </label>
                    <textarea
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all resize-none"
                    />
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Harga (Rp)
                    </label>
                    <input
                        type="number"
                        value={harga}
                        onChange={(e) => setHarga(e.target.value)}
                        placeholder="1500000"
                        className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    />
                </div>

                {/* Course Image Upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Gambar Kursus
                    </label>

                    {/* Image Preview */}
                    {gambar_url ? (
                        <div className="relative mb-4">
                            <div className="relative w-full aspect-video rounded-xl overflow-hidden border-2 border-gray-200">
                                <Image
                                    src={gambar_url}
                                    alt="Preview gambar kursus"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setGambarUrl("")}
                                className="absolute top-2 right-2 p-2 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <p className="mt-2 text-xs text-gray-500 truncate">{gambar_url}</p>
                        </div>
                    ) : (
                        <div className="mb-4 flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
                            <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-500">Belum ada gambar</p>
                        </div>
                    )}

                    {/* Upload Button */}
                    <UploadButton
                        endpoint="courseImageUploader"
                        onUploadBegin={() => setIsUploading(true)}
                        onClientUploadComplete={(res) => {
                            setIsUploading(false);
                            if (res && res[0]) {
                                setGambarUrl(res[0].ufsUrl);
                                setMessage({ type: "success", text: "Gambar berhasil diupload!" });
                            }
                        }}
                        onUploadError={(error: Error) => {
                            setIsUploading(false);
                            setMessage({ type: "error", text: `Upload gagal: ${error.message}` });
                        }}
                        appearance={{
                            button: `px-4 py-3 rounded-xl font-medium transition-all ${isUploading
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-purple-600 hover:bg-purple-700 text-white"
                                }`,
                            allowedContent: "text-xs text-gray-500 mt-2",
                        }}
                        content={{
                            button({ ready, isUploading }) {
                                if (isUploading) return "Mengupload...";
                                if (ready) return gambar_url ? "Ganti Gambar" : "Upload Gambar";
                                return "Memuat...";
                            },
                            allowedContent: "PNG, JPG, WEBP (Max 4MB)",
                        }}
                    />
                </div>

                {/* Active Toggle */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsActive(!is_active)}
                        className={`
              relative w-12 h-6 rounded-full transition-colors
              ${is_active ? "bg-green-500" : "bg-gray-300"}
            `}
                    >
                        <span
                            className={`
                absolute top-1 left-1 w-4 h-4 rounded-full bg-white
                transition-transform
                ${is_active ? "translate-x-6" : "translate-x-0"}
              `}
                        />
                    </button>
                    <span className="text-sm text-gray-700">
                        {is_active ? "Aktif (Tampil di website)" : "Nonaktif (Tersembunyi)"}
                    </span>
                </div>
            </div>

            {/* Syllabus Editor */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h3 className="text-lg font-bold text-gray-900">Materi Syllabus</h3>
                        <p className="text-sm text-gray-500">
                            Daftar modul/topik yang akan dipelajari
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={addSyllabusItem}
                        className="
              flex items-center gap-2 px-4 py-2 rounded-lg
              bg-purple-100 hover:bg-purple-200
              text-purple-700 font-medium text-sm
              transition-colors
            "
                    >
                        <Plus className="w-4 h-4" />
                        Tambah
                    </button>
                </div>

                {syllabus.length > 0 ? (
                    <div className="space-y-3">
                        {syllabus.map((item, index) => (
                            <div key={index} className="flex items-center gap-3">
                                <GripVertical className="w-5 h-5 text-gray-400 flex-shrink-0" />
                                <span className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 font-bold text-sm flex items-center justify-center flex-shrink-0">
                                    {index + 1}
                                </span>
                                <input
                                    type="text"
                                    value={item}
                                    onChange={(e) => updateSyllabusItem(index, e.target.value)}
                                    placeholder="Nama modul/topik..."
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 focus:border-purple-400 focus:ring-2 focus:ring-purple-100 outline-none transition-all"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeSyllabusItem(index)}
                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-200 rounded-xl">
                        <p>Belum ada syllabus. Klik "Tambah" untuk menambahkan modul.</p>
                    </div>
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end gap-4">
                <Link
                    href="/admin/courses"
                    className="px-6 py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                    Batal
                </Link>
                <button
                    type="submit"
                    disabled={isPending}
                    className="
            flex items-center gap-2 px-6 py-3 rounded-xl
            bg-purple-600 hover:bg-purple-700
            disabled:bg-gray-400
            text-white font-bold
            transition-colors
          "
                >
                    {isPending ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Menyimpan...</span>
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            <span>Simpan Perubahan</span>
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
