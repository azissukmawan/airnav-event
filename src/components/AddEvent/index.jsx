import { useState } from "react";
import Modal from "../modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../form/Dropdown";
import AddValidate from "../AddValidate";
import axios from "axios";

const API_BASE_URL = "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function AddEvent({ isOpen, onClose, token, onSuccess }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Notification state
  const [showNotification, setShowNotification] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState({
    type: "success",
    title: "",
    message: ""
  });

  const [formData, setFormData] = useState({
    mdl_nama: "",
    mdl_deskripsi: "",
    mdl_tipe: "",
    mdl_lokasi: "",
    mdl_kategori: "",
    mdl_pendaftaran_mulai: "",
    mdl_pendaftaran_selesai: "",
    mdl_acara_mulai_date: "",
    mdl_acara_mulai_time: "",
    mdl_acara_selesai_time: "",
    mdl_catatan: "",
    mdl_link_wa: "",
  });

  // ✅ PERBAIKAN 1: Ubah nama state files (hapus _url)
  const [files, setFiles] = useState({
    mdl_file_acara: null,
    mdl_file_rundown: null,
    mdl_template_sertifikat: null,
    mdl_banner_acara: null,
  });

  // Show notification popup
  const showPopup = (type, title, message) => {
    setNotificationConfig({ type, title, message });
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 4000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
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

  // ✅ PERBAIKAN 2: Update handleFileChange dengan logging
  const handleFileChange = (e) => {
    const { name, files: selected } = e.target;
    if (selected && selected[0]) {
      console.log(`📎 File dipilih untuk ${name}:`, selected[0].name, `(${selected[0].size} bytes)`);
      setFiles((prev) => ({ ...prev, [name]: selected[0] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isLoading) return;

    // Validasi lokal
    const validationErrors = AddValidate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showPopup("error", "Validasi Gagal", "Mohon lengkapi semua field yang wajib diisi");
      console.error("Validasi gagal:", validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors({}); // Reset errors

    try {
      // Generate slug dan kode
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
      formDataToSend.append("mdl_pendaftaran_mulai", formData.mdl_pendaftaran_mulai);
      formDataToSend.append("mdl_pendaftaran_selesai", formData.mdl_pendaftaran_selesai);
      formDataToSend.append(
        "mdl_acara_mulai",
        formatDateTime(formData.mdl_acara_mulai_date, formData.mdl_acara_mulai_time)
      );
      formDataToSend.append(
        "mdl_acara_selesai",
        formatDateTime(formData.mdl_acara_mulai_date, formData.mdl_acara_selesai_time)
      );
      formDataToSend.append("mdl_link_wa", formData.mdl_link_wa);
      
      if (formData.mdl_catatan) {
        formDataToSend.append("mdl_catatan", formData.mdl_catatan);
      }

      // ✅ PERBAIKAN 3: Append files dengan validasi File instance
      Object.entries(files).forEach(([key, file]) => {
        if (file && file instanceof File) {
          console.log(`📤 Mengirim file ${key}:`, file.name, `(${file.size} bytes)`);
          formDataToSend.append(key, file);
        }
      });

      // Debug: lihat isi FormData
      console.log("📦 Data yang akan dikirim:");
      for (let pair of formDataToSend.entries()) {
        if (pair[1] instanceof File) {
          console.log(pair[0], `File: ${pair[1].name} (${pair[1].size} bytes)`);
        } else {
          console.log(pair[0], pair[1]);
        }
      }

      const currentToken = localStorage.getItem("token");

      const res = await axios.post(
        `${API_BASE_URL}/admin/events`,
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
      
      // Tunggu sebentar untuk popup muncul, baru close
      setTimeout(() => {
        onClose();
        if (onSuccess) onSuccess(); // Refresh data di parent
      }, 1500);

    } catch (err) {
      console.error("❌ Gagal menambahkan acara:", err);

      if (err.code === 'ECONNABORTED') {
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
      setIsLoading(false);
    }
  };

  // Helper functions
  const generateSlug = (text) => {
    return text
      .toString()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const generateKode = () => {
    const random = Math.floor(Math.random() * 10000);
    return `EVT${random.toString().padStart(4, "0")}`;
  };

  const formatDateTime = (date, time) => {
    if (!date) return null;
    if (!time) time = "00:00";
    return `${date} ${time}:00`;
  };

  // Notification Component
  const NotificationPopup = () => {
    if (!showNotification) return null;

    const styles = {
      success: {
        bg: "bg-green-50 border-green-500",
        text: "text-green-800",
        icon: "text-green-600"
      },
      error: {
        bg: "bg-red-50 border-red-500",
        text: "text-red-800",
        icon: "text-red-600"
      },
      warning: {
        bg: "bg-yellow-50 border-yellow-500",
        text: "text-yellow-800",
        icon: "text-yellow-600"
      }
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
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold ${style.text}`}>{notificationConfig.title}</h3>
              <p className={`text-sm mt-1 ${style.text}`}>{notificationConfig.message}</p>
            </div>
            <button onClick={() => setShowNotification(false)} className={`${style.text} hover:opacity-70`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
    { label: "Invite Only", value: "invite-only" },
  ];

  const footerButtons = (
    <>
      <button
        onClick={onClose}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Batal
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        Simpan
      </button>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <NotificationPopup />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Modal
              isOpen={isOpen}
              onClose={onClose}
              title="Tambah Acara"
              footer={footerButtons}
              size="lg"
            >
              <form onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
                  {/* Nama Acara */}
                  <div>
                    <label>Nama Acara<span className="text-red-500">*</span></label>
                    <input
                      placeholder="Masukkan nama acara"
                      type="text"
                      name="mdl_nama"
                      value={formData.mdl_nama}
                      onChange={handleChange}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                        errors.mdl_nama ? "border-2 border-red-500" : "border"
                      }`}
                    />
                    {errors.mdl_nama && <p className="text-red-500 text-sm mt-1">{errors.mdl_nama}</p>}
                  </div>

                  {/* Deskripsi Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Deskripsi Acara<span className="text-red-500">*</span>
                    </label>
                    <textarea
                      placeholder="Deskripsi acara"
                      value={formData.mdl_deskripsi}
                      onChange={(e) => setFormData({ ...formData, mdl_deskripsi: e.target.value })}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.mdl_deskripsi ? "border-2 border-red-500" : "border-0"
                      } focus:outline-none`}
                      rows="3"
                    />
                    {errors.mdl_deskripsi && <p className="text-red-500 text-sm mt-1">{errors.mdl_deskripsi}</p>}
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
                      onSelect={(value) => setFormData({ ...formData, mdl_tipe: value })}
                      className={errors.mdl_tipe ? "border-2 border-red-500" : ""}
                    />
                    {errors.mdl_tipe && <p className="text-red-500 text-sm mt-1">{errors.mdl_tipe}</p>}
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
                      onChange={(e) => setFormData({ ...formData, mdl_lokasi: e.target.value })}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.mdl_lokasi ? "border-2 border-red-500" : "border-0"
                      } focus:outline-none`}
                    />
                    {errors.mdl_lokasi && <p className="text-red-500 text-sm mt-1">{errors.mdl_lokasi}</p>}
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
                      onSelect={(value) => setFormData({ ...formData, mdl_kategori: value })}
                      className={errors.mdl_kategori ? "border-2 border-red-500" : ""}
                    />
                    {errors.mdl_kategori && <p className="text-red-500 text-sm mt-1">{errors.mdl_kategori}</p>}
                  </div>

                  {/* Periode Pendaftaran */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Periode Pendaftaran<span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <input
                            type="date"
                            value={formData.mdl_pendaftaran_mulai}
                            onChange={(e) => setFormData({ ...formData, mdl_pendaftaran_mulai: e.target.value })}
                            className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                              errors.mdl_pendaftaran_mulai ? "border-2 border-red-500" : "border-0"
                            }`}
                          />
                        </div>
                        <span className="text-lg font-semibold text-gray-700 mb-1">–</span>
                        <div className="flex-1">
                          <input
                            type="date"
                            value={formData.mdl_pendaftaran_selesai}
                            onChange={(e) => setFormData({ ...formData, mdl_pendaftaran_selesai: e.target.value })}
                            className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                              errors.mdl_pendaftaran_selesai ? "border-2 border-red-500" : "border-0"
                            }`}
                          />
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <div className="flex-1">
                          {errors.mdl_pendaftaran_mulai && <p className="text-red-500 text-sm">{errors.mdl_pendaftaran_mulai}</p>}
                        </div>
                        <div className="w-4"></div>
                        <div className="flex-1">
                          {errors.mdl_pendaftaran_selesai && <p className="text-red-500 text-sm">{errors.mdl_pendaftaran_selesai}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tanggal Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tanggal Acara<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.mdl_acara_mulai_date}
                      onChange={(e) => setFormData({ ...formData, mdl_acara_mulai_date: e.target.value })}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                        errors.mdl_acara_mulai_date ? "border-2 border-red-500" : "border-0"
                      }`}
                    />
                    {errors.mdl_acara_mulai_date && <p className="text-red-500 text-sm mt-1">{errors.mdl_acara_mulai_date}</p>}
                  </div>

                  {/* Waktu Acara */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Waktu Acara<span className="text-red-500">*</span>
                    </label>
                    <div className="flex items-end gap-3">
                      <div className="flex-1">
                        <input
                          type="time"
                          value={formData.mdl_acara_mulai_time}
                          onChange={(e) => setFormData({ ...formData, mdl_acara_mulai_time: e.target.value })}
                          className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                            errors.mdl_acara_mulai_time ? "border-2 border-red-500" : "border-0"
                          }`}
                        />
                      </div>
                      <span className="text-lg font-semibold text-gray-700 mb-1">–</span>
                      <div className="flex-1">
                        <input
                          type="time"
                          value={formData.mdl_acara_selesai_time}
                          onChange={(e) => setFormData({ ...formData, mdl_acara_selesai_time: e.target.value })}
                          className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                            errors.mdl_acara_selesai_time ? "border-2 border-red-500" : "border-0"
                          }`}
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <div className="flex-1">
                        {errors.mdl_acara_mulai_time && <p className="text-red-500 text-sm">{errors.mdl_acara_mulai_time}</p>}
                      </div>
                      <div className="w-4"></div>
                      <div className="flex-1">
                        {errors.mdl_acara_selesai_time && <p className="text-red-500 text-sm">{errors.mdl_acara_selesai_time}</p>}
                      </div>
                    </div>
                  </div>

                  {/* ✅ PERBAIKAN 4: Update input name (hapus _url) */}
                  {/* Upload Files */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Modul Acara</label>
                    <input 
                      name="mdl_file_acara"
                      type="file" 
                      accept=".pdf,.docx,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Susunan Acara</label>
                    <input 
                      name="mdl_file_rundown"
                      type="file" 
                      accept=".pdf,.docx,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Template Sertifikat</label>
                    <input 
                      name="mdl_template_sertifikat"
                      type="file" 
                      accept=".pdf,.jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Upload Gambar</label>
                    <input 
                      name="mdl_banner_acara"
                      type="file" 
                      accept=".jpg,.jpeg,.png" 
                      onChange={handleFileChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100"
                    />
                  </div>

                  {/* Informasi Tambahan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Informasi Tambahan</label>
                    <textarea
                      placeholder="Catatan atau informasi tambahan (opsional)"
                      name="mdl_catatan"
                      value={formData.mdl_catatan}
                      onChange={handleChange}
                      className="w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 focus:outline-none border-0"
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
                      onChange={(e) => setFormData({ ...formData, mdl_link_wa: e.target.value })}
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 ${
                        errors.mdl_link_wa ? "border-2 border-red-500" : "border-0"
                      }`}
                    />
                    {errors.mdl_link_wa && <p className="text-red-500 text-sm mt-1">{errors.mdl_link_wa}</p>}
                  </div>
                  <br />
                </div>
              </form>
            </Modal>
          </motion.div>
        </>
      )}
      
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
    </AnimatePresence>
  );
}