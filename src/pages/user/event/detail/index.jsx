import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Clock,
  Download,
  Copy,
  Facebook,
  MessageCircle,
  X,
} from "lucide-react";
import { Typography } from "../../../../components/typography";
import { Button } from "../../../../components/button";
import Breadcrumb from "../../../../components/breadcrumb";
import { useEvents } from "../../../../contexts/EventContext";
import Alert from "../../../../components/alert";
import axios from "axios";

const breadcrumbItems = [
  { label: "Beranda", link: "/user" },
  { label: "Detail Acara" },
];

const DetailEvent = () => {
  const { id } = useParams();
  const { events, loading } = useEvents();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const event = events.find((e) => e.id === parseInt(id));

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(
          "https://mediumpurple-swallow-757782.hostingersite.com/api/me/pendaftaran",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();

        if (result.success) {
          setRegisteredEvents(result.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoadingRegistered(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading || loadingRegistered) return <div>Loading...</div>;

  if (!event) {
    return (
      <div className="pb-10">
        <Breadcrumb items={breadcrumbItems} />
        <div className="mt-6 text-center">
          <Typography type="heading3" className="text-gray-900 mb-4">
            Event tidak ditemukan
          </Typography>
          <Button variant="primary" onClick={() => navigate("/user")}>
            Kembali ke Beranda
          </Button>
        </div>
      </div>
    );
  }

  const now = new Date();
  const registrationStart = new Date(event.mdl_pendaftaran_mulai);
  const registrationEnd = new Date(event.mdl_pendaftaran_selesai);
  const eventStart = new Date(event.mdl_acara_mulai);
  const eventEnd = new Date(event.mdl_acara_selesai);

  const isRegistered = registeredEvents.some(
    (e) => e.modul_acara_id === event.id
  );

  let buttonText = "";
  let buttonVariant = "primary";
  let canRegister = false;

  if (now > eventEnd) {
    buttonText = "Acara Telah Selesai";
    buttonVariant = "third";
  } else if (isRegistered) {
    if (now < eventStart) {
      buttonText = "Batal Daftar";
      buttonVariant = "red";
      canRegister = true;
    } else {
      buttonText = "Terdaftar";
      buttonVariant = "green";
    }
  } else if (now >= registrationStart && now <= registrationEnd) {
    buttonText = "Daftar Sekarang";
    buttonVariant = "primary";
    canRegister = true;
  } else if (now < registrationStart) {
    buttonText = "Segera Hadir";
    buttonVariant = "third";
  } else {
    buttonText = "Pendaftaran Ditutup";
    buttonVariant = "third";
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegister = () => {
    console.log("handleRegister clicked");
    if (isRegistered && now < eventStart) {
      setShowCancelModal(true);
    } else if (canRegister && !isRegistered) {
      setShowConfirmModal(true);
    }
  };

  const cancelEventRegis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${API_BASE_URL}/events/${id}/batal-daftar`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data?.success) {
        setAlert({
          type: "info",
          message: "Pendaftaran Anda telah dibatalkan.",
        });
        setShowCancelModal(false);
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setAlert({
          type: "error",
          message: response.data?.message || "Gagal membatalkan pendaftaran.",
        });
      }
    } catch (error) {
      console.error("Error cancelling registration:", error);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan saat membatalkan pendaftaran.",
      });
    }
  };

  const confirmRegis = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/events/${id}/daftar`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        setAlert({
          type: "success",
          message: "Anda berhasil mendaftar event!",
        });
        setShowConfirmModal(false);

        setTimeout(() => window.location.reload(), 1500);
      } else {
        setAlert({
          type: "error",
          message:
            response.data?.message || "Gagal mendaftar. Silakan coba lagi.",
        });
      }
    } catch (error) {
      console.error("Error registering:", error);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
      });
    }
  };

  const cancelRegis = () => {
    setShowConfirmModal(false);
  };

  const downloadAllModules = () => {
    const modules = event.files.filter((file) => file.type === "module");
    if (modules && modules.length > 0) {
      modules.forEach((module) => {
        const link = document.createElement("a");
        link.href = module.url;
        link.download = module.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
      alert(`Mendownload ${modules.length} file modul...`);
    }
  };

  const shareToFacebook = () => {
    const url = encodeURIComponent(window.location.href);
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      "_blank"
    );
  };

  const shareToWhatsApp = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Lihat event ini: ${event.mdl_nama}`);
    window.open(`https://wa.me/?text=${text}%20${url}`, "_blank");
  };

  const shareToX = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Lihat event ini: ${event.mdl_nama}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
      "_blank"
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="pb-10">
      <Breadcrumb items={breadcrumbItems} />

      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <div className="relative w-full h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden mt-6">
        <div className="absolute inset-0 w-full h-full">
          <img
            src={
              event.media_urls?.banner ||
              "https://via.placeholder.com/1200x600?text=Event+Banner"
            }
            alt={event.mdl_nama}
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
                {event.mdl_nama}
              </Typography>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/90">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Typography
                    type="body"
                    className="text-white text-sm sm:text-base"
                  >
                    {event.mdl_lokasi || "Lokasi belum ditentukan"}
                  </Typography>
                </div>

                <div className="flex items-center gap-2 text-white/90">
                  <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                  <Typography
                    type="body"
                    className="text-white text-sm sm:text-base"
                  >
                    {formatDate(event.mdl_acara_mulai)}
                  </Typography>
                </div>
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="h-48 lg:h-64 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src={
                    event.media_urls?.banner ||
                    "https://via.placeholder.com/400x300?text=Event"
                  }
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
            <Typography type="body" className="text-typo-secondary">
              {event.mdl_deskripsi || "Tidak ada deskripsi"}
            </Typography>
          </div>

          <div className="flex flex-col justify-center space-y-6">
            <Button
              variant={buttonVariant}
              className="w-full md:w-auto"
              onClick={handleRegister}
              disabled={!canRegister}
            >
              {buttonText}
            </Button>

            {showConfirmModal && (
              <div
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                onClick={() => setShowConfirmModal(false)}
              >
                <div
                  className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Typography
                    type="heading5"
                    weight="bold"
                    className="text-gray-900 mb-4"
                  >
                    Konfirmasi Pendaftaran
                  </Typography>
                  <Typography type="body" className="text-gray-600 mb-6">
                    Apakah Anda yakin ingin mendaftar pada event "
                    {event.mdl_nama}"?
                  </Typography>

                  <div className="flex justify-center gap-3">
                    <Button variant="third" onClick={cancelRegis}>
                      Batal
                    </Button>
                    <Button variant="primary" onClick={confirmRegis}>
                      Ya, Daftar
                    </Button>
                  </div>
                </div>
              </div>
            )}

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
        {isRegistered && (
          <div className="grid md:grid-cols-2 gap-6">
            {event.media_urls?.file_rundown && (
              <a
                href={event.media_urls.file_rundown}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 bg-white hover:bg-primary-10 p-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary text-white p-4 rounded-full">
                    <Download className="w-8 h-8" />
                  </div>
                  <div>
                    <Typography
                      type="body"
                      weight="bold"
                      className="text-primary mb-1"
                    >
                      Rundown
                    </Typography>
                    <Typography type="caption2" className="text-typo-secondary">
                      File rundown acara
                    </Typography>
                  </div>
                </div>
              </a>
            )}

            {/* Card Module */}
            {event.media_urls?.file_acara && (
              <a
                href={event.media_urls.file_acara}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-3 bg-white hover:bg-success-10 p-4 rounded-xl transition-colors cursor-pointer shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-success text-white p-4 rounded-full">
                    <Download className="w-8 h-8" />
                  </div>
                  <div className="text-left">
                    <Typography
                      type="body"
                      weight="bold"
                      className="text-success mb-1"
                    >
                      Modul
                    </Typography>
                    <Typography type="caption2" className="text-typo-secondary">
                      File modul acara
                    </Typography>
                  </div>
                </div>
              </a>
            )}
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
                <strong>Tipe:</strong> {event.mdl_tipe}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <MapPin className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Lokasi:</strong> {event.mdl_lokasi || "Online"}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Tanggal Pendaftaran:</strong>{" "}
                {formatDate(event.mdl_pendaftaran_mulai)} -{" "}
                {formatDate(event.mdl_pendaftaran_selesai)}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Calendar className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Tanggal Acara:</strong>{" "}
                {formatDate(event.mdl_acara_mulai)}
              </Typography>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-primary-30 text-white p-2 rounded-full">
                <Clock className="w-6 h-6" />
              </div>
              <Typography type="body" className="text-typo-secondary">
                <strong>Jam Acara:</strong> {formatTime(event.mdl_acara_mulai)}{" "}
                - {formatTime(event.mdl_acara_selesai)} WIB
              </Typography>
            </div>
          </div>
        </div>

        {/* Info Tambahan */}
        {event.mdl_catatan && event.mdl_catatan.trim() !== "" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6">
            <Typography
              type="heading5"
              weight="semibold"
              className="mb-2 flex items-center gap-3"
            >
              Informasi Tambahan
            </Typography>
            <Typography type="body" className="text-typo-secondary">
              {event.mdl_catatan}
            </Typography>
          </div>
        )}

        {/* Confirm Modal */}
        {showCancelModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowCancelModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Typography
                type="heading5"
                weight="bold"
                className="text-gray-900 mb-4"
              >
                Batalkan Pendaftaran
              </Typography>
              <Typography type="body" className="text-gray-600 mb-6">
                Apakah Anda yakin ingin membatalkan pendaftaran pada event "
                {event.mdl_nama}"?
              </Typography>

              <div className="flex justify-center gap-3">
                <Button
                  variant="third"
                  onClick={() => setShowCancelModal(false)}
                >
                  Tidak
                </Button>
                <Button variant="red" onClick={cancelEventRegis}>
                  Ya, Batalkan
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailEvent;
