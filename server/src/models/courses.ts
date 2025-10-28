export type Course = {
  id: number;
  nama_kursus: string;
  durasi: string;
  gambar_url: string | null;
  created_at: Date;
  updated_at: Date;
};

export type CreateCourseRequest = {
  nama_kursus: string;
  durasi: string;
  gambar_url?: string;
};

export type UpdateCourseRequest = {
  nama_kursus?: string;
  durasi?: string;
  gambar_url?: string;
};

export type getCourseResponse = Course[];

export type CreateCourseResponse = {
  id: number;
  nama_kursus: string;
};

export type UpdateCourseResponse = Course;
