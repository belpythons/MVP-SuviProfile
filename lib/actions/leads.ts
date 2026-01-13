"use server";

import { db } from "@/lib/db";

export async function createLead(data: {
    nama: string;
    noWa: string;
    kursusId?: number;
    source: string;
}) {
    try {
        await db.lead.create({
            data: {
                nama: data.nama,
                no_wa: data.noWa,
                pilihan_kursus_id: data.kursusId || null,
                source: data.source,
                status: "NEW",
            },
        });
        return { success: true };
    } catch (error) {
        console.error("Create lead error:", error);
        return { success: false };
    }
}
