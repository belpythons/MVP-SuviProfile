import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { CourseEditForm } from "./CourseEditForm";

interface CourseEditPageProps {
    params: Promise<{ id: string }>;
}

export default async function CourseEditPage({ params }: CourseEditPageProps) {
    const { id } = await params;
    const courseId = parseInt(id);

    if (isNaN(courseId)) {
        notFound();
    }

    let course = null;
    try {
        course = await db.kursus.findUnique({
            where: { id: courseId },
        });
    } catch (error) {
        console.error("Fetch course error:", error);
    }

    if (!course) {
        notFound();
    }

    // Parse syllabus from JSON to string array
    const syllabus = Array.isArray(course.syllabus)
        ? (course.syllabus as string[])
        : [];

    return (
        <div className="max-w-4xl space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Edit Kursus</h1>
                <p className="text-gray-500 mt-1">{course.judul}</p>
            </div>

            {/* Form */}
            <CourseEditForm
                course={{
                    id: course.id,
                    judul: course.judul,
                    deskripsi: course.deskripsi || "",
                    harga: course.harga ? Number(course.harga) : null,
                    gambar_url: course.gambar_url || "",
                    syllabus: syllabus,
                    is_active: course.is_active,
                }}
            />
        </div>
    );
}
