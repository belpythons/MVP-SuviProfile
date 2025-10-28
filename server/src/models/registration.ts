export type Registration = {
  id: number;
  nama_lengkap: string;
  email: string;
  kursus_id: number;
  tanggal_daftar: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateRegistrationRequest = {
  nama_lengkap: string;
  email: string;
  kursus_id: number;
};

export type GetRegistrationsResponse = {
  data: Registration[];
  paging: {
    current_page: number;
    total_page: number;
    size: number;
  };
};
