import { db } from "@/lib/db";
import { Users, Phone, Calendar, Tag } from "lucide-react";

export default async function AdminLeadsPage() {
    let leads: Array<{
        id: number;
        nama: string;
        no_wa: string;
        source: string | null;
        status: string;
        created_at: Date;
        pilihan_kursus: { judul: string } | null;
    }> = [];

    try {
        leads = await db.lead.findMany({
            orderBy: { created_at: "desc" },
            include: { pilihan_kursus: { select: { judul: true } } },
        });
    } catch (error) {
        console.error("Fetch leads error:", error);
    }

    const statusColors: Record<string, string> = {
        NEW: "bg-blue-100 text-blue-700",
        FOLLOWED_UP: "bg-yellow-100 text-yellow-700",
        CONVERTED: "bg-green-100 text-green-700",
        CLOSED: "bg-gray-100 text-gray-600",
    };

    const statusLabels: Record<string, string> = {
        NEW: "Baru",
        FOLLOWED_UP: "Di-follow up",
        CONVERTED: "Konversi",
        CLOSED: "Ditutup",
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Monitoring Leads</h1>
                <p className="text-gray-500 mt-1">
                    Daftar calon peserta yang tertarik dengan program pelatihan
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
                    <p className="text-sm text-gray-500">Total Leads</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-blue-600">
                        {leads.filter((l) => l.status === "NEW").length}
                    </p>
                    <p className="text-sm text-gray-500">Baru</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-yellow-600">
                        {leads.filter((l) => l.status === "FOLLOWED_UP").length}
                    </p>
                    <p className="text-sm text-gray-500">Di-follow up</p>
                </div>
                <div className="bg-white rounded-xl p-4 border border-gray-100">
                    <p className="text-2xl font-bold text-green-600">
                        {leads.filter((l) => l.status === "CONVERTED").length}
                    </p>
                    <p className="text-sm text-gray-500">Konversi</p>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Nama
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                WhatsApp
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Kursus
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Sumber
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Status
                            </th>
                            <th className="text-left px-6 py-4 text-sm font-semibold text-gray-900">
                                Tanggal
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.length > 0 ? (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-purple-100 flex items-center justify-center">
                                                <span className="font-bold text-purple-600 text-sm">
                                                    {lead.nama.charAt(0)}
                                                </span>
                                            </div>
                                            <p className="font-medium text-gray-900">{lead.nama}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <a
                                            href={`https://wa.me/${lead.no_wa.replace(/\D/g, "")}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-700"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {lead.no_wa}
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 text-gray-700">
                                        {lead.pilihan_kursus?.judul || (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {lead.source ? (
                                            <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                                                <Tag className="w-3 h-3" />
                                                {lead.source}
                                            </span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[lead.status]}`}
                                        >
                                            {statusLabels[lead.status]}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(lead.created_at).toLocaleDateString("id-ID", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                            })}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="px-6 py-12 text-center">
                                    <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                    <p className="text-gray-500">
                                        Belum ada lead. Lead akan tercatat saat pengguna mengklik
                                        tombol WhatsApp.
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
