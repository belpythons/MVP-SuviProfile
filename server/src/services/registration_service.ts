import prisma from "../lib/prisma";
import {
  type Registration,
  type CreateRegistrationRequest,
  type GetRegistrationsResponse,
} from "../models/registration";
import { ResponseError } from "../errors/response_error";

export class RegistrationService {
  static async create(request: CreateRegistrationRequest): Promise<Registration> {
    try {
      if (!request.nama_lengkap || !request.email || !request.kursus_id) {
        throw new ResponseError(400, "Data pendafataran tidak lengkap");
      }

      const registration = await prisma.pendaftaran.create({
        data: {
          nama_lengkap: request.nama_lengkap,
          email: request.email,
          kursus_id: request.kursus_id,
        }
      });

      return registration;
    } catch (error: any) {
      if (error instanceof ResponseError) {
        throw error;
      }
      if (error.code === 'P2002') {
        throw new ResponseError(400, "Email sudah terdaftar untuk kursus ini");
      }
      if (error.code === 'P2003') {
        throw new ResponseError(400, "Kursus tidak ditemukan");
      }
      console.error("Error creating registration:", error);
      throw new ResponseError(400, "Data pendafataran tidak lengkap");
    }
  }

  static async getAll(page: number = 1, size: number = 10): Promise<GetRegistrationsResponse> {
    try {
      const skip = (page - 1) * size;

      // Get total count
      const total = await prisma.pendaftaran.count();
      const total_page = Math.ceil(total / size);

      // Get paginated data with course information
      const registrations = await prisma.pendaftaran.findMany({
        skip: skip,
        take: size,
        include: {
          kursus: {
            select: {
              nama_kursus: true
            }
          }
        },
        orderBy: {
          created_at: 'desc'
        }
      });

      return {
        data: registrations,
        paging: {
          current_page: page,
          total_page: total_page,
          size: registrations.length
        }
      };
    } catch (error) {
      console.error("Error fetching registrations:", error);
      throw new ResponseError(400, "Unauthorized: Invalid token");
    }
  }

  static async delete(id: number): Promise<string> {
    try {
      await prisma.pendaftaran.delete({
        where: { id }
      });

      return "Pendaftar berhasil dihapus";
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new ResponseError(400, "Pendaftar tidak ditemukan");
      }
      console.error("Error deleting registration:", error);
      throw new ResponseError(400, "Unauthorized: Invalid token");
    }
  }
}
