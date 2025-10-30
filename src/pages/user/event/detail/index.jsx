import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Calendar, MapPin, Clock, FileText, Download, Copy, Facebook, MessageCircle, X } from "lucide-react";
import { Typography } from "../../../../components/typography";
import { Button } from "../../../../components/button";
import Breadcrumb from "../../../../components/breadcrumb";

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
      { name: "Agenda_Rapat.pdf", url: "#", type: "rundown" },
      { name: "Template_Presentasi.pptx", url: "#", type: "module" },
      { name: "Template_Presentasi2.pptx", url: "#", type: "module" },
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
      { name: "Panduan_Safety.pdf", url: "#", type: "rundown" },
      { name: "Simulasi_APAR.mp4", url: "#", type: "module" },
      { name: "Simulasi_APAR2.mp4", url: "#", type: "module" },
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
      { name: "Panduan_Workshop.pdf", url: "#", type: "rundown" },
      { name: "Materi_Session1.pptx", url: "#", type: "module" },
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
      { name: "Materi_ATC_Basic.pdf", url: "#", type: "rundown" },
      { name: "Skenario_Simulasi.docx", url: "#", type: "module" },
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
      { name: "Materi_K3_2025.pdf", url: "#", type: "rundown" },
      { name: "Form_Evaluasi.xlsx", url: "#", type: "module" },
    ],
  },
];

const breadcrumbItems = [
  { label: "Beranda", link: "/user" },
  { label: "Detail Aktivitas" },
];

const DetailEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const event = events.find((e) => e.id === parseInt(id));

  // Handle jika event tidak ditemukan
  if (!event) {
    return (
      <div className="pb-10">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 text-center">
          <Typography type="heading3" className="text-gray-900 mb-4">
            Event tidak ditemukan
          </Typography>
          <Button variant="primary" onClick={() => navigate('/user')}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = () => {
    if (event.status === "Bisa Daftar") {
      setShowConfirmModal(true);
    }
  };

  const confirmRegis = () => {
    alert("Anda berhasil mendaftar event!");
    setShowConfirmModal(false);
  };

  const cancelRegis = () => {
    setShowConfirmModal(false);
  };

  const downloadAllModules = () => {
    const modules = event.files.filter(file => file.type === "module");
    if (modules && modules.length > 0) {
      modules.forEach((module) => {
        const link = document.createElement('a');
        link.href = module.url;
        link.download = module.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      alert(`Mendownload ${modules.length} file modul...`);
    }
  };

  const shareToFacebook = () => alert("Share ke Facebook");
  const shareToWhatsApp = () => alert("Share ke WhatsApp");
  const shareToX = () => alert("Share ke X (Twitter)");

  return (
    <div className="pb-10">
      <Breadcrumb items={breadcrumbItems} />

      <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden mt-6">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={event.image}
            alt={event.title}
            className="w-full h-full object-cover blur-sm scale-110"
          />
        </div>

        <div className="absolute inset-0 bg-black/60"></div>

        <div className="absolute inset-0 flex items-center px-6 sm:px-8 md:px-12 lg:px-16 z-10">
          <div className="flex items-center justify-between w-full gap-6">
            <div className="flex-1 max-w-xl">
              <Typography
                type="heading3"
                weight="bold"
                className="text-white drop-shadow-lg mb-4 text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight"
              >
                {event.title}
              </Typography>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Typography type="body" className="text-white text-sm sm:text-base">
                    {event.location}
                  </Typography>
                </div>
                
                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Typography type="body" className="text-white text-sm sm:text-base">
                    {event.date}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="h-48 lg:h-64 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={event.image}
                  alt="Event thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Tentang Acara */}
        <div className="grid md:grid-cols-3 gap-4 bg-white p-8 rounded-xl shadow-sm space-x-6">
          <div className="md:col-span-2">
            <Typography type="heading5" weight="semibold" className="mb-2">
              Tentang Acara
            </Typography>
            <Typography
              type="body"
              className="text-typo-secondary"
            >
              {event.description}
            </Typography>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <Button 
              variant={
                event.status === "Bisa Daftar"
                  ? "primary"
                  : event.status === "Terdaftar"
                  ? "green"
                  : event.status === "Segera Hadir"
                  ? "third"
                  : "third"
              }
              className="w-full md:w-auto"
              onClick={handleRegister}
            >
              {event.status === "Bisa Daftar"
                ? "Daftar Sekarang"
                : event.status === "Terdaftar"
                ? "Terdaftar"
                : event.status === "Segera Hadir"
                ? "Segera Hadir"
                : "Segera Hadir"}
            </Button>

            <div className="flex flex-col gap-3">
              <Typography type="body" weight="medium" className="text-gray-700">
                Bagikan Event:
              </Typography>
              <div className="flex gap-3">
                <div
                  onClick={copyToClipboard}
                  className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 cursor-pointer"
                  title="Salin Tautan"
                >
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToFacebook}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 cursor-pointer"
                  title="Bagikan ke Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToWhatsApp}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 cursor-pointer"
                  title="Bagikan ke WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToX}
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 cursor-pointer"
                  title="Bagikan ke X (Twitter)"
                >
                  <X className="w-5 h-5 text-white" />
                </div>
              </div>
              {copied && (
                <Typography type="caption2" className="text-success">
                  Tautan disalin ke clipboard
                </Typography>
              )}
            </div>
          </div>
        </div>

        {/* File Pendukung */}
        {event.status === "Terdaftar" && (
          <div className="grid md:grid-cols-2 gap-6">
            {event.files.find(f => f.type === "rundown") && (
              <a
                href={event.files.find(f => f.type === "rundown").url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 bg-white hover:bg-primary-10 p-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white p-4 rounded-full">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <Typography type="body" weight="bold" className="text-primary mb-1">
                      Rundown
                    </Typography>
                    <Typography type="caption2" className="text-typo-secondary">
                      {event.files.find(f => f.type === "rundown").name}
                    </Typography>
                  </div>
                </div>
              </a>
            )}

            {/* Card Module */}
            <button
              onClick={downloadAllModules}
              className="flex flex-col gap-3 bg-white hover:bg-success-10 p-4 rounded-xl transition-colors cursor-pointer shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className="bg-success text-white p-4 rounded-full">
                  <Download className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <Typography type="body" weight="bold" className="text-success mb-1">
                    Modul
                  </Typography>
                  <Typography type="caption2" className="text-typo-secondary">
                    {event.files.filter(f => f.type === "module").length} file tersedia
                  </Typography>
                </div>
              </div>
            </button>
          </div>
        )}

        {/* Info Acara */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <Typography
            type="heading5"
            weight="semibold"
            className="mb-4 flex items-center gap-2"
          >
            Informasi Acara
          </Typography>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Alamat:</strong> {event.location}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Tanggal Pendaftaran:</strong> {event.date}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Tanggal Acara:</strong> {event.date}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Jam Acara:</strong> {event.time}
              </Typography>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="bg-white p-8 rounded-xl shadow-sm">
          <Typography
            type="heading5"
            weight="semibold"
            className="mb-2 flex items-center gap-3"
          >
            Informasi Tambahan
          </Typography>
          <Typography type="body" className="text-typo-secondary">
            {event.info}
          </Typography>
        </div>

        {/* Cofirm Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={cancelRegis}>
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <Typography type="heading5" weight="bold" className="text-gray-900 mb-4">
                Konfirmasi Pendaftaran
              </Typography>
              <Typography type="body" className="text-gray-600 mb-6">
                Apakah Anda bersedia mengikuti event "{event.title}"?
              </Typography>

              <div className="flex justify-center gap-3">
                <Button variant="red" onClick={cancelRegis}>Tidak</Button>
                <Button variant="primary" onClick={confirmRegis}>Ya, Saya Bersedia</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailEvent;