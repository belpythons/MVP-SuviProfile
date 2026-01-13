"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

// ============================================
// Types
// ============================================
interface CreateTestimonialData {
    nama_siswa: string;
    pekerjaan?: string;
    isi_review: string;
    rating: number;
    foto_url?: string;
}

interface ActionResult {
    success: boolean;
    error?: string;
}

// ============================================
// Create Testimonial
// ============================================
export async function createTestimonial(
    data: CreateTestimonialData
): Promise<ActionResult> {
    try {
        // Validate required fields
        if (!data.nama_siswa || data.nama_siswa.trim().length < 2) {
            return { success: false, error: "Nama siswa minimal 2 karakter" };
        }

        if (!data.isi_review || data.isi_review.trim().length < 10) {
            return { success: false, error: "Review minimal 10 karakter" };
        }

        if (data.rating < 1 || data.rating > 5) {
            return { success: false, error: "Rating harus antara 1-5" };
        }

        await db.testimoni.create({
            data: {
                nama_siswa: data.nama_siswa.trim(),
                pekerjaan: data.pekerjaan?.trim() || null,
                isi_review: data.isi_review.trim(),
                rating: data.rating,
                foto_url: data.foto_url || null,
                is_active: true,
            },
        });

        revalidatePath("/admin/testimonials");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Create testimonial error:", error);
        return { success: false, error: "Gagal membuat testimoni" };
    }
}

// ============================================
// Delete Testimonial
// ============================================
export async function deleteTestimonial(id: number): Promise<ActionResult> {
    try {
        await db.testimoni.delete({
            where: { id },
        });

        revalidatePath("/admin/testimonials");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Delete testimonial error:", error);
        return { success: false, error: "Gagal menghapus testimoni" };
    }
}

// ============================================
// Toggle Testimonial Status
// ============================================
export async function toggleTestimonialStatus(
    id: number
): Promise<ActionResult> {
    try {
        const testimonial = await db.testimoni.findUnique({
            where: { id },
        });

        if (!testimonial) {
            return { success: false, error: "Testimoni tidak ditemukan" };
        }

        await db.testimoni.update({
            where: { id },
            data: { is_active: !testimonial.is_active },
        });

        revalidatePath("/admin/testimonials");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Toggle testimonial status error:", error);
        return { success: false, error: "Gagal mengubah status testimoni" };
    }
}
