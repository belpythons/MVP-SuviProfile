import prisma from "../lib/prisma";
import {
  type Course,
  type CreateCourseRequest,
  type UpdateCourseRequest,
} from "../models/courses";
import { ResponseError } from "../errors/response_error";

export class CoursesService {
  static async getAll(): Promise<Course[]> {
    try {
      const courses = await prisma.kursus.findMany({
        orderBy: {
          created_at: "desc",
        },
      });
      return courses;
    } catch (error) {
      console.error("Error fetching courses:", error);
      throw new ResponseError(400, "Data kursus tidak ditemukan");
    }
  }

  static async create(
    request: CreateCourseRequest
  ): Promise<{ id: number; nama_kursus: string }> {
    try {
      if (!request.nama_kursus) {
        throw new ResponseError(400, "Nama kursus wajib diisi.");
      }

      const course = await prisma.kursus.create({
        data: {
          nama_kursus: request.nama_kursus,
          durasi: request.durasi,
          gambar_url: request.gambar_url || null,
        },
      });

      return {
        id: course.id,
        nama_kursus: course.nama_kursus,
      };
    } catch (error) {
      if (error instanceof ResponseError) {
        throw error;
      }
      console.error("Error creating course:", error);
      throw new ResponseError(400, "Nama kursus wajib diisi.");
    }
  }

  static async update(
    id: number,
    request: UpdateCourseRequest
  ): Promise<Course> {
    try {
      if (!request.nama_kursus && !request.durasi && !request.gambar_url) {
        throw new ResponseError(400, "Nama kursus wajib diisi.");
      }

      // Check if course exists
      const existingCourse = await prisma.kursus.findUnique({
        where: { id },
      });

      if (!existingCourse) {
        throw new ResponseError(400, "Kursus tidak ditemukan.");
      }

      // Update course
      const updatedCourse = await prisma.kursus.update({
        where: { id },
        data: {
          nama_kursus: request.nama_kursus || existingCourse.nama_kursus,
          durasi: request.durasi || existingCourse.durasi,
          gambar_url:
            request.gambar_url !== undefined
              ? request.gambar_url
              : existingCourse.gambar_url,
        },
      });

      return updatedCourse;
    } catch (error) {
      if (error instanceof ResponseError) {
        throw error;
      }
      console.error("Error updating course:", error);
      throw new ResponseError(400, "Nama kursus wajib diisi.");
    }
  }

  static async delete(id: number): Promise<string> {
    try {
      await prisma.kursus.delete({
        where: { id },
      });

      return "Kursus berhasil dihapus";
    } catch (error: any) {
      if (error.code === "P2025") {
        throw new ResponseError(400, "Kursus tidak ditemukan.");
      }
      console.error("Error deleting course:", error);
      throw new ResponseError(400, "Kursus tidak ditemukan.");
    }
  }
}
