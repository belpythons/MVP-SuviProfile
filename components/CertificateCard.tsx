"use client";

import QRCode from "react-qr-code";
import { Award, Calendar, BadgeCheck, User } from "lucide-react";

interface CertificateCardProps {
    nama: string;
    nomorSertifikat: string;
    kompetensi: string;
    tanggalLulus: Date;
    verificationUrl: string;
}

export function CertificateCard({
    nama,
    nomorSertifikat,
    kompetensi,
    tanggalLulus,
    verificationUrl,
}: CertificateCardProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        }).format(date);
    };

    return (
        <div className="relative overflow-hidden">
            {/* Certificate Card */}
            <div
                className="
          relative bg-white rounded-3xl
          border-4 border-amber-400
          shadow-2xl shadow-amber-200/50
          p-8 md:p-10
        "
            >
                {/* Decorative Corner Elements */}
                <div className="absolute top-0 left-0 w-16 h-16 border-l-4 border-t-4 border-amber-500 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-16 h-16 border-r-4 border-t-4 border-amber-500 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-16 h-16 border-l-4 border-b-4 border-amber-500 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-r-4 border-b-4 border-amber-500 rounded-br-2xl" />

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 mb-3">
                        <Award className="w-8 h-8 text-amber-500" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                        SUVI TRAINING
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Lembaga Pelatihan Kerja Terakreditasi
                    </p>
                </div>

                {/* Certificate Title */}
                <div className="text-center mb-8">
                    <p className="text-lg text-gray-600">Dengan ini menyatakan bahwa</p>
                    <h3 className="text-2xl md:text-4xl font-bold text-gray-900 mt-3 mb-3">
                        {nama}
                    </h3>
                    <p className="text-lg text-gray-600">
                        Telah menyelesaikan program pelatihan
                    </p>
                </div>

                {/* Competency */}
                <div className="text-center mb-8">
                    <div className="inline-block px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-100 to-pink-100 border border-purple-200">
                        <p className="text-xl md:text-2xl font-bold text-purple-700">
                            {kompetensi}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {/* Certificate Number */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <BadgeCheck className="w-6 h-6 text-green-600" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Nomor Sertifikat
                            </p>
                            <p className="font-bold text-gray-900">{nomorSertifikat}</p>
                        </div>
                    </div>

                    {/* Date */}
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border border-gray-200">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <div>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">
                                Tanggal Lulus
                            </p>
                            <p className="font-bold text-gray-900">
                                {formatDate(tanggalLulus)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* QR Code Section */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-6 pt-6 border-t border-gray-200">
                    <div className="p-3 bg-white rounded-xl shadow-inner border border-gray-200">
                        <QRCode
                            value={verificationUrl}
                            size={100}
                            level="M"
                            bgColor="#ffffff"
                            fgColor="#1f2937"
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-sm text-gray-500">
                            Scan QR code untuk verifikasi
                        </p>
                        <p className="text-xs text-gray-400 mt-1 max-w-[200px] truncate">
                            {verificationUrl}
                        </p>
                    </div>
                </div>

                {/* Verified Badge */}
                <div className="absolute top-6 right-6">
                    <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-semibold border border-green-200">
                        <BadgeCheck className="w-4 h-4" />
                        <span>TERVERIFIKASI</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
