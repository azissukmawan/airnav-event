import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/button";
import axios from "axios";

const Scanner = ({ isOpen, onClose, onScanSuccess, activityTitle }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const submitPresensi = async (kode) => {
    setIsSubmitting(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Token tidak ditemukan. Silakan login kembali.");
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/presensi`,
        { kode: kode },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage(response.data.message || "Presensi berhasil dicatat!");
        setScanResult(kode);

        setTimeout(() => {
          onScanSuccess(kode, response.data);
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error("Error submitting presensi:", err);
      
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.status === 401) {
        setError("Sesi Anda telah berakhir. Silakan login kembali.");
      } else if (err.response?.status === 422) {
        setError("Kode QR tidak valid atau sudah digunakan.");
      } else {
        setError("Gagal mencatat presensi. Silakan coba lagi.");
      }
      
      setScanResult("");
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    let html5QrCode;
    
    const startScanner = async () => {
      try {
        const Html5QrcodeLib = await import('https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.8/+esm');
        const Html5Qrcode = Html5QrcodeLib.Html5Qrcode;
        
        html5QrCode = new Html5Qrcode("qr-reader");
        
        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            html5QrCode.stop();
            setScanning(false);

            submitPresensi(decodedText);
          },
        );
        
        setScanning(true);
        setError("");
      } catch (err) {
        setError("Gagal mengakses kamera. Pastikan Anda memberikan izin akses kamera.");
        console.error(err);
      }
    };

    startScanner();

    return () => {
      if (html5QrCode && scanning) {
        html5QrCode.stop().catch(console.error);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-8">
      <div className="bg-white rounded-xl max-w-md w-full p-4 relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-typo-icon hover:text-typo"
          disabled={isSubmitting}
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-typo">Scan QR Code</h2>
        <p className="text-sm text-primary mb-4">{activityTitle}</p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg mb-4">
            <p className="font-semibold">Error!</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-600 p-4 rounded-lg mb-4">
            <p className="font-semibold">Berhasil!</p>
            <p className="text-sm">{successMessage}</p>
            {scanResult && <p className="text-xs mt-1">Kode: {scanResult}</p>}
          </div>
        )}

        {isSubmitting && (
          <div className="bg-blue-50 border border-blue-200 text-blue-600 p-4 rounded-lg mb-4">
            <p className="font-semibold">Memproses...</p>
            <p className="text-sm">Sedang mencatat presensi Anda</p>
          </div>
        )}

        {!scanResult && !isSubmitting && (
          <div className="mb-4">
            <div id="qr-reader" className="w-full"></div>
            <p className="text-sm text-typo-secondary mt-4 text-center">
              Arahkan kamera ke QR code untuk presensi
            </p>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full justify-center"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Memproses..." : "Tutup"}
        </Button>
      </div>
    </div>
  );
};

export default Scanner;