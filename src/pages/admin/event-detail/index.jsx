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

import { QRCodeCanvas } from "qrcode.react";
import { Typography } from "../../../components/typography";
import { ChevronDown } from "lucide-react";

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
  const [rowsPerPage, setRowsPerPage] = useState(participants.length || 5);
  const [showCreateSertif, setShowCreateSertif] = useState(false);
  const [participantsData, setParticipantsData] = useState({});
  const [filteredParticipants, setFilteredParticipants] = useState([]);
  const [hari, setHari] = useState("");
  const [sesi, setSesi] = useState("");
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [isFinishing, setIsFinishing] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: eventData?.mdl_nama || "Informasi Acara" },
  ];
  console.log("participants:", participants);

  // ARSIP ACARA
  const handleArchiveEvent = async () => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/admin/events/${id}/archive`, // BE
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      showPopup("success", "Berhasil", "Acara berhasil diarsipkan");

      // Update status eventData agar tidak perlu reload manual
      setEventData((prev) => ({
        ...prev,
        mdl_status: "archived",
      }));

      // Tutup popup konfirmasi
      setShowArchiveConfirm(false);
    } catch (error) {
      console.error("Gagal mengarsipkan acara:", error);
      showPopup("error", "Gagal", "Tidak dapat mengarsipkan acara");
    }
  };

  // Notifikasi pop-up
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

  // === NOTIFICATION POPUP COMPONENT ===
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
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {notificationConfig.type === "error" && (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
              {notificationConfig.type === "warning" && (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // === POPUP SERTIF ===
  const handleGenerateSertif = (data) => {
    console.log("Data sertifikat dikirim:", data);
    showPopup("success", "Berhasil", "Sertifikat berhasil digenerate");
    setShowCreateSertif(false);
  };

  // === FUNGSI UNTUK MENAMPILKAN POPUP PRESENSI ===
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

    fetchEventData();
  }, [id, token]);

  // === ON/OFF PRESENSI ===
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
      //refatch
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

  useEffect(() => {
    if (participants.length > 0) {
      setRowsPerPage(participants.length);
    }
  }, [participants]);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) {
        setLoadingEvent(false);
        return;
      }
      try {
        setLoadingEvent(true);
        const res = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const eventDetail =
          res.data?.data?.data || res.data?.data || res.data || null;
        setEventData(eventDetail);
      } catch (err) {
        console.error("Gagal mengambil detail event:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoadingEvent(false);
      }
    };
    fetchEventDetail();
  }, [id, token]);

  // === NUNGGU BE ===
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/participants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("RESPON PESERTA DARI BE:", res.data); // 👈 tambahin ini

        const data = res.data?.data?.data || res.data?.data || res.data || {};

        console.log("HASIL DATA YANG DISIMPAN:", data); // 👈 dan ini

        setParticipantsData(data);

        const firstHari = Object.keys(data)[0];
        if (firstHari) {
          const firstSesi = Object.keys(data[firstHari])[0];
          if (firstSesi) {
            setHari(firstHari);
            setSesi(firstSesi);
            setFilteredParticipants(data[firstHari][firstSesi] || []);
          }
        }
      } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     try {
  //       const token = localStorage.getItem("token");
  //       const res = await axios.get(
  //         `${API_BASE_URL}/admin/events/${id}/participants`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );

  //       // ✅ Data dari BE langsung diambil dari res.data.data
  //       console.log("RESPON PESERTA DARI BE:", res.data);
  //       const data = res.data?.data?.data || res.data?.data || res.data || {};

  //       console.log("HASIL DATA YANG DISIMPAN:", data);
  //       // const data = res.data?.data || {};

  //       // Simpan ke state
  //       setParticipantsData(data);

  //       // (Opsional) log untuk cek strukturnya
  //       console.log("Participants data:", data);
  //     } catch (error) {
  //       console.error("Error fetching participants:", error);
  //       setParticipantsData({});
  //     }
  //   };

  //   fetchParticipants();
  // }, [id]);

  const handleFilter = (hari, sesi) => {
    if (hari && sesi && participantsData[hari]?.[sesi]) {
      setFilteredParticipants(participantsData[hari][sesi]);
    } else {
      setFilteredParticipants([]);
    }
  };

  // useEffect(() => {
  //   const fetchParticipants = async () => {
  //     if (!id) {
  //       setLoading(false);
  //       return;
  //     }
  //     try {
  //       setLoading(true);
  //       const res = await axios.get(
  //         `${API_BASE_URL}/admin/events/${id}/participants`,
  //         { headers: { Authorization: `Bearer ${token}` } }
  //       );
  //       const participantsData =
  //         res.data?.data?.data || res.data?.data || res.data || [];
  //       setParticipants(participantsData);
  //     } catch (err) {
  //       console.error("Gagal mengambil data peserta:", err);
  //       setError(err.response?.data?.message || err.message);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchParticipants();
  // }, [id, token]);

  useEffect(() => {
    const fetchWinners = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/winners`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const winnersData = res.data?.data?.winners || [];
        setWinners(Array.isArray(winnersData) ? winnersData : []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("Belum ada data pemenang untuk event ini");
          setWinners([]);
        } else {
          console.error("Gagal mengambil data pemenang:", err);
        }
      }
    };
    fetchWinners();
  }, [id, token]);

  // === SEARCH FILTER ===
  // const filteredParticipants = useMemo(() => {
  //   if (!Array.isArray(participants)) return [];
  //   return participants.filter((p) =>
  //     p.nama?.toLowerCase().includes(search.toLowerCase())
  //   );
  // }, [participants, search]);

  const sortedParticipants = useMemo(() => {
    return [...filteredParticipants].sort((a, b) => {
      if (eventData?.doorprize_active !== 1) return 0;
      const aWinner = winners.some(
        (w) => w.name?.trim().toLowerCase() === a.nama?.trim().toLowerCase()
      );
      const bWinner = winners.some(
        (w) => w.name?.trim().toLowerCase() === b.nama?.trim().toLowerCase()
      );
      return bWinner - aWinner;
    });
  }, [filteredParticipants, winners, eventData]);

  // const currentTableData = useMemo(() => {
  //   const firstIndex = (currentPage - 1) * rowsPerPage;
  //   const lastIndex = firstIndex + rowsPerPage;
  //   return sortedParticipants.slice(firstIndex, lastIndex);
  // }, [currentPage, sortedParticipants, rowsPerPage]);

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

  // === GENERATE SERTIF ===
  // const EventDetail = () => {
  //   const [showCreateSertif, setShowCreateSertif] = useState(false);

  //   const handleGenerateSertif = (data) => {
  //     console.log("Data sertif dikirim:", data);
  //     // TODO: kirim ke API
  //   };
  // };
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

          {/* === CARD INFO ACARA === */}
          <div className="flex flex-col lg:flex-row gap-6 w-full mb-5">
            {loadingEvent ? (
              <div className="p-6 rounded-xl shadow-sm w-full max-w-full md:max-w-md lg:max-w-lg">
                <p className="text-gray-500">Loading event info...</p>
              </div>
            ) : eventData ? (
              // card data
              <div className="p-5 flex flex-column bg-white rounded-xl shadow-sm ">
                {/* KIRI */}
                <div className=" p-5  md:max-w-lg lg:max-w-xl">
                  <h2 className="text-xl font-semibold text-blue-900 mb-2">
                    {eventData.mdl_nama}
                  </h2>
                  <div className="text-sm text-gray-600 space-y-3 mt-3">
                    <p>
                      <span className="font-medium ">Kategori:</span>{" "}
                      {eventData.mdl_kategori || "-"}
                    </p>
                    <p>
                      <span className="font-medium ">Lokasi:</span>{" "}
                      {eventData.mdl_lokasi || "-"}
                    </p>
                    <p>
                      <span className="font-medium">Tanggal:</span>{" "}
                      {eventData.mdl_acara_mulai
                        ? new Date(
                            eventData.mdl_acara_mulai
                          ).toLocaleDateString("id-ID")
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
                  {/* ==== BUTTON ==== */}
                  {/* DETAIL BUTTON */}
                  <div className="flex items-center gap-3 mt-5">
                    <Link to={`/admin/event/detail/${id}`} className="">
                      <button className="w-45  px-4 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-90 transition">
                        Lihat Detail Lengkap
                      </button>
                    </Link>

                    {/* SELESAIKAN BUTTON */}
                    <button
                      onClick={() => setShowFinishConfirm(true)}
                      className=" w-40 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                    >
                      Selesaikan Acara
                    </button>

                    {/* ARSIP BUTTON */}
                    <button
                      onClick={() => setShowArchiveConfirm(true)}
                      className="w-35 px-1 py-2 rounded-xl bg-gray-500 text-white text-sm font-medium hover:bg-gray-800 transition"
                    >
                      Arsipkan Acara
                    </button>
                  </div>
                </div>
                {/* === GARIS PEMBATAS === */}
                <div className="hidden lg:flex items-center justify-center px-6">
                  <div className=" ml-10 w-[2px] h-[80%] bg-gray-300 rounded-full"></div>
                </div>

                {/* === QR + PRESENSI === */}
                <div className=" ml-25">
                  {/* KANAN */}
                  <div className="flex-1">
                    {!loadingEvent && eventData && (
                      // <div className="flex flex-wrap gap-3 outline outline-2 outline-offset-2 outline-gray-200 w-fit rounded-2xl p-7 ml-50">
                      <div className="flex flex-wrap gap-3 w-fit rounded-2xl ">
                        <div className="flex flex-col items-center">
                          <div className="flex flex-col rounded-xl items-center">
                            {eventData.mdl_kode_qr ? (
                              <QRCodeCanvas
                                value={eventData.mdl_kode_qr}
                                size={130}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                                includeMargin={true}
                              />
                            ) : (
                              <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg flex items-center justify-center">
                                <p className="text-gray-500 text-sm">
                                  QR belum tersedia
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="text-center">
                            <Typography
                              type="body"
                              className="text-gray-600 mb-2"
                            ></Typography>
                            <button
                              onClick={handleDownloadQR}
                              disabled={!eventData.mdl_kode_qr}
                              className="outline outline-2 outline-offset-2 outline-primary text-primary px-3 py-1 text-xs rounded-lg hover:bg-primary-80 hover:text-primary-0 disabled:bg-gray-400"
                            >
                              Download QR
                            </button>
                          </div>
                        </div>

                        <div className="p-3 ml-5">
                          <Typography
                            type="caption1"
                            weight="semibold"
                            className="mb-4"
                          >
                            Presensi Acara
                          </Typography>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={handleTogglePresensi}
                              className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                                presensiAktif ? "bg-primary" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                                  presensiAktif
                                    ? "translate-x-9"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                            <span className="text-sm font-medium text-gray-700">
                              {presensiAktif ? "ON" : "OFF"}
                            </span>
                          </div>

                          {/* === PILIH SESI === */}
                          <div className="flex-1 flex flex-col mb-3 relative w-30">
                            <label className="font-semibold text-gray-700 mb-1"></label>

                            <select
                              value={hari}
                              onChange={(e) =>
                                handleFilter(hari, e.target.value)
                              }
                              // disabled={!hari}
                              className=" mt-2 border border-blue-900 rounded-xl p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                            >
                              <option value="">Pilih Sesi</option>
                              {Array.from({ length: 10 }, (_, i) => i + 1).map(
                                (num) => (
                                  <option key={num} value={`Hari-${num}`}>
                                    Sesi {num}
                                  </option>
                                )
                              )}
                            </select>

                            <ChevronDown
                              size={18}
                              className="absolute right-3 top-[25px] text-gray-500 pointer-events-none"
                            />
                          </div>

                          {/* {Object.keys(participantsData).map((hariKey) => (
                          <option key={hariKey} value={hariKey}>
                            {hariKey.replace("-", " ")}
                          </option>
                        ))} */}
                        </div>
                      </div>
                    )}
                    {/* === SERTIFIKAT === */}
                    <button
                      onClick={() => setShowCreateSertif(true)}
                      className="mt-8 ml-7 px-15 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-80"
                    >
                      Generate Sertifikat
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-10 w-full">
                <p className="text-red-500">Failed to load event data</p>
              </div>
            )}
          </div>

          {/* ===== LOAD DATA ===== */}
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
                onFilter={handleFilter}
              />
              <div className="overflow-x-auto">
                <TableParticipants
                  // participants={currentTableData}
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
                  eventType={event.type}
                />
              </div>
            </>
          )}
        </div>

        {/* ===== POPUP MODAL ===== */}
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
          onConfirm={async () => {
            setIsFinishing(true);
            try {
              await axios.post(
                `${API_BASE_URL}/admin/events/${id}/finish`,
                {},
                {
                  headers: { Authorization: `Bearer ${token}` },
                }
              );
              toast.success("Acara berhasil diselesaikan!");
              setShowFinishConfirm(false);
            } catch (err) {
              console.error("Gagal menyelesaikan acara:", err);
              toast.error("Gagal menyelesaikan acara.");
            } finally {
              setIsFinishing(false);
            }
          }}
          isLoading={isFinishing}
        />

        {/* <ArchiveConfirmModal
          isOpen={showArchiveConfirm}
          onClose={() => setShowArchiveConfirm(false)}
          onConfirm={() => {
            console.log("Acara diarsipkan!");
          }}
        /> */}
      </div>
    </>
  );
};

export default AdminDetail;
