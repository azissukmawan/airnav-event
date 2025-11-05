import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import {
  Calendar,
  MapPin,
  Facebook,
  MessageCircle,
  X,
  Copy,
} from "lucide-react";
import { Button } from "../../components/button";
import Tabs from "../../components/tabs";
import { Typography } from "../../components/typography";
import Loading from "../../components/loading";
import axios from "axios";
import Alert from "../../components/alert";
import NotFound from "../../pages/NotFound";

const EventDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [alert, setAlert] = useState(null);
  const [copied, setCopied] = useState(false);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const isAdmin = role === "admin" || role === "superadmin";
  const shareUrl = window.location.href;

  const menuItems = [
    { name: "Beranda", href: "#beranda" },
    { name: "Tentang", href: "#tentang" },
    { name: "Acara", href: "#acara" },
  ];

  // ================= FETCH EVENT =================
  useEffect(() => {
    const stored = localStorage.getItem("registeredEvents");
    if (stored) setRegisteredEvents(JSON.parse(stored));

    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${slug}`);
        const json = await res.json();
        setEvent(json.success && json.data?.event ? json.data.event : null);
      } catch (err) {
        console.error("Gagal mengambil event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

  // ================= FETCH REGISTERED EVENTS =================
  useEffect(() => {
    if (!token || isAdmin) {
      setLoadingRegistered(false); // skip fetch untuk admin
      return;
    }

    const fetchRegistered = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/me/pendaftaran`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.data?.success) {
          const serverData = Array.isArray(response.data.data)
            ? response.data.data
            : [];

          setRegisteredEvents((prev) => {
            const merged = [...prev];
            serverData.forEach((s) => {
              if (
                !merged.some(
                  (e) => Number(e.modul_acara_id) === Number(s.modul_acara_id)
                )
              ) {
                merged.push(s);
              }
            });
            return merged;
          });
        }
      } catch (err) {
        console.error(
          "Gagal fetch registered events",
          err.response?.data || err
        );
      } finally {
        setLoadingRegistered(false);
      }
    };

    fetchRegistered();
  }, [token, isAdmin]);

  if (loading || loadingRegistered) return <Loading />;
  if (!event) return <NotFound />;

  // ================= LOGIKA TOMBOL =================
  const now = new Date();
  const registrationStart = new Date(event.pendaftaran?.mulai);
  const registrationEnd = new Date(event.pendaftaran?.selesai);
  const eventStart = new Date(event.acara?.mulai);
  const eventEnd = new Date(event.acara?.selesai);

  const isRegistered = registeredEvents.some(
    (e) => Number(e.modul_acara_id) === Number(event.id)
  );

  let buttonText = "";
  let buttonVariant = "primary";
  let canRegister = false;

  if (isAdmin) {
    buttonText = "Admin Tidak Bisa Mendaftar";
    buttonVariant = "third";
    canRegister = false;
  } else if (now > eventEnd) {
    buttonText = "Acara Telah Selesai";
    buttonVariant = "third";
  } else if (isRegistered) {
    if (now < eventStart) {
      buttonText = "Batal Daftar";
      buttonVariant = "red";
      canRegister = true;
    } else if (now >= eventStart && now <= eventEnd) {
      buttonText = "Terdaftar";
      buttonVariant = "green";
      canRegister = false;
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

  // ================= HANDLE REGISTER =================
  const handleRegister = () => {
    if (isRegistered && now < eventStart) setShowCancelModal(true);
    else if (canRegister && !isRegistered) setShowConfirmModal(true);
  };

  const confirmRegis = async () => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/events/${event.id}/daftar`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const updated = [...registeredEvents, { modul_acara_id: event.id }];
        setRegisteredEvents(updated);
        localStorage.setItem("registeredEvents", JSON.stringify(updated));
        setShowConfirmModal(false);
        setAlert({ type: "success", message: "Berhasil mendaftar event." });
      }
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message;

      if (msg === "Unauthenticated.") {
        setAlert({
          type: "error",
          message: "Anda belum login. Silakan login terlebih dahulu.",
        });
        localStorage.setItem("redirectAfterLogin", `/user/event/${event.id}`);
        navigate("/login");
        return;
      }

      setAlert({ type: "error", message: msg || "Gagal mendaftar event." });
    }
  };

  const cancelEventRegis = async () => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/events/${event.id}/batal-daftar`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data?.success) {
        const updated = registeredEvents.filter(
          (e) => e.modul_acara_id !== event.id
        );
        setRegisteredEvents(updated);
        localStorage.setItem("registeredEvents", JSON.stringify(updated));
        setShowCancelModal(false);
        setAlert({ type: "info", message: "Pendaftaran dibatalkan." });
      } else {
        setAlert({
          type: "error",
          message: response.data?.message || "Gagal membatalkan pendaftaran.",
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message: "Terjadi kesalahan saat membatalkan pendaftaran.",
      });
    }
  };

  const cancelRegis = () => setShowConfirmModal(false);

  // ================= SHARE =================
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const shareToFacebook = () =>
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );

  const shareToWhatsApp = () =>
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        "Cek event keren ini! " + shareUrl
      )}`,
      "_blank"
    );

  const shareToX = () =>
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=Cek%20event%20keren%20ini!`,
      "_blank"
    );

  return (
    <div className="font-poppins text-gray-800">
      <Header menuItems={menuItems} />
      {alert && (
        <div className="fixed top-6 right-6 z-50">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* HERO */}
      <section className="relative mt-20 overflow-hidden py-10 md:py-20 bg-gray-800">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${event.banner || "/no-image.jpg"})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />
        <div className="relative max-w-6xl mx-auto md:px-0 px-6 z-10 flex items-center">
          <div className="grid md:grid-cols-2 gap-10 items-center text-white w-full">
            <div>
              <Typography type="heading3" weight="semibold">
                {event.nama}
              </Typography>
              <div className="flex items-center gap-3 mt-3 text-gray-200">
                <MapPin className="w-4 h-4" />
                <Typography type="body">
                  {event.lokasi || "Lokasi belum ditentukan"}
                </Typography>
              </div>
              <div className="flex items-center gap-3 text-gray-200 mt-1">
                <Calendar className="w-4 h-4" />
                <Typography type="body">
                  {event.acara?.mulai || "-"} – {event.acara?.selesai || "-"}
                </Typography>
              </div>
            </div>
            <div className="flex justify-center">
              <img
                src={event.banner || "/no-image.jpg"}
                alt={event.nama}
                className="rounded-2xl shadow-2xl w-full max-w-md md:max-h-[250px] sm:max-h-[180px] object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TAB & SHARE */}
      <section className="w-full px-6 md:px-12 z-10 mb-20 mt-10 flex justify-center">
        <div className="w-full max-w-6xl grid md:grid-cols-[2fr_1fr] gap-10 items-start">
          <div>
            <Tabs
              items={[
                {
                  label: "Deskripsi",
                  content: (
                    <div className="space-y-10">
                      <Typography
                        type="heading5"
                        weight="semibold"
                        className="text-gray-900 mb-3"
                      >
                        Tentang{" "}
                        <span className="text-blue-600">{event.nama}</span>
                      </Typography>
                      <Typography
                        type="paragraph"
                        className="text-gray-700 leading-relaxed whitespace-pre-line text-justify"
                      >
                        {event.deskripsi.replace(/\\n/g, "\n")}
                      </Typography>
                    </div>
                  ),
                },
                {
                  label: "Informasi",
                  content: (
                    <div className="space-y-10">
                      <Typography
                        type="heading6"
                        weight="semibold"
                        className="text-gray-900 mb-4"
                      >
                        Informasi Acara
                      </Typography>
                      <ul className="space-y-1 text-gray-700">
                        <li>
                          <strong>Alamat:</strong> {event.lokasi || "-"}
                        </li>
                        <li>
                          <strong>Tanggal Pendaftaran:</strong>{" "}
                          {event.pendaftaran?.mulai || "-"} –{" "}
                          {event.pendaftaran?.selesai || "-"}
                        </li>
                        <li>
                          <strong>Tanggal Acara:</strong>{" "}
                          {event.acara?.mulai || "-"} –{" "}
                          {event.acara?.selesai || "-"}
                        </li>
                      </ul>
                      <Typography
                        type="heading6"
                        weight="semibold"
                        className="text-gray-900 mb-4"
                      >
                        Informasi Tambahan
                      </Typography>
                      <Typography
                        type="paragraph"
                        className="text-gray-700 leading-relaxed"
                      >
                        {event.catatan || "Tidak ada catatan tambahan."}
                      </Typography>
                    </div>
                  ),
                },
              ]}
            />
          </div>

          <div className="space-y-6">
            <Button
              variant={buttonVariant}
              className="w-full md:w-auto"
              onClick={handleRegister}
              disabled={!canRegister}
            >
              {buttonText}
            </Button>

            <div className="flex flex-col items-start gap-3">
              <Typography type="body" weight="medium" className="text-gray-700">
                Bagikan Event:
              </Typography>
              <div className="flex gap-3 flex-wrap">
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
                <Typography type="caption2" className="text-green-600">
                  ✅ Tautan disalin ke clipboard
                </Typography>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Confirm Modal */}
      {showConfirmModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography type="heading5" weight="bold" className="mb-4">
              Konfirmasi Pendaftaran
            </Typography>
            <Typography type="body" className="mb-6">
              Apakah Anda yakin ingin mendaftar "{event.nama}"?
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

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowCancelModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography type="heading5" weight="bold" className="mb-4">
              Batalkan Pendaftaran
            </Typography>
            <Typography type="body" className="mb-6">
              Apakah Anda yakin ingin membatalkan pendaftaran "{event.nama}"?
            </Typography>
            <div className="flex justify-center gap-3">
              <Button variant="third" onClick={() => setShowCancelModal(false)}>
                Tidak
              </Button>
              <Button variant="red" onClick={cancelEventRegis}>
                Ya, Batalkan
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default EventDetail;
