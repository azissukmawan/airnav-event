import React from "react";
import { LucideMessageCircleWarning } from "lucide-react";

// Ini warna-warna alert kita
const alertStyles = {
  success: {
    wrapper: "bg-green-50 border-green-200 text-green-800",
    icon: "",
  },
  error: {
    wrapper: "bg-red-50 border-red-200 text-red-800",
    icon: "",
  },
  warning: {
    wrapper: "bg-yellow-50 border-yellow-200 text-yellow-800",
    icon: "",
  },
  info: {
    wrapper: "bg-blue-50 border-blue-200 text-blue-800",
    icon: "",
  },
};

// Ini komponen Alert kita
const Alert = ({
  message, // Pesan yang mau ditampilkan
  type = "info", // Jenis alert (success/error/warning/info)
  onClose, // Fungsi untuk menutup alert
}) => {
  // Ambil style sesuai tipe
  const style = alertStyles[type];

  return (
    <div
      className={`p-4 rounded-lg border ${style.wrapper} flex items-center gap-3`}
    >
      {/* Bagian icon */}
      <span className="text-xl">{style.icon}</span>

      {/* Bagian pesan */}
      <p className="flex-1">{message}</p>

      {/* Tombol tutup */}
      {onClose && (
        <button
          onClick={onClose}
          className="hover:bg-gray-200 rounded-full p-1"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default Alert;
