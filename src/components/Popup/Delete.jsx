import React from "react";
import { X } from "lucide-react";

const Delete = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 relative text-center">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 transition"
        >
          <X size={22} />
        </button>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Hapus Data</h3>
        <p className="text-gray-600 mb-6">
          Apakah kamu yakin ingin menghapus data ini?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onConfirm}
            className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default Delete;
