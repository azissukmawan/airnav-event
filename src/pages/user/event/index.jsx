import { Typography } from "../../../components/typography";
import Card from "../../../components/card";
import { Bell } from "lucide-react";

const events = [
  {
    id: 1,
    title: "Rapat Koordinator Bersama Jajaran Direktur",
    date: "25 November 2025, 09:00 WIB",
    location: "Gedung Dormitory",
    status: "Bisa Daftar",
    image:
      "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    description:
      "Rapat koordinasi antara para koordinator divisi dan jajaran direktur Airnav Indonesia untuk membahas rencana strategis triwulan keempat tahun 2025. Agenda utama meliputi evaluasi kinerja, penguatan koordinasi lintas divisi, dan penyusunan roadmap operasional tahun 2026.",
    time: "09.00 - 12.00 WIB",
    info:
      "Peserta diharapkan hadir 15 menit sebelum acara dimulai. Dresscode: formal. Harap membawa dokumen presentasi unit kerja masing-masing dalam format digital maupun cetak.",
    files: [
      { name: "Agenda_Rapat.pdf", url: "#" },
      { name: "Template_Presentasi.pptx", url: "#" },
    ],
  },
  {
    id: 2,
    title: "Pelatihan Safety Airnav Indonesia",
    date: "1 Desember 2025, 13:00 WIB",
    location: "Ruang Rapat Utama",
    status: "Terdaftar",
    image: "https://placehold.co/600x400",
    description:
      "Pelatihan internal terkait keselamatan kerja di lingkungan Airnav Indonesia. Materi mencakup prosedur evakuasi, penggunaan alat pemadam api ringan (APAR), serta simulasi keadaan darurat di bandara.",
    time: "13.00 - 16.00 WIB",
    info:
      "Diperuntukkan bagi seluruh staf teknis dan manajerial. Sertifikat pelatihan akan diberikan kepada peserta yang mengikuti seluruh sesi hingga selesai.",
    files: [
      { name: "Panduan_Safety.pdf", url: "#" },
      { name: "Simulasi_APAR.mp4", url: "#" },
    ],
  },
  {
    id: 3,
    title: "Workshop Sistem Informasi Navigasi",
    date: "10 Desember 2025, 10:00 WIB",
    location: "Gedung Pelatihan A",
    status: "Segera Hadir",
    image: "https://placehold.co/600x400",
    description:
      "Workshop pengenalan dan pembaruan sistem informasi navigasi udara berbasis digital. Kegiatan ini bertujuan untuk meningkatkan efisiensi pengelolaan data dan keamanan penerbangan.",
    time: "10.00 - 14.00 WIB",
    info:
      "Pendaftaran akan dibuka mulai 25 November 2025 melalui portal resmi. Peserta diwajibkan membawa laptop pribadi untuk sesi praktik.",
    files: [
      { name: "Panduan_Workshop.pdf", url: "#" },
      { name: "Materi_Session1.pptx", url: "#" },
    ],
  },
  {
    id: 4,
    title: "Pelatihan Dasar Komunikasi ATC",
    date: "20 Oktober 2025, 08:00 WIB",
    location: "Ruang Simulator ATC",
    status: "Ditutup",
    image: "https://placehold.co/600x400",
    description:
      "Pelatihan bagi calon petugas Air Traffic Control (ATC) yang berfokus pada teknik komunikasi efektif antara menara kontrol dan pilot. Termasuk sesi simulasi intensif dengan peralatan asli.",
    time: "08.00 - 15.00 WIB",
    info:
      "Peserta wajib telah mengikuti pelatihan dasar navigasi. Materi dan simulasi disusun oleh tim pelatih bersertifikasi ICAO.",
    files: [
      { name: "Materi_ATC_Basic.pdf", url: "#" },
      { name: "Skenario_Simulasi.docx", url: "#" },
    ],
  },
  {
    id: 5,
    title: "Sosialisasi Program K3 dan Lingkungan",
    date: "5 Oktober 2025, 09:00 WIB",
    location: "Aula Gedung Utama",
    status: "Ditutup",
    image: "https://placehold.co/600x400",
    description:
      "Acara sosialisasi kebijakan terbaru mengenai keselamatan dan kesehatan kerja (K3) serta program ramah lingkungan di seluruh unit kerja Airnav Indonesia.",
    time: "09.00 - 11.30 WIB",
    info:
      "Kegiatan ini telah selesai dilaksanakan. Materi sosialisasi dapat diakses melalui portal internal perusahaan untuk referensi peserta.",
    files: [
      { name: "Materi_K3_2025.pdf", url: "#" },
      { name: "Form_Evaluasi.xlsx", url: "#" },
    ],
  },
];

const Event = () => {
  const registeredEventsCount = events.filter(event => event.status === "Terdaftar").length;
  const totalEventsCount = events.filter(event => event.status === "Bisa Daftar").length;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
            Selamat Datang, Akbar!
          </h1>
          <h1 className="text-sm md:text-md text-typo-secondary mb-1">
          Kamu terdaftar di {registeredEventsCount} dari {totalEventsCount} event yang tersedia
          </h1>
          <Typography type="body" className="text-typo-secondary">
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-3 rounded-full bg-primary-10 text-primary"
            onClick={() => {}}
          >
            <Bell />
          </button>
          <img 
            src="https://ui-avatars.com/api/?name=User+Name&size=200&background=3b82f6&color=fff&bold=true"
            alt="Profile" 
            className="hidden lg:block w-14 h-14 rounded-full object-cover border-gray-200 shadow-sm"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            id={event.id}
            title={event.title}
            date={event.date}
            location={event.location}
            status={event.status}
            image={event.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Event;