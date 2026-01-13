import Link from "next/link";
import { Plus, Star, Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { db } from "@/lib/db";
import { deleteTestimonial, toggleTestimonialStatus } from "./actions";

async function getTestimonials() {
    return db.testimoni.findMany({
        orderBy: { created_at: "desc" },
    });
}

export default async function AdminTestimonialsPage() {
    const testimonials = await getTestimonials();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Manajemen Testimoni
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Kelola testimoni alumni yang tampil di homepage
                    </p>
                </div>
                <Link
                    href="/admin/testimonials/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-medium transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Tambah Testimoni
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {testimonials.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Alumni
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Rating
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Review
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {testimonials.map((testimonial) => (
                                    <tr
                                        key={testimonial.id}
                                        className="hover:bg-gray-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="font-medium text-gray-900">
                                                    {testimonial.nama_siswa}
                                                </p>
                                                {testimonial.pekerjaan && (
                                                    <p className="text-sm text-gray-500">
                                                        {testimonial.pekerjaan}
                                                    </p>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < testimonial.rating
                                                                ? "text-amber-400 fill-amber-400"
                                                                : "text-gray-300"
                                                            }`}
                                                    />
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-gray-600 text-sm line-clamp-2 max-w-xs">
                                                {testimonial.isi_review}
                                            </p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await toggleTestimonialStatus(
                                                        testimonial.id
                                                    );
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${testimonial.is_active
                                                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                                        }`}
                                                >
                                                    {testimonial.is_active ? (
                                                        <>
                                                            <ToggleRight className="w-4 h-4" />
                                                            Aktif
                                                        </>
                                                    ) : (
                                                        <>
                                                            <ToggleLeft className="w-4 h-4" />
                                                            Nonaktif
                                                        </>
                                                    )}
                                                </button>
                                            </form>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <form
                                                action={async () => {
                                                    "use server";
                                                    await deleteTestimonial(
                                                        testimonial.id
                                                    );
                                                }}
                                            >
                                                <button
                                                    type="submit"
                                                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                                                    title="Hapus testimoni"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </form>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <p className="text-gray-500 mb-4">
                            Belum ada testimoni. Tambahkan testimoni pertama!
                        </p>
                        <Link
                            href="/admin/testimonials/create"
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-colors"
                        >
                            <Plus className="w-4 h-4" />
                            Tambah Testimoni
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
