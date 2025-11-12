import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import CardList from "../../../components/card-status/CardList";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import TableParticipants from "../../../components/admin/TableParticipants";
import ParticipantPreview from "../../../components/admin/ParticipantPreview";
import ArchiveConfirmModal from "../../../components/pop-up/ArchiveConfirmModal";
import CreateSertif from "../../../components/pop-up/CreateSertif";
import DropdownHariSesi from "../../../components/admin/Dropdown/DropdownHariSesi";
import FinishConfirmModal from "../../../components/pop-up/FinishConfirmModal";
import ChangeSesiConfirmModal from "../../../components/pop-up/ChangeSesiConfirmModal";
import { QRFullscreen } from "./fullscreen";
import { QRCodeCanvas } from "qrcode.react";
import { ChevronDown, Maximize2, Download } from "lucide-react";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

const AdminDetail = () => {
  const { id } = useParams();
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [search, setSearch] = useState("");
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOption, setSelectedOption] = useState("active");
  const [presensiAktif, setPresensiAktif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);
  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [showCreateSertif, setShowCreateSertif] = useState(false);
  const [participantsData, setParticipantsData] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [hari, setHari] = useState("");
  const [sesi, setSesi] = useState("");
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showChangeSesiConfirm, setShowChangeSesiConfirm] = useState(false);
  const [pendingSesi, setPendingSesi] = useState("");
  const [sesiPresensi, setSesiPresensi] = useState("");
  const [filterHari, setFilterHari] = useState("");
  const [filterSesi, setFilterSesi] = useState("");

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: eventData?.mdl_nama || "Informasi Acara" },
  ];

  // FIXED: Handle filter change dengan validasi
  const handleFilterChange = (filtered) => {
    setFilteredParticipants(Array.isArray(filtered) ? filtered : []);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (eventData?.mdl_sesi_acara) {
      setSesiPresensi(eventData.mdl_sesi_acara.toString());
    }
  }, [eventData]);

  const handleSesiPresensiChange = (e) => {
    const newSesi = e.target.value;
    setSesiPresensi(newSesi);
    handleChangeSesiClick(newSesi);
  };

  const handleChangeSesiClick = (newSesi) => {
    if (!newSesi || newSesi === sesiPresensi) return;
    setPendingSesi(newSesi);
    setShowChangeSesiConfirm(true);
  };

  const handleConfirmChangeSesi = async () => {
    if (!pendingSesi) return;

    try {
      const sesiNumber = parseInt(pendingSesi);

      await axios.put(
        `${API_BASE_URL}/admin/event/${id}/sesi/toggle`,
        { mdl_sesi_acara: sesiNumber },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setSesiPresensi(pendingSesi);
      setEventData((prev) => ({
        ...prev,
        mdl_sesi_acara: sesiNumber,
      }));

      setShowChangeSesiConfirm(false);
      setPendingSesi("");
      showPopup(
        "success",
        "Berhasil",
        `Anda berhasil mengubah ke Sesi ${sesiNumber}. Peserta yang scan QR presensi akan masuk ke sesi tersebut.`
      );
    } catch (error) {
      console.error("Gagal mengubah sesi:", error);
      setShowChangeSesiConfirm(false);
      setPendingSesi("");
      showPopup("error", "Gagal", "Tidak dapat mengubah sesi acara");
    }
  };

  // FIXED: Fetch participants dengan error handling yang lebih baik
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/attendance`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("RESPON PESERTA DARI BE:", res.data);

        // FIXED: Handle berbagai kemungkinan struktur response
        let data = {};
        if (res.data?.data?.data) {
          data = res.data.data.data;
        } else if (res.data?.data) {
          data = res.data.data;
        } else if (res.data) {
          data = res.data;
        }

        setParticipantsData(data);

        // FIXED: Validasi data sebelum menggunakan Object.keys
        if (data && typeof data === 'object' && Object.keys(data).length > 0) {
          const firstHari = Object.keys(data)[0];
          if (firstHari && data[firstHari] && typeof data[firstHari] === 'object') {
            const firstSesi = Object.keys(data[firstHari])[0];
            if (firstSesi) {
              setFilterHari(firstHari);
              setFilterSesi(firstSesi);
              setFilteredParticipants(Array.isArray(data[firstHari][firstSesi]) ? data[firstHari][firstSesi] : []);
            }
          }
        } else {
          setFilteredParticipants([]);
        }
      } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
        setFilteredParticipants([]);
        setError("Gagal mengambil data peserta");
      } finally {
        setLoading(false);
      }
    };

    if (id && token) {
      fetchParticipants();
    }
  }, [id, token]);

  const handleFinishEvent = async () => {
    setIsFinishing(true);
    try {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

      const response = await axios.put(
        `${API_BASE_URL}/admin/events/${id}`,
        {
          mdl_status: "closed",
          mdl_acara_selesai: formattedDateTime,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showPopup("success", "Berhasil", "Acara telah diselesaikan.");

      setEventData((prev) => ({
        ...prev,
        mdl_status: "closed",
        mdl_acara_selesai: formattedDateTime,
        mdl_presensi_aktif: 0,
      }));
      setPresensiAktif(false);
      setShowFinishConfirm(false);
    } catch (error) {
      console.error("Gagal menyelesaikan acara:", error);
      const errorMessage =
        error.response?.data?.message || "Tidak dapat menyelesaikan acara.";
      showPopup("error", "Gagal", errorMessage);
    } finally {
      setIsFinishing(false);
    }
  };

  // Archive Event
  const handleArchiveEvent = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/events/${id}/archive`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showPopup("success", "Berhasil", "Acara berhasil diarsipkan");
      setEventData((prev) => ({
        ...prev,
        mdl_status: "archived",
      }));
      setShowArchiveConfirm(false);
    } catch (error) {
      console.error("Gagal mengarsipkan acara:", error);
      showPopup("error", "Gagal", "Tidak dapat mengarsipkan acara");
    }
  };

  // Notification popup
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const showPopup = (type, title, message) => {
    setNotificationConfig({ type, title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const NotificationPopup = () => {
    if (!showNotification) return null;

    const styles = {
      success: {
        bg: "bg-green-50 border-green-500",
        text: "text-green-800",
        icon: "text-green-600",
      },
      error: {
        bg: "bg-red-50 border-red-500",
        text: "text-red-800",
        icon: "text-red-600",
      },
      warning: {
        bg: "bg-yellow-50 border-yellow-500",
        text: "text-yellow-800",
        icon: "text-yellow-600",
      },
    };

    const style = styles[notificationConfig.type];

    return (
      <div className="fixed top-4 right-4 z-[9999] animate-slide-in">
        <div className={`${style.bg} border-l-4 rounded-lg shadow-lg p-4 w-80`}>
          <div className="flex items-start gap-3">
            <div className={style.icon}>
              {notificationConfig.type === "success" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notificationConfig.type === "error" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
              {notificationConfig.type === "warning" && (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${style.text}`}>
                {notificationConfig.title}
              </h3>
              <p className={`text-sm mt-1 ${style.text}`}>
                {notificationConfig.message}
              </p>
            </div>
            <button
              onClick={() => setShowNotification(false)}
              className={`${style.text} hover:opacity-70`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  const handleGenerateSertif = (data) => {
    console.log("Data sertifikat dikirim:", data);
    showPopup("success", "Berhasil", "Sertifikat berhasil digenerate");
    setShowCreateSertif(false);
  };

  // Fetch event data
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = response.data.data;
        setEventData(data);
        setPresensiAktif(data.mdl_presensi_aktif === 1);
        setSelectedOption(data.mdl_status || "active");
      } catch (err) {
        console.error("Gagal mengambil data acara:", err);
        setError("Gagal mengambil data acara");
      } finally {
        setLoadingEvent(false);
      }
    };

    if (id && token) {
      fetchEventData();
    }
  }, [id, token]);

  // Toggle presensi
  const handleTogglePresensi = async () => {
    if (!id) return alert("ID acara tidak ditemukan");

    try {
      const newStatus = !presensiAktif;

      await axios.put(
        `${API_BASE_URL}/admin/event/${id}/presensi/toggle`,
        { status_qr: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setPresensiAktif(newStatus);
      const res = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const updatedEvent = res.data.data;
      setEventData(updatedEvent);
      setPresensiAktif(updatedEvent.mdl_presensi_aktif === 1);

      showPopup(
        "success",
        "Berhasil",
        `Presensi ${newStatus ? "diaktifkan" : "dinonaktifkan"}`
      );
    } catch (error) {
      console.error(error);
      showPopup("error", "Gagal", "Tidak dapat mengubah status presensi");
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      showPopup("warning", "Peringatan", "QR Code belum tersedia");
      return;
    }

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR-${eventData?.mdl_kode_qr || "event"}.png`;
    link.click();

    showPopup("success", "Berhasil", "QR Code berhasil diunduh");
  };

  const getEventStatus = (startDate, endDate) => {
    if (!startDate) return { label: "-", color: "bg-gray-100 text-gray-700" };

    const today = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (today < start) {
      return { label: "Segera Hadir", color: "bg-yellow-100 text-yellow-700" };
    } else if (today >= start && today <= end) {
      return { label: "Berlangsung", color: "bg-green-100 text-green-700" };
    } else {
      return { label: "Selesai", color: "bg-red-100 text-red-700" };
    }
  };

  // Fetch winners dengan error handling
  useEffect(() => {
    const fetchWinners = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/winners`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        // FIXED: Pastikan winners selalu array
        const winnersData = res.data?.data?.winners || [];
        setWinners(Array.isArray(winnersData) ? winnersData : []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("Belum ada data pemenang untuk event ini");
          setWinners([]);
        } else {
          console.error("Gagal mengambil data pemenang:", err);
          setWinners([]);
        }
      }
    };
    
    if (id && token) {
      fetchWinners();
    }
  }, [id, token]);

  // FIXED: Sorted participants dengan validasi winners
  const sortedParticipants = useMemo(() => {
    if (!Array.isArray(filteredParticipants)) return [];
    
    return [...filteredParticipants].sort((a, b) => {
      if (eventData?.doorprize_active !== 1) return 0;

      const aWinner = Array.isArray(winners) && winners.some(
        (w) => w.name?.trim().toLowerCase() === a.nama?.trim().toLowerCase()
      );
      const bWinner = Array.isArray(winners) && winners.some(
        (w) => w.name?.trim().toLowerCase() === b.nama?.trim().toLowerCase()
      );
      
      return (bWinner ? 1 : 0) - (aWinner ? 1 : 0);
    });
  }, [filteredParticipants, winners, eventData]);

  const totalPages = Math.ceil(sortedParticipants.length / rowsPerPage);

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleOpenPreview = (participant) => {
    setSelectedParticipant(participant);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedParticipant(null);
  };

  return (
    <>
      <NotificationPopup />

      <div className="flex-1 w-full lg:pl-52 pt-6 lg:pt-0">
        <Sidebar role="admin" />
        <div className="flex-1 p-6 mt-2 space-y-4">
          <Breadcrumb items={breadcrumbItems} />

          <div className="flex flex-col mt-5">
            <h1 className="text-4xl font-bold text-blue-900">
              Informasi Acara
            </h1>
            <p className="text-gray-500 mt-2">
              Menampilkan halaman peserta dari acara{" "}
              <span className="font-semibold italic">
                {loadingEvent
                  ? "Loading..."
                  : eventData?.mdl_nama || "Unknown Event"}
              </span>
            </p>
          </div>

          <div className="flex flex-row md:flex-col md:space-x-4 space-y-2 md:space-y-0 mb-10 w-full">
            <div className="flex-1 w-full">
              <Search
                placeholder="Cari nama peserta..."
                onSearch={handleSearchChange}
              />
            </div>
            {eventData?.mdl_doorprize_aktif === 1 && (
              <Link
                to={`/admin/event/doorprize/${id}`}
                className="px-7 py-2 rounded-xl font-semibold bg-primary text-blue-50 hover:bg-primary-90 hover:text-white transition-colors"
              >
                Doorprize
              </Link>
            )}
          </div>

          {/* Card Info Acara */}
          <div className="flex flex-col lg:flex-row gap-6 w-full mb-5">
            {loadingEvent ? (
              <div className="p-6 rounded-xl shadow-sm w-full max-w-full md:max-w-md lg:max-w-lg">
                <p className="text-gray-500">Loading event info...</p>
              </div>
            ) : eventData ? (
              <div className="p-5 flex flex-column bg-white rounded-xl shadow-sm">
                {/* Kiri - Info Event */}
                <div className="p-5 md:max-w-lg lg:max-w-xl">
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    {eventData.mdl_nama}
                  </h2>
                  <div className="text-sm text-gray-600 space-y-3 mt-3">
                    <p>
                      <span className="font-medium">Kategori:</span>{" "}
                      {eventData.mdl_kategori || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Lokasi:</span>{" "}
                      {eventData.mdl_lokasi || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {eventData.mdl_acara_mulai
                        ? new Date(eventData.mdl_acara_mulai).toLocaleDateString("id-ID")
                        : "-"}
                    </p>
                    <p>
                      <span className="font-medium">Tipe:</span>{" "}
                      {eventData.mdl_tipe || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      {(() => {
                        const status = getEventStatus(
                          eventData.mdl_acara_mulai,
                          eventData.mdl_acara_selesai
                        );
                        return (
                          <span
                            className={`px-3 py-1 rounded text-xs font-semibold ${status.color}`}
                          >
                            {status.label}
                          </span>
                        );
                      })()}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 mt-5">
                    <Link to={`/admin/event/detail/${id}`}>
                      <button className="w-45 px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-90 transition">
                        Lihat Detail Lengkap
                      </button>
                    </Link>
                    <button
                      onClick={() => setShowFinishConfirm(true)}
                      className="w-40 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                    >
                      Selesaikan Acara
                    </button>
                    <button
                      onClick={() => setShowArchiveConfirm(true)}
                      className="w-35 px-1 py-2 rounded-xl bg-gray-500 text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Arsipkan Acara
                    </button>
                  </div>
                </div>
                
                {/* Garis Pembatas */}
                <div className="hidden lg:flex items-center justify-center px-6">
                  <div className="ml-10 w-[2px] h-[80%] bg-gray-300 rounded-full"></div>
                </div>

                {/* Kanan - QR & Presensi */}
                <div className="ml-25">
                  <div className="flex-1">
                    <div className="space-y-5">
                      <div className="flex flex-wrap gap-5 items-start">
                        {/* QR Code */}
                        <div className="flex flex-col items-center gap-2">
                          <div className="relative bg-white border-2 border-gray-200 rounded-lg p-2">
                            {eventData.mdl_kode_qr ? (
                              <QRCodeCanvas
                                value={eventData.mdl_kode_qr}
                                size={120}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                                includeMargin={true}
                              />
                            ) : (
                              <div className="w-[120px] h-[120px] bg-gray-100 rounded flex items-center justify-center">
                                <p className="text-gray-400 text-xs text-center px-2">
                                  QR tidak tersedia
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowFullscreen(true)}
                              disabled={!eventData.mdl_kode_qr}
                              className="group relative p-2 rounded-lg bg-primary-10 hover:bg-primary-20 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                              title="Fullscreen"
                            >
                              <Maximize2 size={16} />
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Fullscreen
                              </span>
                            </button>

                            <button
                              onClick={handleDownloadQR}
                              disabled={!eventData.mdl_kode_qr}
                              className="group relative p-2 rounded-lg bg-primary-10 hover:bg-primary-20 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                              title="Download"
                            >
                              <Download size={16} />
                              <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                                Download QR
                              </span>
                            </button>
                          </div>
                        </div>

                        {/* Presensi & Sesi Controls */}
                        <div className="flex-1 min-w-[180px] space-y-4">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Presensi Acara
                            </label>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={handleTogglePresensi}
                                className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors duration-300 ${
                                  presensiAktif ? "bg-primary" : "bg-gray-300"
                                }`}
                              >
                                <span
                                  className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ${
                                    presensiAktif
                                      ? "translate-x-8"
                                      : "translate-x-1"
                                  }`}
                                />
                              </button>
                              <span
                                className={`text-xs font-bold ${
                                  presensiAktif
                                    ? "text-primary"
                                    : "text-gray-400"
                                }`}
                              >
                                {presensiAktif ? "ON" : "OFF"}
                              </span>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Pilih Sesi
                            </label>
                            <div className="relative">
                              <select
                                value={sesiPresensi}
                                onChange={handleSesiPresensiChange}
                                className="w-full border-2 border-primary rounded-lg px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 appearance-none bg-white text-gray-700"
                              >
                                <option value="">Pilih Sesi</option>
                                {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                                  <option key={num} value={num.toString()}>
                                    Sesi {num}
                                  </option>
                                ))}
                              </select>
                              <ChevronDown
                                size={18}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-primary pointer-events-none"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3">
                        <button
                          onClick={() => setShowCreateSertif(true)}
                          className="w-full px-5 py-2 rounded-lg bg-primary text-white text-sm font-semibold hover:bg-primary-80 transition-colors shadow-sm"
                        >
                          Generate Sertifikat
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {showFullscreen && (
                  <QRFullscreen
                    qrValue={eventData.mdl_kode_qr}
                    eventTitle={eventData.mdl_nama}
                    sesi={sesi}
                    onClose={() => setShowFullscreen(false)}
                  />
                )}
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-10 w-full">
                <p className="text-red-500">Failed to load event data</p>
              </div>
            )}
          </div>

          {/* Load Data */}
          {loading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Memuat data peserta...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-red-500">Error: {error}</p>
            </div>
          ) : (
            <>
              <CardList
                eventId={id}
                participants={participants}
                doorprizeActive={eventData?.mdl_doorprize_aktif === 1}
                eventType={eventData?.mdl_tipe}
              />
              <DropdownHariSesi
                participants={participantsData}
                onFilter={handleFilterChange}
              />
              <div className="overflow-x-auto">
                <TableParticipants
                  participants={filteredParticipants}
                  winners={winners}
                  onPreview={handleOpenPreview}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sortedParticipants.length}
                  rowsPerPage={rowsPerPage}
                  onPageChange={setCurrentPage}
                  onRowsPerPageChange={handleRowsPerPageChange}
                  doorprizeActive={eventData?.mdl_doorprize_aktif === 1}
                  eventType={eventData?.mdl_tipe} // FIXED: gunakan eventData bukan event
                />
              </div>
            </>
          )}
        </div>

        {/* Popup Modals */}
        {openPreview && selectedParticipant && (
          <ParticipantPreview
            isOpen={openPreview}
            onClose={handleClosePreview}
            data={selectedParticipant}
          />
        )}
        <CreateSertif
          isOpen={showCreateSertif}
          onClose={() => setShowCreateSertif(false)}
          onGenerate={handleGenerateSertif}
        />
        <ArchiveConfirmModal
          isOpen={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
          onConfirm={handleArchiveEvent}
        />
        <FinishConfirmModal
          isOpen={showFinishConfirm}
          onClose={() => setShowFinishConfirm(false)}
          onConfirm={handleFinishEvent}
          isLoading={isFinishing}
        />
        <ChangeSesiConfirmModal
          isOpen={showChangeSesiConfirm}
          onClose={() => {
            setShowChangeSesiConfirm(false);
            setPendingSesi("");
            setSesiPresensi(
              eventData?.mdl_sesi_acara
                ? eventData.mdl_sesi_acara.toString()
                : ""
            );
          }}
          onConfirm={handleConfirmChangeSesi}
          sesiNumber={pendingSesi}
        />
      </div>
    </>
  );
};

export default AdminDetail;
