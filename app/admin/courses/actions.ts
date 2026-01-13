"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

export interface UpdateCourseData {
    judul: string;
    deskripsi: string;
    harga: number | null;
    gambar_url: string;
    syllabus: string[];
    is_active: boolean;
}

export async function updateCourse(id: number, data: UpdateCourseData) {
    try {
        await db.kursus.update({
            where: { id },
            data: {
                judul: data.judul,
                deskripsi: data.deskripsi,
                harga: data.harga,
                gambar_url: data.gambar_url || null,
                syllabus: data.syllabus,
                is_active: data.is_active,
            },
        });

        revalidatePath("/admin/courses");
        revalidatePath(`/kursus/[slug]`, "page");

        return { success: true };
    } catch (error) {
        console.error("Update course error:", error);
        return { success: false, error: "Gagal menyimpan perubahan" };
    }
}
