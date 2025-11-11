import React, { useState } from "react";
import { X, CheckCircle } from "lucide-react";

const CreateSertif = ({ isOpen, onClose, onGenerate }) => {
  const [noSkMulai, setNoSkMulai] = useState("");
  const [formatPenomoran, setFormatPenomoran] = useState("");
  const [tanggalPengesahan, setTanggalPengesahan] = useState(""); // ✅ state baru
  const [file, setFile] = useState(null);
  const [previewName, setPreviewName] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
    setPreviewName(uploadedFile ? uploadedFile.name : "");
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

    onGenerate({
      noSkMulai,
      formatPenomoran,
      tanggalPengesahan,
      file,
    });

    // setShowSuccess(true);
    setNoSkMulai("");
    setFormatPenomoran("");
    setTanggalPengesahan("");
    setFile(null);
    setPreviewName("");
    setErrors({});

    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 2000);
  };

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
              Format diperbolehkan: JPG, JPEG, PNG (maksimal 2MB)
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
              className="px-5 py-2 rounded-xl bg-primary text-white font-medium hover:bg-primary-80 transition"
            >
              Generate
            </button>
          </div>
        </form>
      </div>

      {/* Popup sukses */}
      {showSuccess && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-60">
          <div className="bg-white p-6 rounded-2xl shadow-lg flex flex-col items-center gap-3 animate-fadeIn">
            <CheckCircle size={48} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-800">
              Sertifikat Berhasil Dihasilkan!
            </h3>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateSertif;
