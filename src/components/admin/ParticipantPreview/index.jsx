import React, { useState } from "react";
import Modal from "../../modal";
import { X } from "lucide-react";
import Broadcast from "../../pop-up/Broadcast";

const ParticipantPreview = ({ isOpen, onClose, data }) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [pesan, setPesan] = useState("");

  if (!isOpen) return null;

  const handleKirim = (e) => {
    e.preventDefault();
    setTimeout(() => setShowSuccess(true), 500);
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        {/* Modal Content */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-y-auto relative">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b border-gray-300">
            <h2 className="text-xl font-semibold text-gray-900">
              Share Event Information
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition"
            >
              <X size={22} />
            </button>
          </div>

          {/* Form Content */}
          <form className="p-6 space-y-4" onSubmit={handleKirim}>
            {/* Nama Acara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nama Acara
              </label>
              <input
                type="text"
                value={data.namaAcara || ""}
                readOnly
                className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
              />
            </div>

            {/* Lokasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lokasi
              </label>
              <input
                type="text"
                value={data.lokasi || ""}
                readOnly
                className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
              />
            </div>

            {/* Detail Acara */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Mulai Pendaftaran", value: data.tanggalMulai },
                { label: "Penutupan Pendaftaran", value: data.tanggalTutup },
                { label: "Tanggal Acara", value: data.tanggalAcara },
                { label: "Jam Acara", value: data.jamAcara },
              ].map((item, i) => (
                <div key={i}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {item.label}
                  </label>
                  <input
                    type="text"
                    value={item.value || ""}
                    readOnly
                    className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
                  />
                </div>
              ))}
            </div>

            {/* Modul Acara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modul Acara
              </label>
              {data.modulAcara ? (
                <a
                  href={data.modulAcara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded-lg bg-gray-100 text-green-600 p-2.5 hover:underline"
                >
                  Lihat Modul (PDF)
                </a>
              ) : (
                <p className="text-gray-400">Belum ada modul diunggah</p>
              )}
            </div>

            {/* Susunan Acara */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Susunan Acara
              </label>
              {data.susunanAcara ? (
                <a
                  href={data.susunanAcara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full rounded-lg bg-gray-100 text-green-600 p-2.5 hover:underline"
                >
                  Lihat Susunan Acara (PDF)
                </a>
              ) : (
                <p className="text-gray-400">
                  Belum ada susunan acara diunggah
                </p>
              )}
            </div>

            {/* Pesan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pesan*
              </label>
              <textarea
                placeholder="Masukkan pesan..."
                value={pesan}
                onChange={(e) => setPesan(e.target.value)}
                rows={3}
                className="w-full rounded-lg bg-white border border-gray-300 text-gray-800 p-2.5 focus:ring-1 focus:ring-green-500 resize-none"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end mt-6 gap-3 border-t border-gray-200 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2 rounded-lg border border-gray-600 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-10 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Kirim Broadcast
              </button>
            </div>
          </form>
        </div>
      </div>
      {showSuccess && (
        <Broadcast
          title="Berhasil!"
          message="Informasi berhasil dikirim ke semua peserta melalui WhatsApp."
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}
    </>
  );
};

export default ParticipantPreview;
