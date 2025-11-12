import React, { useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { ChevronDown, Maximize2, X } from "lucide-react";

// ============================================
// COMPONENT TERPISAH - QRFullscreen.jsx
// ============================================
// Copy component ini ke file baru: QRFullscreen.jsx
// Import: import QRFullscreen from './QRFullscreen';

export const QRFullscreen = ({ qrValue, eventTitle, sesi, onClose }) => {
  if (!qrValue) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
      {/* Tombol Close */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
        aria-label="Close fullscreen"
      >
        <X size={36} strokeWidth={2} />
      </button>

      {/* Konten Fullscreen */}
      <div className="flex flex-col items-center gap-8 animate-fadeIn">
        {/* QR Code Container */}
        <div className="bg-white p-10 rounded-3xl shadow-2xl">
          <QRCodeCanvas
            value={qrValue}
            size={400}
            bgColor="#ffffff"
            fgColor="#000000"
            level="H"
            includeMargin={true}
          />
        </div>

        {/* Info Text */}
        <div className="text-center text-white space-y-3">
          <h2 className="text-4xl font-bold tracking-tight">{eventTitle}</h2>
          {sesi && (
            <p className="text-2xl font-semibold text-blue-300">
              Sesi ke {sesi}
            </p>
          )}
          <p className="text-sm text-gray-400 mt-4">
            Scan QR Code untuk presensi
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// COMPONENT UTAMA - Layout Event Detail (TIDAK DIUBAH)
// ============================================

// Component Typography (mock)
const Typography = ({ type, weight, className, children }) => {
  const styles = {
    body: "text-base",
    caption1: "text-sm",
  };
  const weights = {
    semibold: "font-semibold",
  };
  return (
    <div
      className={`${styles[type] || ""} ${weights[weight] || ""} ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

const ImprovedQRLayout = () => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [showCreateSertif, setShowCreateSertif] = useState(false);
  const [presensiAktif, setPresensiAktif] = useState(false);
  const [hari, setHari] = useState("");
  const [loadingEvent] = useState(false);

  // Mock data
  const eventData = {
    mdl_kode_qr: "https://example.com/event/123",
    mdl_nama: "Workshop ReactJS Advanced",
  };

  const handleTogglePresensi = () => {
    setPresensiAktif(!presensiAktif);
  };

  const handleFilter = (currentHari, newSesi) => {
    setHari(newSesi);
    console.log("Filter:", currentHari, newSesi);
  };

  const handleDownloadQR = () => {
    const canvas = document.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "qr-code.png";
      link.href = url;
      link.click();
    }
  };

  return (
    <div className="ml-25">
      {/* LAYOUT ASLI - TIDAK DIUBAH */}
      <div className="flex-1">
        {!loadingEvent && eventData && (
          <div className="flex flex-wrap gap-3 w-fit rounded-2xl">
            <div className="flex flex-col items-center">
              <div className="flex flex-col rounded-xl items-center relative">
                {eventData.mdl_kode_qr ? (
                  <>
                    <QRCodeCanvas
                      value={eventData.mdl_kode_qr}
                      size={130}
                      bgColor="#ffffff"
                      fgColor="#000000"
                      level="H"
                      includeMargin={true}
                    />
                    {/* TOMBOL FULLSCREEN - TAMBAHAN */}
                    <button
                      onClick={() => setShowFullscreen(true)}
                      className="absolute -top-2 -right-2 bg-blue-600 text-white rounded-lg p-2 shadow-lg hover:bg-blue-700 transition-all hover:scale-110"
                      title="Fullscreen QR"
                    >
                      <Maximize2 size={18} />
                    </button>
                  </>
                ) : (
                  <div className="w-[150px] h-[150px] bg-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500 text-sm">QR belum tersedia</p>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Typography
                  type="body"
                  className="text-gray-600 mb-2"
                ></Typography>
                <button
                  onClick={handleDownloadQR}
                  disabled={!eventData.mdl_kode_qr}
                  className="outline outline-2 outline-offset-2 outline-primary text-primary px-3 py-1 text-xs rounded-lg hover:bg-primary-80 hover:text-primary-0 disabled:bg-gray-400"
                >
                  Download QR
                </button>
              </div>
            </div>

            <div className="p-3 ml-5">
              <Typography type="caption1" weight="semibold" className="mb-4">
                Presensi Acara
              </Typography>
              <div className="flex items-center gap-4">
                <button
                  onClick={handleTogglePresensi}
                  className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-300 ${
                    presensiAktif ? "bg-primary" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform duration-300 ${
                      presensiAktif ? "translate-x-9" : "translate-x-1"
                    }`}
                  />
                </button>
                <span className="text-sm font-medium text-gray-700">
                  {presensiAktif ? "ON" : "OFF"}
                </span>
              </div>

              {/* === PILIH SESI === */}
              <div className="flex-1 flex flex-col mb-3 relative w-30">
                <label className="font-semibold text-gray-700 mb-1"></label>

                <select
                  value={hari}
                  onChange={(e) => handleFilter(hari, e.target.value)}
                  className="mt-2 border border-blue-900 rounded-xl p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
                >
                  <option value="">Pilih Sesi</option>
                  {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={`Hari-${num}`}>
                      Sesi {num}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  className="absolute right-3 top-[25px] text-gray-500 pointer-events-none"
                />
              </div>
            </div>
          </div>
        )}

        {/* === SERTIFIKAT === */}
        <button
          onClick={() => setShowCreateSertif(true)}
          className="mt-8 ml-7 px-15 py-2 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary-80"
        >
          Generate Sertifikat
        </button>
      </div>

      {/* FULLSCREEN QR MODAL - COMPONENT TERPISAH */}
      {showFullscreen && (
        <QRFullscreen
          qrValue={eventData.mdl_kode_qr}
          eventTitle={eventData.mdl_nama}
          sesi={hari}
          onClose={() => setShowFullscreen(false)}
        />
      )}

      {/* Mock Certificate Modal */}
      {showCreateSertif && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Generate Sertifikat</h3>
            <p className="text-gray-600 mb-4">
              Fitur generate sertifikat akan muncul di sini.
            </p>
            <button
              onClick={() => setShowCreateSertif(false)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImprovedQRLayout;
