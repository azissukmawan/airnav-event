import { useState } from "react";
import Modal from "../modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../form/Dropdown";
import AddValidate from "../AddValidate";

export default function AddEvent({ isOpen, onClose, token }) {
  const [tipeAcara, setTipeAcara] = useState(null);
  const [jenisAcara, setJenisAcara] = useState(null);

  const [formData, setFormData] = useState({
    namaAcara: "",
    deskripsi: "",
    tipeAcara: "",
    lokasi: "",
    jenisAcara: "",
    regStartDate: "",
    regEndDate: "",
    tanggalAcara: "",
    jamMulai: "",
    jamSelesai: "",
    urlWA: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Helper function untuk generate slug dari nama
  const generateSlug = (nama) => {
    const baseSlug = nama
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    
    // Tambahkan timestamp untuk uniqueness
    const timestamp = Date.now();
    return `${baseSlug}-${timestamp}`;
  };

  // Helper function untuk generate kode acara
  const generateKode = () => {
    const random = Math.floor(Math.random() * 10000);
    return `EVT${random.toString().padStart(4, '0')}`;
  };

  // Helper function untuk format datetime
  const formatDateTime = (date, time) => {
    if (!date) return null;
    if (!time) time = "00:00";
    return `${date} ${time}:00`;
  };

  const handleSubmit = async (e) => {
  if (e) e.preventDefault();

  const validationErrors = AddValidate(formData);
  setErrors(validationErrors);

  if (Object.keys(validationErrors).length === 0) {
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("mdl_nama", formData.namaAcara || "");
      formDataToSend.append("mdl_kode", generateKode());
      formDataToSend.append("mdl_slug", generateSlug(formData.namaAcara || "acara"));
      formDataToSend.append("mdl_deskripsi", formData.deskripsi || "");
      formDataToSend.append("mdl_tipe", formData.tipeAcara || "offline");
      formDataToSend.append("mdl_kategori", formData.jenisAcara || "public");
      formDataToSend.append("mdl_lokasi", formData.lokasi || "");
      formDataToSend.append("mdl_latitude", -6.2);
      formDataToSend.append("mdl_longitude", 106.81);
      formDataToSend.append("radius", 100);
      formDataToSend.append("mdl_pendaftaran_mulai", formatDateTime(formData.regStartDate, "09:00"));
      formDataToSend.append("mdl_pendaftaran_selesai", formatDateTime(formData.regEndDate, "17:00"));
      formDataToSend.append("mdl_acara_mulai", formatDateTime(formData.tanggalAcara, formData.jamMulai));
      formDataToSend.append("mdl_acara_selesai", formatDateTime(formData.tanggalAcara, formData.jamSelesai));
      formDataToSend.append("mdl_status", "active");
      formDataToSend.append("mdl_catatan", "Harap membawa laptop");
      formDataToSend.append("is_public", 1);

      // 🧩 Tambahkan file upload (cek apakah user memilih file)
      if (formData.fileAcara) formDataToSend.append("mdl_file_acara", formData.fileAcara);
      if (formData.fileRundown) formDataToSend.append("mdl_file_rundown", formData.fileRundown);
      if (formData.templateSertifikat) formDataToSend.append("mdl_template_sertifikat", formData.templateSertifikat);
      if (formData.bannerAcara) formDataToSend.append("mdl_banner_acara", formData.bannerAcara);

      const response = await fetch("https://mediumpurple-swallow-757782.hostingersite.com/api/admin/events", {
  method: "POST",
  headers: {
    "Authorization": `Bearer ${token}`,
  },
  body: formDataToSend,
});

const contentType = response.headers.get("content-type");

let result;
if (contentType && contentType.includes("application/json")) {
  result = await response.json();
} else {
  const text = await response.text();
  console.error("❌ Server returned non-JSON response:", text.substring(0, 500));
  throw new Error(`Server returned HTML (Status ${response.status})`);
}

if (!response.ok) {
  throw new Error(result.message || "Server error");
}


      alert("✅ Acara berhasil ditambahkan!");
      onClose();
    } catch (error) {
      console.error("❌ Error:", error);
      alert(`❌ Gagal: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  } else {
    alert("⚠️ Mohon lengkapi semua field yang wajib diisi!");
  }
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
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
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
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
              {/* Nama Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Acara<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama acara"
                  value={formData.namaAcara}
                  onChange={(e) =>
                    setFormData({ ...formData, namaAcara: e.target.value })
                  }
                  className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                    errors.namaAcara ? "border-2 border-red-500" : "border-0"
                  } focus:outline-none`}
                />
                {errors.namaAcara && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.namaAcara}
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
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({ ...formData, deskripsi: e.target.value })
                  }
                  className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                    errors.deskripsi ? "border-2 border-red-500" : "border-0"
                  } focus:outline-none`}
                  rows="3"
                />
                {errors.deskripsi && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.deskripsi}
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
                  onSelect={(value) => {
                    setTipeAcara(value);
                    setFormData({ ...formData, tipeAcara: value });
                  }}
                  className={errors.tipeAcara ? "border-2 border-red-500" : ""}
                />
                {errors.tipeAcara && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tipeAcara}
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
                  value={formData.lokasi}
                  onChange={(e) =>
                    setFormData({ ...formData, lokasi: e.target.value })
                  }
                  className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                    errors.lokasi ? "border-2 border-red-500" : "border-0"
                  } focus:outline-none`}
                />
                {errors.lokasi && (
                  <p className="text-red-500 text-sm mt-1">{errors.lokasi}</p>
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
                  onSelect={(value) => {
                    setJenisAcara(value);
                    setFormData({ ...formData, jenisAcara: value });
                  }}
                  className={errors.jenisAcara ? "border-2 border-red-500" : ""}
                />
                {errors.jenisAcara && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.jenisAcara}
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
                        value={formData.regStartDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            regStartDate: e.target.value,
                          })
                        }
                        className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                          errors.regStartDate
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
                        value={formData.regEndDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            regEndDate: e.target.value,
                          })
                        }
                        className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                          errors.regEndDate
                            ? "border-2 border-red-500"
                            : "border-0"
                        } focus:outline-none`}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="flex-1">
                      {errors.regStartDate && (
                        <p className="text-red-500 text-sm">
                          {errors.regStartDate}
                        </p>
                      )}
                    </div>
                    <div className="w-4"></div>
                    <div className="flex-1">
                      {errors.regEndDate && (
                        <p className="text-red-500 text-sm">
                          {errors.regEndDate}
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
                  value={formData.tanggalAcara}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggalAcara: e.target.value })
                  }
                  className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                    errors.tanggalAcara ? "border-2 border-red-500" : "border-0"
                  } focus:outline-none`}
                />
                {errors.tanggalAcara && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.tanggalAcara}
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
                      value={formData.jamMulai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jamMulai: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.jamMulai
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
                      value={formData.jamSelesai}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          jamSelesai: e.target.value,
                        })
                      }
                      className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 ${
                        errors.jamSelesai
                          ? "border-2 border-red-500"
                          : "border-0"
                      } focus:outline-none`}
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-2">
                  <div className="flex-1">
                    {errors.jamMulai && (
                      <p className="text-red-500 text-sm">
                        {errors.jamMulai}
                      </p>
                    )}
                  </div>
                  <div className="w-4"></div>
                  <div className="flex-1">
                    {errors.jamSelesai && (
                      <p className="text-red-500 text-sm">
                        {errors.jamSelesai}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Upload file fields */}
              {[
                "Modul Acara (PDF/DOCX)",
                "Susunan Acara (XLSX/DOCX)",
                "Template Sertifikat (PDF/DOCX)",
                "Upload Gambar (JPG/PNG)",
              ].map((label, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type="file"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 focus:outline-none"
                  />
                </div>
              ))}

              {/* Informasi Tambahan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Informasi Tambahan
                </label>
                <textarea
                  placeholder="Deskripsi tambahan"
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
                  value={formData.urlWA}
                  onChange={(e) =>
                    setFormData({ ...formData, urlWA: e.target.value })
                  }
                  className={`w-full rounded-lg bg-gray-100 px-3 py-2 text-gray-800 placeholder-gray-500 focus:bg-gray-100 focus:ring-2 focus:ring-black-500 focus:outline-none ${
                    errors.urlWA ? "border-2 border-red-500" : "border-0"
                  }`}
                />
                {errors.urlWA && (
                  <p className="text-red-500 text-sm mt-1">{errors.urlWA}</p>
                )}
              </div>
              <br />
            </div>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}