import React from "react";

const ChangeSesiConfirmModal = ({ isOpen, onClose, onConfirm, sesiNumber }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full animate-fadeIn">
        <div className="flex flex-col items-center text-center">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Ubah Sesi Acara
          </h3>

          {/* Message */}
          <p className="text-gray-600 mb-6">
            Anda akan mengubah sesi aktif ke{" "}
            <span className="font-semibold text-blue-600">Sesi {sesiNumber}</span>.
            <br />
            <span className="text-sm mt-2 block">
              Peserta yang scan QR presensi akan masuk ke sesi tersebut.
            </span>
          </p>

          {/* Buttons */}
          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition-colors"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-primary-80 transition-colors"
            >
              Ya, Ubah Sesi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeSesiConfirmModal;