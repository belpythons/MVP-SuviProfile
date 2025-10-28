import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create courses
  const courses = await prisma.kursus.createMany({
    data: [
      {
        nama_kursus: "Web Development",
        durasi: "3 bulan",
        gambar_url: "http://example.com/images/webdev.jpg",
      },
      {
        nama_kursus: "Desain Grafis",
        durasi: "2 bulan",
        gambar_url: "http://example.com/images/desain.jpg",
      },
      {
        nama_kursus: "Digital Marketing",
        durasi: "3 bulan",
        gambar_url: "http://example.com/images/digitalmarketing.jpg",
      },
      {
        nama_kursus: "Mobile App Development",
        durasi: "4 bulan",
        gambar_url: "http://example.com/images/mobile.jpg",
      },
      {
        nama_kursus: "Data Science",
        durasi: "6 bulan",
        gambar_url: "http://example.com/images/datascience.jpg",
      },
    ],
    skipDuplicates: true,
  });

  console.log("Created courses:", courses);

  // Get created courses to use their IDs
  const createdCourses = await prisma.kursus.findMany();

  // Create registrations
  const registrations = await prisma.pendaftaran.createMany({
    data: [
      {
        nama_lengkap: "Budi Santoso",
        email: "budi.santoso@example.com",
        kursus_id: createdCourses[0].id,
      },
      {
        nama_lengkap: "Siti Aminah",
        email: "siti.aminah@example.com",
        kursus_id: createdCourses[1].id,
      },
      {
        nama_lengkap: "Ahmad Rahman",
        email: "ahmad.rahman@example.com",
        kursus_id: createdCourses[0].id,
      },
      {
        nama_lengkap: "Dewi Lestari",
        email: "dewi.lestari@example.com",
        kursus_id: createdCourses[2].id,
      },
      {
        nama_lengkap: "Eko Prasetyo",
        email: "eko.prasetyo@example.com",
        kursus_id: createdCourses[1].id,
      },
    ],
    skipDuplicates: true,
  });

  console.log("Created registrations:", registrations);
  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
