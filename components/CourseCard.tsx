import Image from "next/image";
import Link from "next/link";
import { Clock, Tag } from "lucide-react";
import { WhatsAppButton } from "./WhatsAppButton";

interface CourseCardProps {
    id: number;
    judul: string;
    slug: string;
    deskripsi: string | null;
    kategori: string;
    durasi: string;
    harga: number | null;
    gambar_url: string | null;
}

// Category color mapping
const CATEGORY_COLORS: Record<string, string> = {
    Perkantoran: "bg-blue-100 text-blue-700 border-blue-200",
    Desain: "bg-purple-100 text-purple-700 border-purple-200",
    Teknis: "bg-orange-100 text-orange-700 border-orange-200",
    Bisnis: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Digital: "bg-pink-100 text-pink-700 border-pink-200",
    Lainnya: "bg-gray-100 text-gray-700 border-gray-200",
};

export function CourseCard({
    judul,
    slug,
    deskripsi,
    kategori,
    durasi,
    harga,
    gambar_url,
}: CourseCardProps) {
    const categoryColor =
        CATEGORY_COLORS[kategori] || CATEGORY_COLORS["Lainnya"];

    const formatPrice = (price: number | null) => {
        if (!price) return "Hubungi Admin";
        return `Rp ${price.toLocaleString("id-ID")}`;
    };

    return (
        <div
            className="
        group relative flex flex-col
        bg-white rounded-3xl
        border border-gray-100
        shadow-lg shadow-gray-200/50
        hover:shadow-2xl hover:shadow-purple-500/10
        transition-all duration-500 ease-out
        hover:scale-[1.02] hover:-translate-y-1
        overflow-hidden
      "
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={gambar_url || "/uploads/courses/placeholder.jpg"}
                    alt={judul}
                    fill
                    className="
            object-cover
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div
                    className="
            absolute inset-0
            bg-gradient-to-t from-black/60 via-transparent to-transparent
            opacity-0 group-hover:opacity-100
            transition-opacity duration-500
          "
                />
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                    <span
                        className={`
              inline-flex items-center gap-1.5
              px-3 py-1.5 rounded-full
              text-xs font-semibold
              border backdrop-blur-sm
              ${categoryColor}
            `}
                    >
                        <Tag className="w-3 h-3" />
                        {kategori}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-5">
                {/* Title */}
                <h3
                    className="
            font-bold text-lg text-gray-900
            line-clamp-2 leading-tight
            group-hover:text-purple-700
            transition-colors duration-300
          "
                >
                    {judul}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 flex-1">
                    {deskripsi || "Program pelatihan berkualitas dengan instruktur bersertifikasi."}
                </p>

                {/* Meta Info */}
                <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        <span>{durasi}</span>
                    </div>
                </div>

                {/* Price */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            {formatPrice(harga)}
                        </span>
                        {harga && (
                            <span className="text-sm text-gray-500">/program</span>
                        )}
                    </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-3">
                    <Link
                        href={`/kursus/${slug}`}
                        className="
              flex-1 py-2.5 px-4 rounded-xl
              bg-gray-100 hover:bg-gray-200
              text-gray-700 font-semibold text-sm text-center
              transition-colors duration-200
            "
                    >
                        Detail
                    </Link>
                    <WhatsAppButton
                        courseName={judul}
                        variant="compact"
                        className="flex-1"
                    />
                </div>
            </div>
        </div>
    );
}
