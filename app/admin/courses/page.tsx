import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil, Eye, EyeOff } from "lucide-react";

export default async function AdminCoursesPage() {
    let courses: Array<{
        id: number;
        judul: string;
        kategori: string;
        harga: ReturnType<typeof Number> | null;
        is_active: boolean;
        slug: string;
    }> = [];

    try {
        const data = await db.kursus.findMany({
            orderBy: { created_at: "desc" },
        });
        courses = data.map((c) => ({
            ...c,
            harga: c.harga ? Number(c.harga) : null,
        }));
    } catch (error) {
        console.error("Fetch courses error:", error);
    }

    const formatPrice = (price: number | null) => {
        if (!price) return "-";
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Manajemen Kursus</h1>
                    <p className="text-gray-500 mt-1">Kelola daftar program pelatihan</p>
                </div>
                <Link
                    href="/admin/courses/new"
                    className="
            flex items-center gap-2 px-4 py-2.5 rounded-xl
            bg-purple-600 hover:bg-purple-700
            text-white font-medium
            transition-colors
          "
                >
                    <Plus className="w-5 h-5" />
                    <span>Tambah Kursus</span>
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Nama Kursus
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Kategori
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Harga
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th className="text-right px-6 py-4 text-sm font-semibold text-gray-900">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {courses.length > 0 ? (
                            courses.map((course) => (
                                <tr key={course.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <p className="font-medium text-gray-900">{course.judul}</p>
                                        <p className="text-sm text-gray-500">{course.slug}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
                                            {course.kategori}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {formatPrice(course.harga)}
                                    </td>
                                    <td className="px-6 py-4">
                                        {course.is_active ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                <Eye className="w-3 h-3" />
                                                Aktif
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                <EyeOff className="w-3 h-3" />
                                                Nonaktif
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Link
                                            href={`/admin/courses/${course.id}/edit`}
                                            className="
                        inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                        text-sm font-medium text-purple-600
                        hover:bg-purple-50 transition-colors
                      "
                                        >
                                            <Pencil className="w-4 h-4" />
                                            Edit
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                    Belum ada kursus. Jalankan seeding terlebih dahulu.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
