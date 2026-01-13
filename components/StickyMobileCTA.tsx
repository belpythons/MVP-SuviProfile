"use client";

import { useState, useEffect } from "react";
import { MessageCircle, ChevronUp } from "lucide-react";

interface StickyMobileCTAProps {
    courseName: string;
    price: number | null;
    adminNumber?: string;
}

export function StickyMobileCTA({
    courseName,
    price,
    adminNumber = "6281234567890",
}: StickyMobileCTAProps) {
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 400px
            setIsVisible(window.scrollY > 400);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const message = encodeURIComponent(
        `Halo Admin, saya tertarik dengan kursus *${courseName}* di Suvi Training. Mohon info lebih lanjut! 🙏`
    );
    const waLink = `https://wa.me/${adminNumber}?text=${message}`;

    const handleClick = () => {
        window.open(waLink, "_blank", "noopener,noreferrer");
    };

    const formatPrice = (p: number | null) => {
        if (!p) return "Hubungi Admin";
        return `Rp ${p.toLocaleString("id-ID")}`;
    };

    if (!isVisible) return null;

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
            {/* Expandable price info */}
            <div
                className={`
          bg-white border-t border-gray-200 px-4 py-3
          transition-all duration-300 ease-out
          ${isExpanded ? "translate-y-0 opacity-100" : "translate-y-full opacity-0 pointer-events-none"}
        `}
            >
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-xs text-gray-500">Investasi Pembelajaran</p>
                        <p className="text-lg font-bold text-gray-900">
                            {formatPrice(price)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-gray-500">Sudah termasuk</p>
                        <p className="text-sm text-gray-700">Sertifikat + Modul</p>
                    </div>
                </div>
            </div>

            {/* Main CTA Bar */}
            <div className="bg-white/95 backdrop-blur-sm border-t border-gray-200 px-4 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
                <div className="flex items-center gap-3">
                    {/* Toggle Button */}
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <ChevronUp
                            className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                        />
                    </button>

                    {/* Price Preview */}
                    <div className="flex-1">
                        <p className="text-xs text-gray-500">Mulai dari</p>
                        <p className="font-bold text-gray-900">{formatPrice(price)}</p>
                    </div>

                    {/* CTA Button */}
                    <button
                        onClick={handleClick}
                        className="
              flex items-center gap-2 px-6 py-3 rounded-xl
              bg-gradient-to-r from-green-500 to-emerald-600
              hover:from-green-600 hover:to-emerald-700
              text-white font-bold
              shadow-lg shadow-green-500/25
              transition-all duration-300
              hover:scale-105 active:scale-100
            "
                    >
                        <MessageCircle className="w-5 h-5" />
                        <span>Daftar</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
