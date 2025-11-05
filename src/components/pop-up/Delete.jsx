import React, { useState, useEffect } from "react";
import { X, CheckCircle } from "lucide-react";

const Delete = ({ isOpen, onClose, onConfirm }) => {
  const [showSuccess, setShowSuccess] = useState(false);

  if (!isOpen && !showSuccess) return null;

  const handleConfirm = () => {
    onConfirm(); // Jalankan aksi hapus dari parent
    setShowSuccess(true); // Tampilkan popup sukses
    setTimeout(() => {
      setShowSuccess(false); // Hilangkan popup sukses setelah 2.5 detik
      onClose(); // Tutup modal utama
    }, 2500);
  };

  return (
    <>
      {/* Modal konfirmasi hapus */}
      {isOpen && !showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={22} />
            </button>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Hapus Data
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin menghapus data ini?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup sukses */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px] p-4">
          <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center gap-3 animate-fade-in-up">
            <CheckCircle size={48} className="text-green-500" />
            <h4 className="text-lg font-semibold text-gray-800">
              Data berhasil dihapus!
            </h4>
          </div>
        </div>
      )}
    </>
  );
};

export default Delete;
