import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import Breadcrumb from "../../../components/breadcrumb";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";
import { Pencil, MapPin, FilePlus } from "lucide-react";

const API_BASE_URL = "https://mediumpurple-swallow-757782.hostingersite.com/api";

const InfoAcara = () => {
  const { id } = useParams();

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
  });

  const [fileNames, setFileNames] = useState({
    mdl_file_acara: "",
    mdl_file_rundown: "",
    mdl_template_sertifikat: "",
  });

  const [selectedOption, setSelectedOption] = useState("active");
  const [presensiAktif, setPresensiAktif] = useState(false);

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

  // Fungsi untuk convert datetime dari API (2025-11-15 09:00:00) ke format datetime-local (2025-11-15T09:00)
  const convertToDatetimeLocal = (datetime) => {
    if (!datetime) return "";
    // Format dari API: "2025-11-15 09:00:00"
    // Format untuk input: "2025-11-15T09:00"
    return datetime.slice(0, 16).replace(" ", "T");
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!id) {
        console.error("❌ ID tidak ditemukan di URL params");
        return;
      }

      try {
        console.log("🔍 Fetching event dengan ID:", id);
        const response = await axios.get(
          `${API_BASE_URL}/admin/events/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        console.log("✅ Data event berhasil dimuat:", response.data);

        const data = response.data.data;
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
          mdl_pendaftaran_mulai: convertToDatetimeLocal(data.mdl_pendaftaran_mulai),
          mdl_pendaftaran_selesai: convertToDatetimeLocal(data.mdl_pendaftaran_selesai),
          mdl_acara_mulai: convertToDatetimeLocal(data.mdl_acara_mulai),
          mdl_acara_selesai: convertToDatetimeLocal(data.mdl_acara_selesai),
        });

        setFileNames({
          mdl_file_acara: getFileNameFromUrl(data.mdl_file_acara_url) || "",
          mdl_file_rundown: getFileNameFromUrl(data.mdl_file_rundown_url) || "",
          mdl_template_sertifikat: getFileNameFromUrl(data.mdl_template_sertifikat_url) || "",
        });

        // Set status presensi aktif (0 = Off, 1 = On)
        setPresensiAktif(data.mdl_presensi_aktif === 1);

        // Set status untuk radio button
        setSelectedOption(data.mdl_status || "active");
      } catch (error) {
        console.error("❌ Gagal memuat data:", error);
        alert("Gagal memuat data acara. Silakan coba lagi.");
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, type, value, files } = e.target;
    if (type === "file" && files && files[0]) {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
      setFileNames((prev) => ({ ...prev, [name]: files[0].name }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTogglePresensi = async () => {
    if (!id) {
      alert("ID acara tidak ditemukan!");
      return;
    }

    try {
      // Toggle ke status kebalikan dari status saat ini
      const newStatus = !presensiAktif;
      
      console.log("🔄 Toggle presensi untuk event ID:", id, "ke status:", newStatus);
      
      const response = await axios.put(
        `${API_BASE_URL}/admin/event/${id}/presensi/toggle`,
        {
          status_qr: newStatus
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Toggle presensi berhasil:", response.data);
      
      // Update state berdasarkan response dari API
      if (response.data && response.data.data) {
        setPresensiAktif(response.data.data.mdl_presensi_aktif === 1);
      } else {
        // Jika response tidak ada data, update dengan status baru
        setPresensiAktif(newStatus);
      }
      
      alert(`Presensi berhasil di${newStatus ? "aktifkan" : "nonaktifkan"}!`);
    } catch (error) {
      console.error("❌ Gagal toggle presensi:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Gagal mengubah status presensi.");
    }
  };

  const handleSubmit = async () => {
    if (!id) {
      alert("ID acara tidak ditemukan!");
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("_method", "PUT");

      // Tambahkan status dari radio button
      formDataToSend.append("mdl_status", selectedOption);

      Object.entries(formData).forEach(([key, value]) => {
        // Skip kode QR (auto generated)
        if (key === "mdl_kode_qr") return;
        
        // Skip file yang masih string URL (belum diubah)
        if (
          ["mdl_file_acara", "mdl_file_rundown", "mdl_template_sertifikat", "mdl_banner_acara"].includes(key) &&
          typeof value === "string"
        ) return;

        // Convert datetime-local format ke format database
        if (["mdl_pendaftaran_mulai", "mdl_pendaftaran_selesai", "mdl_acara_mulai", "mdl_acara_selesai"].includes(key) && value) {
          // Format dari input: "2025-11-15T09:00"
          // Format untuk API: "2025-11-15 09:00:00"
          const convertedValue = value.replace("T", " ") + ":00";
          formDataToSend.append(key, convertedValue);
          return;
        }

        if (value !== null && value !== undefined && value !== "") {
          formDataToSend.append(key, value);
        }
      });

      console.log("📤 Mengirim update untuk event ID:", id);

      const response = await axios.post(
        `${API_BASE_URL}/admin/events/${id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("✅ Sukses update:", response.data);
      alert("Acara berhasil diperbarui!");
    } catch (error) {
      console.error("❌ Gagal update:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Gagal memperbarui acara.");
    }
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) {
      alert("QR belum tersedia!");
      return;
    }
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `QR-${formData.mdl_kode_qr || "event"}.png`;
    link.click();
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Edit Acara" },
  ];

  const statusField = [
    { label: "Tanggal Mulai Pendaftaran", name: "mdl_pendaftaran_mulai", type: "datetime-local" },
    { label: "Tanggal Selesai Pendaftaran", name: "mdl_pendaftaran_selesai", type: "datetime-local" },
    { label: "Tanggal Mulai Acara", name: "mdl_acara_mulai", type: "datetime-local" },
    { label: "Tanggal Selesai Acara", name: "mdl_acara_selesai", type: "datetime-local" },
    { label: "Tipe Acara", name: "mdl_tipe", type: "select" },
    { label: "Jenis Acara", name: "mdl_kategori", type: "select" },
    { label: "Modul Acara", name: "mdl_file_acara", type: "file" },
    { label: "Susunan Acara", name: "mdl_file_rundown", type: "file" },
    { label: "Template Sertifikat", name: "mdl_template_sertifikat", type: "file" },
  ];

  return (
    <div className="flex flex-wrap bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex flex-wrap flex-col flex-1 p-8">
        <Breadcrumb items={breadcrumbItems} />
        
        {/* Header */}
        <div className="flex flex-wrap mt-7 mb-5 justify-between w-full max-w-full rounded-2xl">
          <div>
            <Typography type="heading4" weight="bold" className="text-blue-900 text-xl" dangerouslySetInnerHTML={null}>
              Detail Acara
            </Typography>
            <Typography type="body" weight="regular" className="text-gray-600" dangerouslySetInnerHTML={null}>
              Menampilkan halaman detail acara {formData.mdl_nama}
            </Typography>
          </div>
          <div className="flex items-start">
            <button
              onClick={handleSubmit}
              className="bg-blue-900 px-6 py-3 rounded-2xl text-blue-50 font-semibold hover:bg-blue-700 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>

        {/* Banner + Nama + Lokasi */}
        <div className="flex flex-wrap flex-row justify-between mt-6 gap-6">
          {/* Banner Section */}
          <div>
            <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
              Banner Acara
            </Typography>
            <img
              src={
                formData.mdl_banner_acara instanceof File
                  ? URL.createObjectURL(formData.mdl_banner_acara)
                  : formData.mdl_banner_acara || "https://via.placeholder.com/300x150?text=No+Banner"
              }
              alt="Banner Acara"
              className="bg-gray-200 w-80 h-48 object-cover rounded-2xl mb-2"
            />
            <input
              type="file"
              name="mdl_banner_acara"
              accept="image/*"
              onChange={handleChange}
              className="block w-80 text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer bg-white focus:ring-2 focus:ring-blue-400 p-2"
            />
          </div>

          {/* Form Fields */}
          <div className="flex flex-wrap gap-6 flex-col flex-1">
            <div className="flex flex-wrap gap-6">
              <div className="flex-1 min-w-[280px]">
                <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
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
                    className="w-full bg-white border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex-1 min-w-[280px]">
                <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
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
                    className="w-full bg-white border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-8">
              <div className="flex-1">
                <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
                  Deskripsi Acara
                </Typography>
                <textarea
                  name="mdl_deskripsi"
                  value={formData.mdl_deskripsi || ""}
                  onChange={handleChange}
                  placeholder="Deskripsi untuk acara..."
                  rows={5}
                  className="w-full bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>

              <div className="flex-1">
                <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
                  Informasi Tambahan
                </Typography>
                <textarea
                  name="mdl_catatan"
                  value={formData.mdl_catatan || ""}
                  onChange={handleChange}
                  placeholder="Informasi tambahan untuk acara..."
                  rows={5}
                  className="w-full bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields Grid */}
        <div className="flex flex-wrap mt-6 w-full gap-6">
          {statusField.map((field, index) => (
            <div key={index} className="w-72">
              <Typography type="caption1" weight="semibold" className="mb-2" dangerouslySetInnerHTML={null}>
                {field.label}
              </Typography>
              <div className="relative w-full">
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name] || ""}
                    onChange={handleChange}
                    className="w-full bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
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
                  </select>
                ) : field.type === "file" ? (
                  <label className="relative block w-full cursor-pointer">
                    <div className="flex items-center bg-white border rounded-lg px-3 py-2 text-gray-700 hover:border-blue-400">
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
                    className="w-full bg-white border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400"
                  />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* QR Code + Toggle Presensi */}
        <div className="flex flex-wrap gap-6 outline outline-2 outline-offset-2 outline-gray-300 w-fit rounded-2xl p-5 mt-6">
          <div className="flex flex-col items-center">
            <div className="p-6 flex flex-col rounded-xl items-center">
              {formData.mdl_kode_qr ? (
                <QRCodeCanvas
                  value={formData.mdl_kode_qr}
                  size={150}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="H"
                  includeMargin={true}
                />
              ) : (
                <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 text-sm">QR belum tersedia</p>
                </div>
              )}
            </div>
            <div className="text-center">
              <Typography type="body" className="text-gray-600 mb-2" dangerouslySetInnerHTML={null}>
                Download QR Code
              </Typography>
              <button
                onClick={handleDownloadQR}
                disabled={!formData.mdl_kode_qr}
                className="bg-blue-900 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                Download
              </button>
            </div>
          </div>

          <div className="p-3">
            <Typography type="caption1" weight="semibold" className="mb-4" dangerouslySetInnerHTML={null}>
              Presensi Acara
            </Typography>
            <div className="flex items-center gap-4">
              <button
                onClick={handleTogglePresensi}
                className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                  presensiAktif ? "bg-blue-900" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                    presensiAktif ? "translate-x-9" : "translate-x-1"
                  }`}
                />
              </button>
              <span className="text-sm font-medium text-gray-700">
                {presensiAktif ? "ON" : "OFF"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoAcara;