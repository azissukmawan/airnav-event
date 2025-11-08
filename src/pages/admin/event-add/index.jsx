import { useState, useRef } from "react";
import Modal from "../../../components/modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../../../components/form/Dropdown";
import AddValidate from "../../../components/validate";
import { Calendar } from "lucide-react";
import axios from "axios";

export default function AddEvent({ isOpen, onClose, token }) {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: "",
  });

  const [formData, setFormData] = useState({
    mdl_nama: "",
    mdl_deskripsi: "",
    mdl_tipe: "",
    mdl_lokasi: "",
    mdl_kategori: "",
    mdl_pendaftaran_mulai: "",
    mdl_pendaftaran_selesai: "",
    mdl_acara_mulai: "",
    mdl_acara_selesai: "",
    mdl_catatan: "",
    mdl_link_wa: "",
  });

  const [files, setFiles] = useState({
    mdl_file_acara: null,
    mdl_file_rundown: null,
    mdl_template_sertifikat: null,
    mdl_banner_acara: null,
  });

  const dateInputRef = useRef(null);
  const acaraStartRef = useRef(null);
  const acaraEndRef = useRef(null);
  const pendaftaranStartRef = useRef(null);
  const pendaftaranEndRef = useRef(null);

  const showPopup = (type, title, message) => {
    setNotificationConfig({ type, title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // jika yang diubah adalah nama acara, buatkan slug otomatis
    if (name === "mdl_nama") {
      const newSlug = generateSlug(value);
      setFormData({
        ...formData,
        mdl_nama: value,
        mdl_slug: newSlug,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (selected && selected[0]) {
      console.log(
        `📎 File dipilih untuk ${name}:`,
        selected[0].name,
        `(${selected[0].size} bytes)`
      );
      setFiles((prev) => ({ ...prev, [name]: selected[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Prevent double submission

    const payloadForValidation = {
      ...formData,
      mdl_file_acara: files.mdl_file_acara,
      mdl_file_acara_url: "blob:http://...",
      mdl_file_rundown: files.mdl_file_rundown,
      mdl_file_rundown_url: "blob:http://...",
      mdl_template_sertifikat: files.mdl_template_sertifikat,
      mdl_template_sertifikat_url: "blob:http://...",
      mdl_banner_acara: files.mdl_banner_acara,
      mdl_banner_acara_url: "blob:http://...",
      mdl_acara_mulai_date: formData.mdl_acara_mulai
        ? formData.mdl_acara_mulai.split("T")[0]
        : "",
      mdl_acara_mulai_time: formData.mdl_acara_mulai
        ? formData.mdl_acara_mulai.split("T")[1]
        : "",
      mdl_acara_selesai_time: formData.mdl_acara_selesai
        ? formData.mdl_acara_selesai.split("T")[1]
        : "",
    };

    const validationErrors = AddValidate(payloadForValidation);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showPopup(
        "error",
        "Validasi Gagal",
        "Mohon lengkapi semua field yang wajib diisi"
      );
      console.error("Validasi gagal:", validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const slug = generateSlug(formData.mdl_nama);
      const kode = generateKode();

      const formDataToSend = new FormData();
      formDataToSend.append("mdl_nama", formData.mdl_nama);
      formDataToSend.append("mdl_kode", kode);
      formDataToSend.append("mdl_slug", slug);
      formDataToSend.append("mdl_deskripsi", formData.mdl_deskripsi);
      formDataToSend.append("mdl_tipe", formData.mdl_tipe);
      formDataToSend.append("mdl_kategori", formData.mdl_kategori);
      formDataToSend.append("mdl_lokasi", formData.mdl_lokasi);
      formDataToSend.append(
        "mdl_pendaftaran_mulai",
        formData.mdl_pendaftaran_mulai
      );
      formDataToSend.append(
        "mdl_pendaftaran_selesai",
        formData.mdl_pendaftaran_selesai
      );
      // convert datetime-local "YYYY-MM-DDTHH:MM" -> "YYYY-MM-DD HH:MM:00"
      const toBackendDateTime = (val) => {
        if (!val) return "";
        if (val.includes("T")) return val.replace("T", " ") + ":00";
        return val;
      };
      formDataToSend.append(
        "mdl_acara_mulai",
        toBackendDateTime(formData.mdl_acara_mulai)
      );
      formDataToSend.append(
        "mdl_acara_selesai",
        toBackendDateTime(formData.mdl_acara_selesai)
      );
      formDataToSend.append("mdl_link_wa", formData.mdl_link_wa);

      if (formData.mdl_catatan) {
        formDataToSend.append("mdl_catatan", formData.mdl_catatan);
      }

      Object.entries(files).forEach(([key, file]) => {
        if (file && file instanceof File) {
          formDataToSend.append(key, file);
        }
      });

      const currentToken = localStorage.getItem("token");

      const res = await axios.post(
        "https://mediumpurple-swallow-757782.hostingersite.com/api/admin/events",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      console.log("✅ Response sukses:", res.data);

      showPopup("success", "Berhasil!", "Acara berhasil ditambahkan");

      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess();
      }, 1500);
    } catch (err) {
      console.error("❌ Gagal menambahkan acara:", err);

      // ✅ GANTI semua alert dengan popup
      if (err.code === "ECONNABORTED") {
        showPopup("error", "Timeout", "Koneksi timeout. Coba lagi.");
      } else if (err.response) {
        console.error("Detail Error dari Server:", err.response.data);

        if (err.response.data?.errors) {
          setErrors(err.response.data.errors);
          showPopup("error", "Validasi Gagal", "Periksa kembali form Anda");
        } else {
          const errorMsg = err.response.data?.message || "Gagal menyimpan data";
          showPopup("error", "Error", errorMsg);
        }
      } else if (err.request) {
        showPopup("error", "Error Jaringan", "Tidak dapat terhubung ke server");
      } else {
        showPopup("error", "Error", err.message || "Terjadi kesalahan");
      }
    } finally {
      setLoading(false);
    }
  };

  const [isLoading, setIsLoading] = useState(false);

  // Helper function untuk generate slug dari nama
  // Fungsi pembuat slug dari nama acara
  const generateSlug = (text) => {
    return text
      .toString()
      .normalize("NFD") // hapus aksen
      .replace(/[\u0300-\u036f]/g, "") // hapus tanda aksen latin
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "") // hapus karakter selain huruf, angka, spasi, strip
      .replace(/\s+/g, "-"); // ubah spasi jadi strip
  };

  // Helper function untuk generate kode acara
  const generateKode = () => {
    const random = Math.floor(Math.random() * 10000);
    return `EVT${random.toString().padStart(4, "0")}`;
  };

  // Helper function untuk format datetime
  const formatDateTime = (date, time) => {
    if (!date) return null;
    if (!time) time = "00:00";
    return `${date} ${time}:00`;
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

  // Data dropdown
  const tipeAcaraOptions = [
    { label: "Offline", value: "offline" },
    { label: "Online", value: "online" },
    { label: "Hybrid", value: "hybrid" },
  ];

  const jenisAcaraOptions = [
    { label: "Private", value: "private" },
    { label: "Public", value: "public" },
    // { label: "Invite Only", value: "invite-only" },
  ];

  const footerButtons = (
    <>
      <button
        type="button"
        onClick={handleSaveDraft}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg text-blue-900 bg-blue-200 hover:bg-blue-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Simpan Draft
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg bg-blue-700 text-white hover:bg-blue-900 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
    </>
  );

  // Handle save as draft (kirim data dan set mdl_status = "draft")
  async function handleSaveDraft() {
    if (isLoading) return;

    // 1) jalankan validasi sama seperti publish
    const payloadForValidation = {
      ...formData,
      mdl_file_acara: files.mdl_file_acara,
      mdl_file_acara_url: "blob:http://...",
      mdl_file_rundown: files.mdl_file_rundown,
      mdl_file_rundown_url: "blob:http://...",
      mdl_template_sertifikat: files.mdl_template_sertifikat,
      mdl_template_sertifikat_url: "blob:http://...",
      mdl_banner_acara: files.mdl_banner_acara,
      mdl_banner_acara_url: "blob:http://...",
    };

    const validationErrors = AddValidate(payloadForValidation);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showPopup(
        "error",
        "Validasi Gagal",
        "Mohon lengkapi semua field yang wajib diisi"
      );
      console.error("Validasi gagal (draft):", validationErrors);
      return;
    }

    // 2) lanjut kirim draft (set loading setelah validasi)
    setIsLoading(true);
    setErrors({});

    try {
      const kode = generateKode();
      const slug = generateSlug(formData.mdl_nama || kode);

      const formDataToSend = new FormData();
      formDataToSend.append("mdl_nama", formData.mdl_nama || "");
      formDataToSend.append("mdl_kode", kode);
      formDataToSend.append("mdl_slug", slug);
      formDataToSend.append("mdl_deskripsi", formData.mdl_deskripsi || "");
      formDataToSend.append("mdl_tipe", formData.mdl_tipe || "");
      formDataToSend.append("mdl_kategori", formData.mdl_kategori || "");
      formDataToSend.append("mdl_lokasi", formData.mdl_lokasi || "");
      formDataToSend.append(
        "mdl_pendaftaran_mulai",
        formData.mdl_pendaftaran_mulai || ""
      );
      formDataToSend.append(
        "mdl_pendaftaran_selesai",
        formData.mdl_pendaftaran_selesai || ""
      );

      const toBackendDateTime = (val) => {
        if (!val) return "";
        return val.includes("T") ? val.replace("T", " ") + ":00" : val;
      };
      formDataToSend.append(
        "mdl_acara_mulai",
        toBackendDateTime(formData.mdl_acara_mulai)
      );
      formDataToSend.append(
        "mdl_acara_selesai",
        toBackendDateTime(formData.mdl_acara_selesai)
      );
      formDataToSend.append("mdl_link_wa", formData.mdl_link_wa || "");
      formDataToSend.append("mdl_status", "draft");
      if (formData.mdl_catatan)
        formDataToSend.append("mdl_catatan", formData.mdl_catatan);

      Object.entries(files).forEach(([key, file]) => {
        if (file && file instanceof File) formDataToSend.append(key, file);
      });

      const currentToken =
        localStorage.getItem("token") || sessionStorage.getItem("token");

      const res = await axios.post(
        "https://mediumpurple-swallow-757782.hostingersite.com/api/admin/events",
        formDataToSend,
        {
          headers: {
            Authorization: currentToken ? `Bearer ${currentToken}` : undefined,
            "Content-Type": "multipart/form-data",
          },
          timeout: 30000,
        }
      );

      console.log("Draft tersimpan:", res.data);
      showPopup(
        "success",
        "Draft Tersimpan",
        "Data berhasil disimpan sebagai draft"
      );
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (err) {
      console.error("Gagal simpan draft:", err);
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
        showPopup("error", "Validasi Gagal", "Periksa kembali form Anda");
      } else {
        showPopup(
          "error",
          "Error",
          err.response?.data?.message || err.message || "Gagal menyimpan draft"
        );
      }
    } finally {
      setIsLoading(false);
    }
  }

  const openDatePicker = (ref) => {
    if (!ref?.current) return;
    // modern browsers (Chrome) support showPicker()
    if (typeof ref.current.showPicker === "function") {
      ref.current.showPicker();
      return;
    }
    // fallback: focus / click to open native picker
    try {
      ref.current.focus();
      ref.current.click();
    } catch (e) {
      ref.current.focus();
    }
  };

  return (
    <>
      <NotificationPopup key="add-event-notification" />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="modal-backdrop"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Modal
              key="add-event-modal"
              isOpen={isOpen}
              onClose={onClose}
              title="Tambah Acara"
              footer={footerButtons}
              size="lg"
            >
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2 ">
                  {/* Nama Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Acara<span className="text-red-500">*</span>
                    </label>
                    <input
                      placeholder="Masukkan nama acara"
                      type="text"
                      name="mdl_nama"
                      value={formData.mdl_nama}
                      onChange={handleChange}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.mdl_nama ? "border-2 border-red-500" : "border-0"
                      }`}
                    />
                    {errors.mdl_nama && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_nama}
                      </p>
                    )}
                  </div>

                  {/* Deskripsi Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Acara<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Deskripsi acara"
                      value={formData.mdl_deskripsi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mdl_deskripsi: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.mdl_deskripsi
                          ? "border-2 border-red-500"
                          : "border-0"
                      } focus:outline-none`}
                      rows="3"
                    />
                    {errors.mdl_deskripsi && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_deskripsi}
                      </p>
                    )}
                  </div>

                  {/* Tipe Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipe Acara<span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      label="Pilih Tipe Acara"
                      options={tipeAcaraOptions}
                      variant="white"
                      value={formData.mdl_tipe}
                      onSelect={(value) =>
                        setFormData({ ...formData, mdl_tipe: value })
                      }
                      className={
                        errors.mdl_tipe ? "border-2 border-red-500" : ""
                      }
                    />
                    {errors.mdl_tipe && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_tipe}
                      </p>
                    )}
                  </div>

                  {/* Lokasi */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Lokasi<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Lokasi Acara"
                      value={formData.mdl_lokasi}
                      onChange={(e) =>
                        setFormData({ ...formData, mdl_lokasi: e.target.value })
                      }
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.mdl_lokasi
                          ? "border-2 border-red-500"
                          : "border-0"
                      } focus:outline-none`}
                    />
                    {errors.mdl_lokasi && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_lokasi}
                      </p>
                    )}
                  </div>

                  {/* Jenis Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Jenis Acara<span className="text-red-500">*</span>
                    </label>
                    <Dropdown
                      label="Pilih Jenis Acara"
                      options={jenisAcaraOptions}
                      variant="white"
                      value={formData.mdl_kategori}
                      onSelect={(value) => {
                        setFormData({ ...formData, mdl_kategori: value });
                      }}
                      className={
                        errors.mdl_kategori ? "border-2 border-red-500" : ""
                      }
                    />
                    {errors.mdl_kategori && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_kategori}
                      </p>
                    )}
                  </div>

                  {/* Periode Pendaftaran */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periode Pendaftaran<span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-end gap-3">
                        <div className="flex-1 relative">
                          <button
                            type="button"
                            onClick={() => openDatePicker(pendaftaranStartRef)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-900 p-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                            aria-label="Buka pemilih tanggal mulai"
                          >
                            <Calendar size={18} />
                          </button>
                          <input
                            ref={pendaftaranStartRef}
                            type="datetime-local"
                            value={formData.mdl_pendaftaran_mulai}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mdl_pendaftaran_mulai: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg bg-gray-100 pl-13 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                              errors.mdl_pendaftaran_mulai
                                ? "border-2 border-red-500"
                                : "border-0"
                            } focus:outline-none`}
                          />
                        </div>

                        <span className="text-lg font-semibold text-gray-700 mb-1 select-none">
                          –
                        </span>

                        <div className="flex-1 relative">
                          <button
                            type="button"
                            onClick={() => openDatePicker(pendaftaranEndRef)}
                            className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-900 p-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                            aria-label="Buka pemilih tanggal selesai"
                          >
                            <Calendar size={18} />
                          </button>
                          <input
                            ref={pendaftaranEndRef}
                            type="datetime-local"
                            value={formData.mdl_pendaftaran_selesai}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                mdl_pendaftaran_selesai: e.target.value,
                              })
                            }
                            className={`w-full rounded-lg bg-gray-100 pl-13 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                              errors.mdl_pendaftaran_selesai
                                ? "border-2 border-red-500"
                                : "border-0"
                            } focus:outline-none`}
                          />
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <div className="flex-1">
                          {errors.mdl_pendaftaran_mulai && (
                            <p className="text-red-500 text-sm">
                              {errors.mdl_pendaftaran_mulai}
                            </p>
                          )}
                        </div>
                        <div className="w-4"></div>
                        <div className="flex-1">
                          {errors.mdl_pendaftaran_selesai && (
                            <p className="text-red-500 text-sm">
                              {errors.mdl_pendaftaran_selesai}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tanggal & Waktu Acara (gabungan datetime-local) */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periode Acara<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-end gap-3">
                      <div className="flex-1 relative">
                        <button
                          type="button"
                          onClick={() => openDatePicker(acaraStartRef)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-900 p-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                          aria-label="Buka pemilih tanggal mulai acara"
                        >
                          <Calendar size={18} />
                        </button>
                        <input
                          ref={acaraStartRef}
                          type="datetime-local"
                          value={formData.mdl_acara_mulai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mdl_acara_mulai: e.target.value,
                            })
                          }
                          className={`w-full rounded-lg bg-gray-100 pl-13 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                            errors.mdl_acara_mulai
                              ? "border-2 border-red-500"
                              : "border-0"
                          } focus:outline-none`}
                        />
                      </div>

                      <span className="text-lg font-semibold text-gray-700 mb-1 select-none">
                        –
                      </span>

                      <div className="flex-1 relative">
                        <button
                          type="button"
                          onClick={() => openDatePicker(acaraEndRef)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-900 p-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                          aria-label="Buka pemilih tanggal selesai acara"
                        >
                          <Calendar size={18} />
                        </button>
                        <input
                          ref={acaraEndRef}
                          type="datetime-local"
                          value={formData.mdl_acara_selesai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mdl_acara_selesai: e.target.value,
                            })
                          }
                          className={`w-full rounded-lg bg-gray-100 pl-13 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                            errors.mdl_acara_selesai
                              ? "border-2 border-red-500"
                              : "border-0"
                          } focus:outline-none`}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        {errors.mdl_acara_mulai && (
                          <p className="text-red-500 text-sm">
                            {errors.mdl_acara_mulai}
                          </p>
                        )}
                      </div>
                      <div className="w-4"></div>
                      <div className="flex-1">
                        {errors.mdl_acara_selesai && (
                          <p className="text-red-500 text-sm">
                            {errors.mdl_acara_selesai}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Upload file fields */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Modul Acara (DOC, DOCX, PDF, PPT, PPTX)
                    </label>
                    <input
                      name="mdl_file_acara"
                      type="file"
                      accept=".doc,.docx, .pdf,.ppt,.pptx"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 focus:outline-none"
                    />
                    {errors.mdl_file_acara && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_file_acara}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Susunan Acara (DOC, DOCX, PDF, XLS, XLSX)
                    </label>
                    <input
                      name="mdl_file_rundown"
                      type="file"
                      accept=".doc,.docx,.pdf,.xls,.xlsx"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 focus:outline-none"
                    />
                    {errors.mdl_file_rundown && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_file_rundown}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Template Sertifikat (JPG, JPEG, PNG)
                    </label>
                    <input
                      name="mdl_template_sertifikat"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 focus:outline-none"
                    />

                    <p className="text-gray-500 text-sm mt-1">
                      <a
                        href="/format-template-sertifikat.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        Lihat template sertifikat
                      </a>
                    </p>

                    {errors.mdl_template_sertifikat && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_template_sertifikat}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Gambar (JPG, JPEG, PNG)
                    </label>
                    <input
                      name="mdl_banner_acara"
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 focus:outline-none"
                    />
                    {errors.mdl_banner_acara && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_banner_acara}
                      </p>
                    )}
                  </div>

                  {/* Informasi Tambahan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Informasi Tambahan
                    </label>
                    <textarea
                      placeholder="Deskripsi tambahan"
                      value={formData.mdl_catatan}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mdl_catatan: e.target.value,
                        })
                      }
                      className="w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 focus:ring-black-500 focus:outline-none border-0"
                      rows="3"
                    />
                  </div>

                  {/* URL Grup WhatsApp */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      URL Grup WhatsApp<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://chat.whatsapp.com/..."
                      value={formData.mdl_link_wa}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          mdl_link_wa: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 focus:ring-black-500 focus:outline-none ${
                        errors.mdl_link_wa
                          ? "border-2 border-red-500"
                          : "border-0"
                      }`}
                    />
                    {errors.mdl_link_wa && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.mdl_link_wa}
                      </p>
                    )}
                  </div>
                  <br />
                </div>
              </form>
            </Modal>
          </motion.div>
        )}
        {/* Hide native right-side calendar icon and remove default appearance */}
        <style>{`
        /* Remove native calendar/picker icon on date and datetime-local inputs (Chrome/WebKit) */
        input[type="date"]::-webkit-calendar-picker-indicator,
        input[type="datetime-local"]::-webkit-calendar-picker-indicator {
          display: none !important;
          -webkit-appearance: none;
          appearance: none;
          pointer-events: none;
          opacity: 0;
        }

        /* Remove default appearance so our custom left icon + padding aligns */
        input[type="date"],
        input[type="datetime-local"] {
          -webkit-appearance: none;
          appearance: none;
          background-repeat: no-repeat;
        }

        /* Optional: hide clear/spinner for some browsers */
        input[type="datetime-local"]::-webkit-clear-button,
        input[type="datetime-local"]::-webkit-inner-spin-button {
          display: none;
        }
      `}</style>
      </AnimatePresence>
    </>
  );
}
