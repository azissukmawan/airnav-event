import React from "react";
import { X, CheckCircle } from "lucide-react";

const EditEvent = ({
  isOpen,
  type = "confirm",
  message,
  onClose,
  onConfirm,
}) => {
  if (!isOpen) return null;

  const isConfirm = type === "confirm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
        {isConfirm && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
          >
            <X size={22} />
          </button>
        )}

        {isConfirm ? (
          <>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Simpan Perubahan
            </h3>
            <p className="text-gray-600 mb-6">
              Apakah kamu yakin ingin menyimpan perubahan data?
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Simpan
              </button>
            </div>
          </>
        ) : (
          <>
            <CheckCircle className="mx-auto text-green-500 mb-3" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Berhasil!
            </h3>
            <p className="text-gray-600 mb-5">
              {message || "Data berhasil diperbarui."}
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
            >
              Tutup
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EditEvent;
