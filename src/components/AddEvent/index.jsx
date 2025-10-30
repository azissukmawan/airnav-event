import { useState } from "react";
import Modal from "../modal";
import { motion, AnimatePresence } from "framer-motion";
import Dropdown from "../form/Dropdown";

export default function AddEvent({ isOpen, onClose }) {
  const [tipeAcara, setTipeAcara] = useState(null);
  const [jenisAcara, setJenisAcara] = useState(null);

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
        onClick={() => {
          console.log("Data acara disimpan!");
          console.log("Tipe Acara:", tipeAcara);
          console.log("Jenis Acara:", jenisAcara);
          onClose();
        }}
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
            size="md"
          >
            <form className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto px-2">
              {/* Nama Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Acara<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Masukkan nama acara"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Deskripsi Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi Acara
                </label>
                <textarea
                  placeholder="Deskripsi acara"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Tipe Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Acara
                </label>
                <Dropdown
                  label="Pilih Tipe Acara"
                  options={tipeAcaraOptions}
                  variant="white"
                  onSelect={setTipeAcara}
                />
              </div>

              {/* Lokasi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lokasi
                </label>
                <input
                  type="text"
                  placeholder="Lokasi Acara"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Jenis Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Acara
                </label>
                <Dropdown
                  label="Pilih Jenis Acara"
                  options={jenisAcaraOptions}
                  variant="white"
                  onSelect={setJenisAcara}
                />
              </div>

              {/* Tanggal Mulai & Tutup Pendaftaran */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Mulai Pendaftaran
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tanggal Tutup Pendaftaran
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Tanggal Acara */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Acara<span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Jam Mulai & Selesai */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jam Acara Mulai
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Jam Acara Selesai
                  </label>
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
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
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 h-20 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </form>
          </Modal>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
