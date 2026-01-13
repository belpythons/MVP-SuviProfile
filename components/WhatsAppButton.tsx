"use client";

import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import { createLead } from "@/lib/actions/leads";

interface WhatsAppButtonProps {
    courseName: string;
    courseId?: number;
    adminNumber?: string;
    className?: string;
    variant?: "default" | "compact";
}

export function WhatsAppButton({
    courseName,
    courseId,
    adminNumber = "6281234567890",
    className = "",
    variant = "default",
}: WhatsAppButtonProps) {
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [nama, setNama] = useState("");
    const [noWa, setNoWa] = useState("");

    const message = encodeURIComponent(
        `Halo Admin, saya tertarik dengan kursus *${courseName}* di Suvi Training. Mohon info lebih lanjut! 🙏`
    );
    const waLink = `https://wa.me/${adminNumber}?text=${message}`;

    const handleDirectClick = () => {
        // For compact variant, just open WhatsApp directly
        window.open(waLink, "_blank", "noopener,noreferrer");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Save lead to database
        await createLead({
            nama: nama || "Pengunjung",
            noWa: noWa || "-",
            kursusId: courseId,
            source: "WhatsApp Button",
        });

        // Open WhatsApp
        window.open(waLink, "_blank", "noopener,noreferrer");
        setShowModal(false);
        setIsSubmitting(false);
        setNama("");
        setNoWa("");
    };

    if (variant === "compact") {
        return (
            <button
                onClick={handleDirectClick}
                className={`
          group flex items-center justify-center gap-2 
          px-4 py-2.5 rounded-xl
          bg-gradient-to-r from-green-500 to-emerald-600
          hover:from-green-600 hover:to-emerald-700
          text-white font-semibold text-sm
          shadow-lg shadow-green-500/25
          hover:shadow-xl hover:shadow-green-500/30
          transition-all duration-300
          hover:scale-[1.02] active:scale-[0.98]
          ${className}
        `}
            >
                <MessageCircle className="w-4 h-4 transition-transform group-hover:scale-110" />
                <span>Daftar</span>
            </button>
        );
    }

    return (
        <>
            <button
                onClick={() => setShowModal(true)}
                className={`
          group flex items-center justify-center gap-3 
          w-full py-3.5 px-6 rounded-2xl
          bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500
          hover:from-green-600 hover:via-emerald-600 hover:to-teal-600
          text-white font-bold text-base
          shadow-xl shadow-green-500/30
          hover:shadow-2xl hover:shadow-green-500/40
          transition-all duration-300
          hover:scale-[1.02] active:scale-[0.98]
          ${className}
        `}
            >
                <MessageCircle className="w-5 h-5 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                <span>Daftar Sekarang via WhatsApp</span>
            </button>

            {/* Lead Capture Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    />

                    {/* Modal */}
                    <div className="relative bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 fade-in duration-200">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Daftar Kursus
                        </h3>
                        <p className="text-gray-500 text-sm mb-6">
                            Isi data berikut untuk melanjutkan ke WhatsApp
                        </p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    type="text"
                                    value={nama}
                                    onChange={(e) => setNama(e.target.value)}
                                    placeholder="Nama Anda"
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nomor WhatsApp
                                </label>
                                <input
                                    type="tel"
                                    value={noWa}
                                    onChange={(e) => setNoWa(e.target.value)}
                                    placeholder="08123456789"
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-700 font-medium hover:bg-gray-50"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            <MessageCircle className="w-5 h-5" />
                                            <span>Lanjut</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>

                        <p className="text-xs text-gray-400 text-center mt-4">
                            Kursus: {courseName}
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}
