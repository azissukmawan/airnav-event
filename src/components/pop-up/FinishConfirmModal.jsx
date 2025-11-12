import React from "react";

const FinishConfirmModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
        <svg
          className="w-12 h-12 text-red-500 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>

        <h3 className="text-lg font-semibold text-gray-900 text-center">
          Selesaikan Acara
        </h3>

        <p className="mt-2 text-sm text-gray-600 text-center">
          Apakah Anda yakin ingin menyelesaikan acara ini?
        </p>

        <div className="mt-6 flex justify-center space-x-3 w-full">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-50 text-gray-700 hover:bg-gray-100 disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-red-500 hover:bg-red-600 disabled:bg-red-400 disabled:cursor-not-allowed"
          >
            {isLoading ? "Memproses..." : "Ya, Selesaikan"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FinishConfirmModal;
