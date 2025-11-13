import React, { useState } from "react";
import { X, CheckCircle, AlertTriangle } from "lucide-react";
import Spinner from "../spinner";

const CreateSertif = ({ isOpen, onClose, onGenerate, eventStatus }) => {
  const [noSkMulai, setNoSkMulai] = useState("");
  const [formatPenomoran, setFormatPenomoran] = useState("");
  const [tanggalPengesahan, setTanggalPengesahan] = useState("");
  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setloading] = useState(false);
  const [errors, setErrors] = useState({});
  const [isCheckingImage, setIsCheckingImage] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    setIsCheckingImage(true);
    const img = new Image();
    img.onload = () => {
      if (img.width !== 3509 || img.height !== 2481) {
        setErrors((prev) => ({
          ...prev,
          file: "Resolusi gambar harus 3509 x 2481 piksel.",
        }));
        setFile(null);
        setPreviewName("");
      } else {
        setFile(uploadedFile);
        setPreviewName(uploadedFile.name);
        setErrors((prev) => ({ ...prev, file: "" }));
      }
      setIsCheckingImage(false);
    };
    img.src = URL.createObjectURL(uploadedFile);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!noSkMulai) newErrors.noSkMulai = "Nomor SK mulai wajib diisi.";
    if (!formatPenomoran)
      newErrors.formatPenomoran = "Format penomoran wajib diisi.";
    if (!tanggalPengesahan)
      newErrors.tanggalPengesahan = "Tanggal pengesahan wajib diisi.";
    if (!file) newErrors.file = "File sertifikat wajib diunggah.";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Tampilkan popup konfirmasi
    setShowConfirm(true);
  };

  const handleConfirmGenerate = () => {
    setShowConfirm(false);
    onGenerate({
      noSkMulai,
      formatPenomoran,
      tanggalPengesahan,
      file,
    });

    setloading(true);
    setTimeout(() => {
      setloading(false);
      onClose();
    }, 1800);
  };

  const isEventClosed = eventStatus === "closed";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white w-[90%] max-w-lg rounded-2xl shadow-lg p-6 relative">
        {/* Tombol close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={22} />
        </button>

        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Buat Sertifikat
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nomor SK Mulai */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nomor SK Mulai <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={noSkMulai}
              onChange={(e) => setNoSkMulai(e.target.value)}
              placeholder="Contoh: 345"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.noSkMulai && (
              <p className="text-sm text-red-500 mt-1">{errors.noSkMulai}</p>
            )}
          </div>

          {/* Format Penomoran */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Format Penomoran <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formatPenomoran}
              onChange={(e) => setFormatPenomoran(e.target.value)}
              placeholder="Contoh: PGM.1234/W/R.02.03/X/2025"
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.formatPenomoran && (
              <p className="text-sm text-red-500 mt-1">
                {errors.formatPenomoran}
              </p>
            )}
          </div>

          {/* Upload Sertifikat */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Unggah Desain Sertifikat <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={handleFileChange}
              disabled={isCheckingImage}
              className="w-full border border-gray-300 rounded-lg px-3 py-2
              file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0
              file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-600
              hover:file:bg-blue-100 focus:outline-none"
            />
            {previewName && (
              <p className="text-sm text-gray-600 mt-1">
                File: <span className="font-medium">{previewName}</span>
              </p>
            )}
            {errors.file && (
              <p className="text-sm text-red-500 mt-1">{errors.file}</p>
            )}
            <p className="text-xs mt-2 text-gray-400">
              Format diperbolehkan: JPG, JPEG, PNG (maksimal 2MB, 3509×2481px).{" "}
              <a
                href="/GUIDELINE-SAFE_AREA-SERTIFIKAT-A4.jpg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Lihat panduan desain
              </a>
            </p>
          </div>

          {/* Tanggal Pengesahan */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tanggal Pengesahan <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={tanggalPengesahan}
              onChange={(e) => setTanggalPengesahan(e.target.value)}
              className="w-full border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-primary focus:outline-none"
            />
            {errors.tanggalPengesahan && (
              <p className="text-sm text-red-500 mt-1">
                {errors.tanggalPengesahan}
              </p>
            )}
          </div>

          {/* Tombol Aksi */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!isEventClosed}
              className={`px-5 py-2 rounded-xl font-medium text-white transition ${
                isEventClosed
                  ? "bg-primary hover:bg-primary-80"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Generate
            </button>
          </div>
          {!isEventClosed && (
            <p className="text-xs text-red-500 text-right mt-1">
              Sertifikat hanya bisa dibuat jika status acara sudah selesai.
            </p>
          )}
        </form>
      </div>

      {/* Popup konfirmasi */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-60">
          <div className="bg-white p-6 rounded-2xl shadow-lg w-[90%] max-w-sm text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Konfirmasi Pembuatan Sertifikat
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Pastikan seluruh data sertifikat telah benar sebelum melanjutkan.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="px-5 py-2 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmGenerate}
                className="px-5 py-2 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Iya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup sukses */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]">
          <Spinner />
        </div>
      )}
    </div>
  );
};

export default CreateSertif;