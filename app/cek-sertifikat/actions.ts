"use server";

import { db } from "@/lib/db";

export interface CertificateResult {
    found: boolean;
    data?: {
        nama: string;
        nomorSertifikat: string;
        kompetensi: string;
        tanggalLulus: Date;
    };
    error?: string;
}

export async function verifyCertificate(
    query: string
): Promise<CertificateResult> {
    if (!query || query.trim().length < 3) {
        return {
            found: false,
            error: "Masukkan minimal 3 karakter untuk pencarian",
        };
    }

    try {
        // Search by certificate number (exact match)
        const certificate = await db.sertifikat.findFirst({
            where: {
                OR: [
                    { nomor_sertifikat: query.trim().toUpperCase() },
                    { nomor_sertifikat: query.trim() },
                    // Also try partial match
                    { nomor_sertifikat: { contains: query.trim() } },
                ],
            },
        });

        if (certificate) {
            return {
                found: true,
                data: {
                    nama: certificate.nama,
                    nomorSertifikat: certificate.nomor_sertifikat,
                    kompetensi: certificate.kompetensi,
                    tanggalLulus: certificate.tanggal_lulus,
                },
            };
        }

        return {
            found: false,
            error: "Sertifikat tidak ditemukan. Pastikan nomor sertifikat sudah benar.",
        };
    } catch (error) {
        console.error("Certificate verification error:", error);
        return {
            found: false,
            error: "Terjadi kesalahan sistem. Silakan coba lagi nanti.",
        };
    }
}
