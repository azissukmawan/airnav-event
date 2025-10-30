import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "../../../../components/button";

const Scanner = ({ isOpen, onClose, onScanSuccess, activityTitle }) => {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [scanResult, setScanResult] = useState("");

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
            setScanResult(decodedText);
            setScanning(false);
            html5QrCode.stop();
            setTimeout(() => {
              onScanSuccess(decodedText);
            }, 1000);
          },
          (errorMessage) => {
          }
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
  }, [isOpen, onScanSuccess, scanning]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl max-w-md w-full p-6 relative shadow-2xl border border-gray-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-typo-icon hover:text-typo"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-4 text-typo">Scan QR Code</h2>
        <p className="text-sm text-primary">{activityTitle}</p>

        {error ? (
          <div className="bg-error-10 text-error p-4 rounded-lg mb-4">
            {error}
          </div>
        ) : null}

        {scanResult ? (
          <div className="bg-success-10 text-success p-4 rounded-lg mb-4">
            <p className="font-semibold">Berhasil!</p>
            <p className="text-sm">QR Code: {scanResult}</p>
          </div>
        ) : (
          <div className="mb-4">
            <div id="qr-reader" className="w-full"></div>
            <p className="text-sm text-typo-secondary mt-4 text-center">
              Arahkan kamera ke QR code
            </p>
          </div>
        )}

        <Button
          variant="secondary"
          onClick={onClose}
          className="w-full justify-center"
        >
          Tutup
        </Button>
      </div>
    </div>
  );
};

export default Scanner;