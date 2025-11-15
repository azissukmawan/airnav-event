import React, { useState } from "react";
import { X, Archive, CheckCircle2 } from "lucide-react";

const ArchiveConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [isArchived, setIsArchived] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsArchived(true);
    onConfirm?.();
    setTimeout(() => {
      setIsArchived(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm 
                 animate-fade-in p-4 transition-all duration-300"
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center animate-scale-in">
        {!isArchived ? (
          <>
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
            >
              <X size={22} />
            </button>

            <Archive className="mx-auto text-gray-700 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Arsipkan Acara?
            </h3>
            <p className="text-gray-600 mb-6">
              Acara yang diarsipkan tidak akan muncul di daftar aktif. Kamu
              yakin ingin melanjutkan?
            </p>

            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg text-primary hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                className="px-6 py-2 rounded-lg bg-primary text-white hover:bg-primary-70 transition"
              >
                Arsipkan
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 animate-scale-in">
            <CheckCircle2 size={60} className="text-green-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Data sudah diarsipkan!
            </h3>
            <p className="text-gray-600 text-sm">
              Acara berhasil dipindahkan ke arsip.
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fade-in 0.2s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ArchiveConfirmModal;
