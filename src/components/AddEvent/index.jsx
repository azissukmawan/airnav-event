import { useState } from "react";
import Modal from "../modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../form/Dropdown";
import AddValidate from "../AddValidate";
import axios from "axios";

export default function AddEvent({ isOpen, onClose, token }) {
  const [loading, setLoading] = useState(false);
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

  const [files, setFiles] = useState({
    mdl_file_acara_url: null,
    mdl_file_rundown_url: null,
    mdl_template_sertifikat_url: null,
    mdl_banner_acara_url: null,
  });

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
    setFiles((prev) => ({ ...prev, [name]: selected[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔹 1. Jalankan validasi lokal (termasuk file)
    // map files state ke nama field yang divalidasi oleh AddValidate
    const payloadForValidation = {
      ...formData,
      mdl_file_acara: files.mdl_file_acara_url,
      mdl_file_rundown: files.mdl_file_rundown_url,
      mdl_template_sertifikat: files.mdl_template_sertifikat_url,
      mdl_banner_acara: files.mdl_banner_acara_url,
    };
    const validationErrors = AddValidate(payloadForValidation);

    // 🔹 2. Kalau ada error, tampilkan & hentikan submit
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      console.error("Validasi gagal:", validationErrors);
      return; // stop kirim ke backend
    }

    setLoading(true);

    try {
      // 🔹 3. Generate otomatis slug dan kode sebelum dikirim
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
      formDataToSend.append(
        "mdl_acara_mulai",
        formatDateTime(
          formData.mdl_acara_mulai_date,
          formData.mdl_acara_mulai_time
        )
      );
      formDataToSend.append(
        "mdl_acara_selesai",
        formatDateTime(
          formData.mdl_acara_mulai_date,
          formData.mdl_acara_selesai_time
        )
      );
      formDataToSend.append("mdl_link_wa", formData.mdl_link_wa);

      // kalau ada file
      Object.entries(files).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      // Ambil token terbaru langsung dari localStorage
      const currentToken = localStorage.getItem("token");

      const res = await axios.post(
        "https://mediumpurple-swallow-757782.hostingersite.com/api/admin/events",
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`, // <-- GUNAKAN TOKEN TERBARU
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Response sukses:", res.data);
      alert("Acara berhasil ditambahkan!");
      onClose();
    } catch (err) {
      console.error("Gagal menambahkan acara:", err); // 💡 TAMBAHKAN INI UNTUK MELIHAT DETAIL ERROR 422

      if (err.response) {
        console.error("Detail Error dari Server (422):", err.response.data); // Jika backend (misal Laravel) mengirimkan object 'errors'

        if (err.response.data && err.response.data.errors) {
          console.error("Daftar error:", err.response.data.errors);
          setErrors(err.response.data.errors);
        } else {
          // Jika errornya adalah pesan tunggal
          alert(`Error: ${err.response.data.message || "Validasi gagal"}`);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const [errors, setErrors] = useState({});
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
        Cancel
      </button>
      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
        {isLoading ? "Menyimpan..." : "Simpan"}
      </button>
    </>
  );

  return (
    <AnimatePresence>
      {isOpen && (
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
            <form onSubmit={handleSubmit}>
              <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
                {/* Nama Acara */}
                <div>
                  <label>
                    Nama Acara<span className="text-red-500">*</span>
                  </label>
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
                    value={formData.mdl_tipe} // ✅ supaya sinkron dua arah
                    onSelect={(value) =>
                      setFormData({ ...formData, mdl_tipe: value })
                    }
                    className={errors.mdl_tipe ? "border-2 border-red-500" : ""}
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
                      errors.mdl_lokasi ? "border-2 border-red-500" : "border-0"
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
                      <div className="flex-1">
                        <input
                          type="date"
                          value={formData.mdl_pendaftaran_mulai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mdl_pendaftaran_mulai: e.target.value,
                            })
                          }
                          className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                            errors.mdl_pendaftaran_mulai
                              ? "border-2 border-red-500"
                              : "border-0"
                          } focus:outline-none`}
                        />
                      </div>

                      <span className="text-lg font-semibold text-gray-700 mb-1 select-none">
                        –
                      </span>

                      <div className="flex-1">
                        <input
                          type="date"
                          value={formData.mdl_pendaftaran_selesai}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              mdl_pendaftaran_selesai: e.target.value,
                            })
                          }
                          className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
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

                {/* Tanggal Acara */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Acara<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.mdl_acara_mulai_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        mdl_acara_mulai_date: e.target.value,
                      })
                    }
                    className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                      errors.mdl_acara_mulai_date
                        ? "border-2 border-red-500"
                        : "border-0"
                    } focus:outline-none`}
                  />
                  {errors.mdl_acara_mulai_date && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.mdl_acara_mulai_date}
                    </p>
                  )}
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
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mdl_acara_mulai_time: e.target.value,
                          })
                        }
                        className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                          errors.mdl_acara_mulai_time
                            ? "border-2 border-red-500"
                            : "border-0"
                        } focus:outline-none`}
                      />
                    </div>

                    <span className="text-lg font-semibold text-gray-700 mb-1 select-none self-end">
                      –
                    </span>

                    <div className="flex-1">
                      <input
                        type="time"
                        value={formData.mdl_acara_selesai_time}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            mdl_acara_selesai_time: e.target.value,
                          })
                        }
                        className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                          errors.mdl_acara_selesai_time
                            ? "border-2 border-red-500"
                            : "border-0"
                        } focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 mt-2">
                    <div className="flex-1">
                      {errors.mdl_acara_mulai_time && (
                        <p className="text-red-500 text-sm">
                          {errors.mdl_acara_mulai_time}
                        </p>
                      )}
                    </div>
                    <div className="w-4"></div>
                    <div className="flex-1">
                      {errors.mdl_acara_selesai_time && (
                        <p className="text-red-500 text-sm">
                          {errors.mdl_acara_selesai_time}
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
                    name="mdl_file_acara_url"
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
                    name="mdl_file_rundown_url"
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
                    name="mdl_template_sertifikat_url"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2
      file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
      file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
      hover:file:bg-blue-100 focus:outline-none"
                  />
                  <div className="mt-2">
                    <a
                      href="/format-template-sertifikat.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 text-sm underline hover:text-blue-800"
                    >
                      Download Template Sertifikat
                    </a>
                    <p className="text-gray-500 text-xs mt-1">
                      *Ukuran file: A4 Landscape
                    </p>
                  </div>

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
                    name="mdl_banner_acara_url"
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
                      setFormData({ ...formData, mdl_catatan: e.target.value })
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
                      setFormData({ ...formData, mdl_link_wa: e.target.value })
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
    </AnimatePresence>
  );
}
