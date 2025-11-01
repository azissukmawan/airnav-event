import { useState } from "react";
import Modal from "../modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../form/Dropdown";
import AddValidate from "../AddValidate";

export default function AddEvent({ isOpen, onClose }) {
  const [tipeAcara, setTipeAcara] = useState(null);
  const [jenisAcara, setJenisAcara] = useState(null);
  const [jamMulai, setJamMulai] = useState("");
  const [jamSelesai, setJamSelesai] = useState("");

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

  const handleSubmit = () => {
    const validationErrors = AddValidate(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Data acara disimpan!");
      console.log("Form Data:", formData);
      onClose();
    } else {
      console.log("Validasi gagal!");
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
        className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
      >
        Cancel
      </button>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Simpan
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
            <form className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
              {/* Nama Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Acara<span className="text-black-500">*</span>
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
                  Deskripsi Acara<span className="text-black-500">*</span>
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
                  Tipe Acara<span className="text-black-500">*</span>
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
                  Lokasi<span className="text-black-500">*</span>
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
                  Jenis Acara<span className="text-black-500">*</span>
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

              {/* Tanggal Mulai & Tutup Pendaftaran */}
              <div className="grid grid-cols-1 gap-4">
                {/* Periode Pendaftaran with fixed layout */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Periode Pendaftaran<span className="text-black-500">*</span>
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

                    {/* Error messages in their own row */}
                    <div className="flex gap-3">
                      <div className="flex-1">
                        {errors.regStartDate && (
                          <p className="text-red-500 text-sm">
                            {errors.regStartDate}
                          </p>
                        )}
                      </div>
                      <div className="w-4"></div> {/* Spacer for dash */}
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
              </div>

              {/* Tanggal Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Acara<span className="text-black-500">*</span>
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

              {/* Jam Mulai & Selesai */}
              <div className="grid grid-cols-1 gap-4">
                {/* Jam Acara Mulai & Selesai */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waktu Acara<span className="text-black-500">*</span>
                  </label>

                  <div className="flex items-end gap-3">
                    {/* Jam Mulai */}
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

                    {/* Tanda strip di tengah */}
                    <span className="text-lg font-semibold text-gray-700 mb-1 select-none self-end">
                      –
                    </span>

                    {/* Jam Selesai */}
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
                  {/* Error messages in their own row */}
                  <div className="flex gap-3">
                    <div className="flex-1">
                      {errors.jamMulai && (
                        <p className="text-red-500 text-sm">
                          {errors.jamMulai}
                        </p>
                      )}
                    </div>
                    <div className="w-4"></div> {/* Spacer for dash */}
                    <div className="flex-1">
                      {errors.jamSelesai && (
                        <p className="text-red-500 text-sm">
                          {errors.jamSelesai}
                        </p>
                      )}
                    </div>
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
                />
              </div>

              {/* URL Grup WhatsApp */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL Grup WhatsApp<span className="text-black-500">*</span>
                </label>
                <input
                  placeholder="Links"
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
              <br></br>
            </form>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
