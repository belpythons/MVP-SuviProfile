import { db } from "@/lib/db";
import { BookOpen, Users, TrendingUp, Clock } from "lucide-react";

export default async function AdminDashboardPage() {
    // Fetch stats
    let totalCourses = 0;
    let totalLeads = 0;
    let recentLeads: Array<{
        id: number;
        nama: string;
        no_wa: string;
        created_at: Date;
        pilihan_kursus: { judul: string } | null;
    }> = [];

    try {
        totalCourses = await db.kursus.count({ where: { is_active: true } });
        totalLeads = await db.lead.count();
        recentLeads = await db.lead.findMany({
            take: 5,
            orderBy: { created_at: "desc" },
            include: { pilihan_kursus: { select: { judul: true } } },
        });
    } catch (error) {
        console.error("Dashboard stats error:", error);
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-1">Selamat datang di Admin Panel</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Kursus"
                    value={totalCourses}
                    icon={BookOpen}
                    color="purple"
                />
                <StatCard
                    title="Total Leads"
                    value={totalLeads}
                    icon={Users}
                    color="green"
                />
                <StatCard
                    title="Konversi (Coming)"
                    value="-"
                    icon={TrendingUp}
                    color="pink"
                />
            </div>

            {/* Recent Leads */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Lead Terbaru</h2>
                    <a
                        href="/admin/leads"
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Lihat Semua →
                    </a>
                </div>

                {recentLeads.length > 0 ? (
                    <div className="space-y-4">
                        {recentLeads.map((lead) => (
                            <div
                                key={lead.id}
                                className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                                        <span className="font-bold text-purple-600">
                                            {lead.nama.charAt(0)}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">{lead.nama}</p>
                                        <p className="text-sm text-gray-500">
                                            {lead.pilihan_kursus?.judul || "Belum pilih kursus"}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm font-medium text-gray-700">
                                        {lead.no_wa}
                                    </p>
                                    <p className="text-xs text-gray-400 flex items-center gap-1 justify-end">
                                        <Clock className="w-3 h-3" />
                                        {new Date(lead.created_at).toLocaleDateString("id-ID")}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>Belum ada lead. Jalankan seeding untuk data sample.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    icon: Icon,
    color,
}: {
    title: string;
    value: number | string;
    icon: React.ElementType;
    color: "purple" | "green" | "pink";
}) {
    const colorClasses = {
        purple: "from-purple-500 to-purple-600",
        green: "from-green-500 to-emerald-600",
        pink: "from-pink-500 to-rose-600",
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-4">
                <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}
                >
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">{value}</p>
            <p className="text-gray-500 mt-1">{title}</p>
        </div>
    );
}
