import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import Breadcrumb from "../../../components/breadcrumb";
import axios from "axios";
import {
  Pencil,
  MapPin,
  FilePlus,
} from "lucide-react";

const InfoAcara = () => {
  const { id } = useParams();
  const navigate = useParams();
  const [formData, setFormData] = useState({
    mdl_nama: "",
    mdl_deskripsi: "",
    mdl_catatan: "",
    mdl_status: "",
    mdl_lokasi: "",
    mdl_kategori: "",
    mdl_kode_qr: "",
    mdl_tipe: "",
    mdl_file_acara: "",
    mdl_file_rundown: "",
    mdl_template_sertifikat: "",
    mdl_banner_acara: "",
    mdl_pendaftaran_mulai: "",
    mdl_pendaftaran_selesai: "",
    mdl_acara_mulai: "",
    mdl_acara_selesai: "",
    mdl_doorprize_aktif: "",
  });

  const [fileNames, setFileNames] = useState({
    mdl_file_acara: "",
    mdl_file_rundown: "",
    mdl_template_sertifikat: "",
  });

  const [presensiAktif, setPresensiAktif] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  // Show notification popup
  const showPopup = (type, title, message) => {
    setNotificationConfig({ type, title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  // Modal Konfirmasi Publish
  const ConfirmPublishModal = () => {
    if (!showConfirmModal) return null;

    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center">
        {/* backdrop blur */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
          onClick={() => setShowConfirmModal(false)}
        />

        {/* Modal Content */}
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden relative z-10">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
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
              Konfirmasi Publish Acara
            </h3>
          </div>

          {/* Content */}
          <div className="px-6 py-6">
            <p className="text-gray-700 mb-4">
              Apakah Anda yakin ingin{" "}
              <span className="font-semibold text-blue-900">
                mempublikasikan
              </span>{" "}
              acara ini?
            </p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
              <div className="flex items-start gap-3">
                <svg
                  className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5"
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
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    Perhatian!
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Setelah acara dipublikasikan, Anda{" "}
                    <span className="font-semibold">tidak dapat mengedit</span>{" "}
                    kembali. Pastikan semua informasi sudah benar.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="bg-gray-50 px-6 py-4 flex justify-end gap-3">
            <button
              onClick={() => handleSave("draft")}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Menyimpan..." : "Simpan Draft"}
            </button>
            <button
              onClick={() => {
                setShowConfirmModal(false);
                handleSave("active");
              }}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl font-semibold bg-blue-900 text-white hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {isLoading ? "Mempublikasi..." : "Ya, Publish Sekarang"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Notification Component
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

  const getFileNameFromUrl = (url) => {
    if (!url) return null;
    try {
      const parts = url.split("/");
      const lastPart = parts[parts.length - 1];
      return decodeURIComponent(lastPart);
    } catch (err) {
      return null;
    }
  };

  const convertToDatetimeLocal = (datetime) => {
    if (!datetime) return "";
    return datetime.slice(0, 16).replace(" ", "T");
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        showPopup("error", "Error", "ID acara tidak ditemukan");
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          timeout: 15000,
        });

        const data = response.data.data;

        // if (data.mdl_status === "active") {
        //   showPopup(
        //     "warning",
        //     "Akses Ditolak",
        //     "Acara ini sudah dipublikasikan dan tidak bisa diedit."
        //   );

        //   // Redirect ke halaman daftar acara
        //   setTimeout(() => {
        //     window.location.href = "/admin/events";
        //   }, 1500);
        //   // hentikan eksekusi lebih lanjut
        // }

        setFormData({
          mdl_nama: data.mdl_nama || "",
          mdl_deskripsi: data.mdl_deskripsi || "",
          mdl_catatan: data.mdl_catatan || "",
          mdl_status: data.mdl_status || "",
          mdl_lokasi: data.mdl_lokasi || "",
          mdl_kategori: data.mdl_kategori || "",
          mdl_kode_qr: data.mdl_kode_qr || "",
          mdl_tipe: data.mdl_tipe || "",
          mdl_banner_acara: data.mdl_banner_acara_url || "",
          mdl_template_sertifikat: data.mdl_template_sertifikat_url || "",
          mdl_file_acara: data.mdl_file_acara_url || "",
          mdl_file_rundown: data.mdl_file_rundown_url || "",
          mdl_pendaftaran_mulai: convertToDatetimeLocal(
            data.mdl_pendaftaran_mulai
          ),
          mdl_pendaftaran_selesai: convertToDatetimeLocal(
            data.mdl_pendaftaran_selesai
          ),
          mdl_acara_mulai: convertToDatetimeLocal(data.mdl_acara_mulai),
          mdl_acara_selesai: convertToDatetimeLocal(data.mdl_acara_selesai),
          mdl_doorprize_aktif:
            data.mdl_doorprize_aktif !== null &&
            data.mdl_doorprize_aktif !== undefined
              ? Number(data.mdl_doorprize_aktif)
              : "",
        });

        setFileNames({
          mdl_file_acara: getFileNameFromUrl(data.mdl_file_acara_url) || "",
          mdl_file_rundown: getFileNameFromUrl(data.mdl_file_rundown_url) || "",
          mdl_template_sertifikat:
            getFileNameFromUrl(data.mdl_template_sertifikat_url) || "",
        });

        setPresensiAktif(data.mdl_presensi_aktif === 1);
      } catch (error) {
        console.error(error);

        if (error.code === "ECONNABORTED") {
          showPopup(
            "error",
            "Timeout",
            "Koneksi timeout. Coba refresh halaman."
          );
        } else {
          const errorMsg =
            error.response?.data?.message || "Gagal memuat data acara";
          showPopup("error", "Error", errorMsg);
        }
      }
    };

    fetchEvent();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;

    if (name === "mdl_doorprize_aktif") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
      return;
    }

    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setFileNames((prev) => ({ ...prev, [name]: files[0].name }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglePresensi = async () => {
    if (!id) {
      showPopup("error", "Error", "ID acara tidak ditemukan");
      return;
    }

    try {
      const newStatus = !presensiAktif;

      const response = await axios.put(
        `${API_BASE_URL}/admin/event/${id}/presensi/toggle`,
        { status_qr: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      if (response.data && response.data.data) {
        setPresensiAktif(response.data.data.mdl_presensi_aktif === 1);
      } else {
        setPresensiAktif(newStatus);
      }

      showPopup(
        "success",
        "Berhasil",
        `Presensi berhasil di${newStatus ? "aktifkan" : "nonaktifkan"}!`
      );
    } catch (error) {
      console.error(error.response?.data || error.message);
      const errorMsg =
        error.response?.data?.message || "Gagal mengubah status presensi";
      showPopup("error", "Error", errorMsg);
    }
  };

  // ✅ UPDATE: Fungsi utama untuk menyimpan dengan status tertentu
  const handleSave = async (targetStatus) => {
    if (!id) {
      showPopup("error", "Error", "ID acara tidak ditemukan");
      return;
    }

    if (isLoading) return;
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");
      formDataToSend.append("mdl_status", targetStatus); // draft atau active

      Object.entries(formData).forEach(([key, value]) => {
        if (key === "mdl_kode_qr") return;

        if (
          [
            "mdl_file_acara",
            "mdl_file_rundown",
            "mdl_template_sertifikat",
            "mdl_banner_acara",
          ].includes(key) &&
          typeof value === "string"
        )
          return;

        if (
          [
            "mdl_pendaftaran_mulai",
            "mdl_pendaftaran_selesai",
            "mdl_acara_mulai",
            "mdl_acara_selesai",
          ].includes(key) &&
          value
        ) {
          const convertedValue = value.replace("T", " ") + ":00";
          formDataToSend.append(key, convertedValue);
          return;
        }

        if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      const response = await axios.post(
        `${API_BASE_URL}/admin/events/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      const successMsg =
        targetStatus === "draft"
          ? "Draft berhasil disimpan"
          : "Acara berhasil dipublikasikan";
      showPopup("success", "Berhasil!", successMsg);
    } catch (error) {
      console.error(error.response?.data || error.message);

      if (error.code === "ECONNABORTED") {
        showPopup("error", "Timeout", "Koneksi timeout. Coba lagi.");
      } else {
        const errorMsg =
          error.response?.data?.message || "Gagal memperbarui acara";
        showPopup("error", "Error", errorMsg);
      }
    } finally {
      setIsLoading(false);
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
    link.download = `QR-${formData.mdl_kode_qr || "event"}.png`;
    link.click();
    showPopup("success", "Berhasil", "QR Code berhasil diunduh");
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    {
      label: event?.mdl_nama || "Detail Acara",
      link: `/admin/events/detail/${id}`,
    },
    { label: "Edit Acara" },
  ];

  const statusField = [
    {
      label: "Tanggal Mulai Pendaftaran",
      name: "mdl_pendaftaran_mulai",
      type: "datetime-local",
    },
    {
      label: "Tanggal Selesai Pendaftaran",
      name: "mdl_pendaftaran_selesai",
      type: "datetime-local",
    },
    {
      label: "Tanggal Mulai Acara",
      name: "mdl_acara_mulai",
      type: "datetime-local",
    },
    {
      label: "Tanggal Selesai Acara",
      name: "mdl_acara_selesai",
      type: "datetime-local",
    },
    { label: "Tipe Acara", name: "mdl_tipe", type: "select" },
    { label: "Jenis Acara", name: "mdl_kategori", type: "select" },
    { label: "Doorprize", name: "mdl_doorprize_aktif", type: "select" },
    { label: "Modul Acara", name: "mdl_file_acara", type: "file" },
    { label: "Susunan Acara", name: "mdl_file_rundown", type: "file" },
    {
      label: "Template Sertifikat",
      name: "mdl_template_sertifikat",
      type: "file",
    },
  ];

  return (
    <>
      <NotificationPopup />
      <ConfirmPublishModal />

      <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0">
        <Sidebar />
        <div className="flex flex-wrap flex-col flex-1 p-8">
          <Breadcrumb
            items={[
              { label: "Dashboard", link: "/admin" },
              { label: "Acara", link: "/admin/events" },
              event?.mdl_nama
                ? { label: event.mdl_nama, link: `/admin/events/${id}` }
                : { label: "Detail Acara", link: `/admin/events/${id}` },
              { label: "Edit Acara" },
            ]}
          />

          {/* Header */}
          <div className="flex flex-wrap mt-7 mb-5 justify-between w-full max-w-full rounded-2xl">
            <div>
              <Typography
                type="heading4"
                weight="bold"
                className="text-blue-900 text-xl"
              >
                Detail Acara
              </Typography>
              <Typography
                type="body"
                weight="regular"
                className="text-gray-600"
              >
                Menampilkan halaman detail acara {formData.mdl_nama}
              </Typography>
            </div>

            {/* ✅ TOMBOL SIMPAN DRAFT & PUBLISH */}
            <div className="flex items-start gap-3">
              <button
                onClick={() => handleSave("draft")}
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl font-semibold bg-blue-200 text-blue-900 hover:bg-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Menyimpan..." : "Simpan Draft"}
              </button>
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={isLoading}
                className="px-6 py-3 rounded-2xl font-semibold bg-primary text-blue-50 hover:bg-primary-90 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading && (
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                )}
                {isLoading ? "Menyimpan..." : "Publish"}
              </button>
            </div>
          </div>

          {/* Banner + Nama + Lokasi */}
          <div className="flex flex-wrap flex-row justify-between mt-6 gap-6">
            <div>
              <Typography type="caption1" weight="semibold" className="mb-4">
                Banner Acara
              </Typography>
              <img
                src={
                  formData.mdl_banner_acara instanceof File
                    ? URL.createObjectURL(formData.mdl_banner_acara)
                    : formData.mdl_banner_acara ||
                      "https://via.placeholder.com/300x150?text=No+Banner"
                }
                alt="Banner Acara"
                className="bg-gray-200 w-80 h-48 object-cover rounded-2xl mb-2"
              />
              <input
                type="file"
                name="mdl_banner_acara"
                accept="image/*"
                onChange={handleChange}
                className="block w-80 text-sm text-gray-600 rounded-lg cursor-pointer bg-typo-white2 focus:ring-2 focus:ring-blue-400 p-2"
              />
            </div>

            <div className="flex flex-wrap gap-6 flex-col flex-1">
              <div className="flex flex-wrap gap-6">
                <div className="flex-1 min-w-[280px]">
                  <Typography
                    type="caption1"
                    weight="semibold"
                    className="mb-4"
                  >
                    Nama Acara
                  </Typography>
                  <div className="relative">
                    <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Nama Acara"
                      name="mdl_nama"
                      value={formData.mdl_nama || ""}
                      onChange={handleChange}
                      className="w-full bg-typo-white2 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>

                <div className="flex-1 min-w-[280px]">
                  <Typography
                    type="caption1"
                    weight="semibold"
                    className="mb-4"
                  >
                    Lokasi Acara
                  </Typography>
                  <div className="relative">
                    <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Lokasi Acara"
                      name="mdl_lokasi"
                      value={formData.mdl_lokasi || ""}
                      onChange={handleChange}
                      className="w-full bg-typo-white2 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-8">
                <div className="flex-1">
                  <Typography
                    type="caption1"
                    weight="semibold"
                    className="mb-4"
                  >
                    Deskripsi Acara
                  </Typography>
                  <textarea
                    name="mdl_deskripsi"
                    value={formData.mdl_deskripsi || ""}
                    onChange={handleChange}
                    placeholder="Deskripsi untuk acara..."
                    rows={5}
                    className="w-full bg-typo-white2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>

                <div className="flex-1">
                  <Typography
                    type="caption1"
                    weight="semibold"
                    className="mb-4"
                  >
                    Informasi Tambahan
                  </Typography>
                  <textarea
                    name="mdl_catatan"
                    value={formData.mdl_catatan || ""}
                    onChange={handleChange}
                    placeholder="Informasi tambahan untuk acara..."
                    rows={5}
                    className="w-full bg-typo-white2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="flex flex-wrap mt-6 w-full gap-6">
            {statusField.map((field, index) => (
              <div key={index} className="w-72">
                <Typography type="caption1" weight="semibold" className="mb-2">
                  {field.label}
                </Typography>
                <div className="relative w-full">
                  {field.type === "select" ? (
                    <select
                      name={field.name}
                      value={
                        field.name === "mdl_doorprize_aktif"
                          ? formData.mdl_doorprize_aktif === 0
                            ? 0
                            : formData.mdl_doorprize_aktif
                          : formData[field.name] || ""
                      }
                      onChange={handleChange}
                      className="w-full bg-typo-white2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    >
                      {field.name === "mdl_tipe" && (
                        <>
                          <option value="">Pilih Tipe</option>
                          <option value="offline">Offline</option>
                          <option value="online">Online</option>
                          <option value="hybrid">Hybrid</option>
                        </>
                      )}
                      {field.name === "mdl_kategori" && (
                        <>
                          <option value="">Pilih Kategori</option>
                          <option value="public">Public</option>
                          <option value="private">Private</option>
                        </>
                      )}
                      {field.name === "mdl_doorprize_aktif" && (
                        <>
                          <option value="">Pilih Status Doorprize</option>
                          <option value={1}>Ada</option>
                          <option value={0}>Tidak Ada</option>
                        </>
                      )}
                    </select>
                  ) : field.type === "file" ? (
                    <label className="relative block w-full cursor-pointer">
                      <div className="flex items-center bg-typo-white2 rounded-lg px-3 py-2 text-gray-700 hover:border-blue-400">
                        <span className="truncate flex-1">
                          {fileNames[field.name] || "Pilih file..."}
                        </span>
                        <FilePlus className="text-gray-400 w-5 h-5 flex-shrink-0 ml-2" />
                      </div>
                      <input
                        type="file"
                        name={field.name}
                        onChange={handleChange}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                    </label>
                  ) : (
                    <input
                      type={field.type}
                      name={field.name}
                      value={formData[field.name] || ""}
                      onChange={handleChange}
                      placeholder={field.label}
                      className="w-full bg-typo-white2 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default InfoAcara;
