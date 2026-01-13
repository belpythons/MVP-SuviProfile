import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { BookOpen, CheckCircle } from "lucide-react";

// ============================================
// Fallback Syllabus Data (when DB is empty)
// ============================================
const FALLBACK_SYLLABUS: Record<string, string[]> = {
    Perkantoran: [
        "Pengenalan Microsoft Office",
        "Microsoft Word Mahir",
        "Microsoft Excel Produktif",
        "Microsoft PowerPoint Impactful",
        "Project Akhir",
    ],
    Desain: [
        "Pengenalan Desain Grafis",
        "Penguasaan Tools",
        "Teknik Desain Lanjut",
        "Proyek Portofolio",
    ],
    Teknis: [
        "Dasar Hardware Komputer",
        "Troubleshooting Hardware",
        "Instalasi Software & OS",
        "Jaringan Dasar",
        "Praktik Lapangan",
    ],
    Bisnis: [
        "Dasar-dasar Bisnis",
        "Manajemen Keuangan",
        "Strategi Pemasaran",
        "Operasional Bisnis",
        "Business Plan Final",
    ],
    Digital: [
        "Pengenalan Digital Marketing",
        "Social Media Marketing",
        "Search Engine Optimization",
        "Paid Advertising",
        "Proyek Kampanye Digital",
    ],
    Lainnya: [
        "Modul Pengenalan",
        "Materi Inti",
        "Proyek Akhir",
    ],
};

interface SyllabusAccordionProps {
    kategori: string;
    syllabus?: string[] | null; // From database
}

export function SyllabusAccordion({
    kategori,
    syllabus,
}: SyllabusAccordionProps) {
    // Use database syllabus if available, otherwise fallback
    const topics =
        syllabus && syllabus.length > 0
            ? syllabus
            : FALLBACK_SYLLABUS[kategori] || FALLBACK_SYLLABUS["Lainnya"];

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-xl bg-purple-100">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Materi Pembelajaran</h3>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
                {topics.map((topic, index) => (
                    <AccordionItem
                        key={index}
                        value={`topic-${index}`}
                        className="border border-gray-200 rounded-xl px-4 data-[state=open]:bg-purple-50/50 transition-colors"
                    >
                        <AccordionTrigger className="hover:no-underline py-4">
                            <div className="flex items-center gap-3 text-left">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-bold flex items-center justify-center">
                                    {index + 1}
                                </span>
                                <span className="font-semibold text-gray-900">{topic}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pl-11">
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Materi teori dan praktik</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Latihan dan studi kasus</span>
                                </li>
                                <li className="flex items-start gap-2 text-gray-600">
                                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                    <span>Evaluasi kompetensi</span>
                                </li>
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </div>
    );
}
