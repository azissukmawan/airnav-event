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
  Monitor,
} from "lucide-react";
import { Typography } from "../../../../components/typography";
import { Button } from "../../../../components/button";
import Breadcrumb from "../../../../components/breadcrumb";
import Alert from "../../../../components/alert";
import axios from "axios";

const breadcrumbItems = [
  { label: "Beranda", link: "/user" },
  { label: "Detail Acara" },
];

const DetailEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [eventRegistration, setEventRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);
  const [alert, setAlert] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showWAModal, setShowWAModal] = useState(false);
  const [showHybridModal, setShowHybridModal] = useState(false);
  const [attendanceType, setAttendanceType] = useState(null);

  // Fetch detail event
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token tidak ditemukan");
          navigate("/login");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/profile/dashboard/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data?.success) {
          setEvent(response.data.data.event);
          setEventRegistration(response.data.data.pendaftaran);
        }
      } catch (error) {
        console.error("Error fetching event detail:", error);
        if (error.response?.status === 401 || error.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id, navigate]);

  // Fetch registered events
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("Token tidak ditemukan");
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/me/pendaftaran`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        if (response.data?.success) {
          setRegisteredEvents(response.data.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoadingRegistered(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  if (loading || loadingRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

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

  // Check if user is registered from the API response or from registeredEvents list
  const isRegistered = eventRegistration !== null || registeredEvents.some(
    (e) => e.modul_acara_id === event.id
  );

  let buttonText = "";
  let buttonVariant = "primary";
  let canRegister = false;

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const isKaryawan =
    user?.status_karyawan === 1 ||
    user?.status_karyawan === "1" ||
    user?.status_karyawan === true;

  if (now > eventEnd) {
    buttonText = "Acara Telah Selesai";
    buttonVariant = "third";
  } else if (isRegistered) {
    if (now < eventStart) {
      if (now > registrationEnd) {
        buttonText = "Batal Daftar (Ditutup)";
        buttonVariant = "third";
        canRegister = false;
      } else {
        buttonText = "Batal Daftar";
        buttonVariant = "red";
        canRegister = true;
      }
    } else {
      buttonText = "Terdaftar";
      buttonVariant = "green";
      canRegister = false;
    }
  } else if (now >= registrationStart && now <= registrationEnd) {
    if (event.mdl_kategori === "private" || event.mdl_kategori === "invite-only") {
      if (isKaryawan) {
        buttonText = "Daftar Sekarang";
        buttonVariant = "primary";
        canRegister = true;
      } else {
        buttonText = event.mdl_kategori === "invite-only"
          ? "Event Khusus (Undangan)"
          : "Event Private";
        buttonVariant = "third";
        canRegister = false;
      }
    } else if (event.mdl_kategori === "public") {
      buttonText = "Daftar Sekarang";
      buttonVariant = "primary";
      canRegister = true;
    } else {
      buttonText = "Event Khusus";
      buttonVariant = "third";
      canRegister = false;
    }
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
      if (event.mdl_tipe === "hybrid") {
        setShowHybridModal(true);
        return;
      }
      setShowConfirmModal(true);
    }
  };

  const cancelEventRegis = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("Token tidak tersedia");
        setAlert({
          type: "error",
          message: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const response = await axios.delete(
        `${API_BASE_URL}/events/${id}/batal-daftar`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
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
      if (error.response?.status === 403) {
        setAlert({
          type: "error",
          message: "Akses ditolak. Silakan login kembali.",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else if (error.response?.status === 401) {
        setAlert({
          type: "error",
          message: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else {
        setAlert({
          type: "error",
          message:
            error.response?.data?.message ||
            "Terjadi kesalahan saat membatalkan pendaftaran.",
        });
      }
    }
  };

  const confirmRegis = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setAlert({
          type: "error",
          message: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      const body = event.mdl_tipe === "hybrid"
        ? { tipe_kehadiran: attendanceType }
        : {};
      const response = await axios.post(
        `${API_BASE_URL}/events/${id}/daftar`,
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 15000,
        }
      );

      if (response.data?.success) {
        setAlert({
          type: "success",
          message: "Anda berhasil mendaftar event!",
        });
        setShowConfirmModal(false);

        if (event.mdl_link_wa) {
          setTimeout(() => {
            setAlert(null);
            setShowWAModal(true);
          }, 1500);
        } else {
          setTimeout(() => window.location.reload(), 1500);
        }
      } else {
        setAlert({
          type: "error",
          message:
            response.data?.message || "Gagal mendaftar. Silakan coba lagi.",
        });
      }
    } catch (error) {
      if (error.response?.status === 403) {
        console.error(error.response?.data);
        const errorMsg =
          error.response?.data?.message ||
          "Akses ditolak. Silakan login kembali.";
        setAlert({
          type: "error",
          message: errorMsg,
        });

        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 3000);
      } else if (error.response?.status === 401) {
        setAlert({
          type: "error",
          message: "Sesi Anda telah berakhir. Silakan login kembali.",
        });
        setTimeout(() => {
          localStorage.removeItem("token");
          navigate("/login");
        }, 2000);
      } else if (error.code === "ECONNABORTED") {
        setAlert({
          type: "error",
          message: "Koneksi timeout. Silakan coba lagi.",
        });
      } else {
        setAlert({
          type: "error",
          message:
            error.response?.data?.message ||
            "Terjadi kesalahan saat mendaftar. Silakan coba lagi.",
        });
      }
    }
  };

  const cancelRegis = () => {
    setShowConfirmModal(false);
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
              (event.media_urls && event.media_urls.length > 0 && event.media_urls.find(m => m.banner)?.banner) ||
              "https://placehold.co/1200x600?text=Event+Banner"
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
                    (event.media_urls && event.media_urls.length > 0 && event.media_urls.find(m => m.banner)?.banner) ||
                    "https://placehold.co/400x300?text=Event"
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
        <div className="grid md:grid-cols-3 gap-4 bg-white p-8 rounded-xl shadow-sm space-x-6">
          <div className="md:col-span-2">
            <Typography type="heading5" weight="semibold" className="mb-2">
              Tentang Acara
            </Typography>
            <Typography type="body" className="text-typo-secondary text-justify">
              {event.mdl_deskripsi || "Tidak ada deskripsi"}
            </Typography>
          </div>

          <div className="flex flex-col space-y-6">
            {event.is_public === 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <Typography type="caption1" weight="semibold" className="text-amber-800">
                    Event Khusus Undangan
                  </Typography>
                  <Typography type="caption2" className="text-amber-700">
                    Hanya peserta yang diundang yang dapat mendaftar
                  </Typography>
                </div>
              </div>
            )}

            <Button
              variant={buttonVariant}
              className="w-full md:w-auto"
              onClick={handleRegister}
              disabled={!canRegister}
            >
              {buttonText}
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

        {showConfirmModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-auto"
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
                <Button variant="gray_outline" onClick={cancelRegis}>
                  Batal
                </Button>
                <Button variant="primary" onClick={confirmRegis}>
                  Ya, Daftar
                </Button>
              </div>
            </div>
          </div>
        )}

        {isRegistered && event.media_urls && event.media_urls.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {event.media_urls.find(m => m.file_rundown) && (
              <a
                href={event.media_urls.find(m => m.file_rundown)?.file_rundown}
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

            {event.media_urls.find(m => m.file_acara) && (
              <a
                href={event.media_urls.find(m => m.file_acara)?.file_acara}
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

        {event.mdl_catatan && event.mdl_catatan.trim() !== "" && (
          <div className="bg-white p-8 rounded-xl shadow-sm mt-6">
            <Typography
              type="heading5"
              weight="semibold"
              className="mb-2 flex items-center gap-3"
            >
              Informasi Tambahan
            </Typography>
            <Typography type="body" className="text-typo-secondary text-justify">
              {event.mdl_catatan}
            </Typography>
          </div>
        )}

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
                  variant="gray_outline"
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

        {showWAModal && event.mdl_link_wa && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => {
              setShowWAModal(false);
              window.location.reload();
            }}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => {
                  setShowWAModal(false);
                  window.location.reload();
                }}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <MessageCircle className="w-8 h-8 text-green-600" />
                </div>
                <Typography
                  type="heading5"
                  weight="bold"
                  className="text-gray-900 mb-2"
                >
                  Pendaftaran Berhasil! 🎉
                </Typography>
                <Typography type="body" className="text-gray-600">
                  Bergabunglah dengan grup WhatsApp untuk mendapatkan informasi
                  terbaru tentang event ini.
                </Typography>
              </div>

              <Button
                variant="primary"
                className="w-full bg-green-500 hover:bg-green-600"
                onClick={() => {
                  window.open(event.mdl_link_wa, "_blank");
                  setShowWAModal(false);
                  window.location.reload();
                }}
              >
                Gabung Grup WhatsApp
              </Button>
            </div>
          </div>
        )}

        {showHybridModal && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowHybridModal(false)}
          >
            <div
              className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowHybridModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                title="Tutup"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>

              <Typography
                type="heading5"
                weight="bold"
                className="text-gray-900 mb-2"
              >
                Pilih Metode Kehadiran
              </Typography>
              <Typography type="body" className="text-gray-600 mb-6">
                Silakan pilih bagaimana Anda ingin mengikuti acara ini
              </Typography>

              <div className="space-y-3 mb-6">
                <div
                  onClick={() => setAttendanceType("online")}
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all ${
                    attendanceType === "online"
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-400/50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      attendanceType === "online" ? "border-primary bg-primary" : "border-gray-400"
                  }`}>
                    {attendanceType === "online" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-primary/10 rounded-full">
                      <Monitor className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <Typography type="body" weight="semibold">
                        Online
                      </Typography>
                      <Typography type="caption2" className="text-gray-500">
                        Ikuti acara via Zoom/Google Meet
                      </Typography>
                    </div>
                  </div>
                </div>

                <div
                  onClick={() => setAttendanceType("offline")}
                  className={`flex items-center gap-4 border rounded-xl p-4 cursor-pointer transition-all ${
                    attendanceType === "offline"
                      ? "border-green-500 bg-green-50 ring-2 ring-green-200"
                      : "border-gray-200 hover:border-green-400/50"
                  }`}
                >
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      attendanceType === "offline" ? "border-green-500 bg-green-500" : "border-gray-400"
                  }`}>
                    {attendanceType === "offline" && (
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 rounded-full">
                      <MapPin className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <Typography type="body" weight="semibold">
                        Offline
                      </Typography>
                      <Typography type="caption2" className="text-gray-500">
                        Hadiri acara secara langsung di lokasi
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="gray_outline" onClick={() => setShowHybridModal(false)}>
                  Batal
                </Button>
                <Button
                  variant="primary"
                  disabled={!attendanceType}
                  onClick={() => {
                    if (!attendanceType) return;
                    setShowHybridModal(false);
                    confirmRegis();
                  }}
                >
                  Konfirmasi Pendaftaran
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