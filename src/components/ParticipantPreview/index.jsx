import React, { useState } from "react";
import { X } from "lucide-react";
import Broadcast from "../Popup/Broadcast";

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
      <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-gray-500 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-2">
            Share Event Information
          </h2>

          <form className="space-y-4" onSubmit={handleKirim}>
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
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mulai Pendaftaran
                </label>
                <input
                  type="text"
                  value={data.tanggalAcara || ""}
                  readOnly
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Penutupan Pendaftaran
                </label>
                <input
                  type="text"
                  value={data.tanggalAcara || ""}
                  readOnly
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Acara
                </label>
                <input
                  type="text"
                  value={data.tanggalAcara || ""}
                  readOnly
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jam Acara
                </label>
                <input
                  type="text"
                  value={data.jamAcara || ""}
                  readOnly
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Modul Acara
              </label>
              {data.modulAcara ? (
                <a
                  href={data.modulAcara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5 text-green-600 hover:underline"
                >
                  Lihat Modul (PDF)
                </a>
              ) : (
                <p className="text-gray-400">Belum ada modul diunggah</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Susunan Acara
              </label>
              {data.modulAcara ? (
                <a
                  href={data.modulAcara}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5 text-green-600 hover:underline"
                >
                  Lihat Susunan Acara (PDF)
                </a>
              ) : (
                <p className="text-gray-400">Belum ada modul diunggah</p>
              )}
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Modul Acara
              </label>
              <input
                type="text"
                value={data.jamAcara || ""}
                readOnly
                className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Susunan Acara
              </label>
              <input
                type="text"
                value={data.jamAcara || ""}
                readOnly
                className="w-full rounded-lg bg-gray-100 text-gray-800 p-2.5"
              />
            </div>
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
            </div>{" "}
            <div className="flex justify-end mt-8 gap-3">
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

      {/* {showSuccess && (
        <Broadcast
          title="Berhasil!"
          message="Informasi berhasil dikirim ke semua peserta melalui WhatsApp."
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )} */}
    </>
  );
};

export default ParticipantPreview;
