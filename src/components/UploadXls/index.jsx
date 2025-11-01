import React, { useState } from "react";
import { X } from "lucide-react";
import FileUpload from "../form/FileUpload";
import { Button } from "../button";

export default function UploadXls({ isOpen, onClose }) {
  const [file, setFile] = useState(null);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return;
    console.log("File Excel diunggah:", file);
    onClose(); // Tutup popup setelah unggah
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-lg font-semibold text-blue-900 mb-4">
          Unggah File Excel
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FileUpload
            label="Pilih File Excel (.xls / .xlsx)"
            accept=".xls,.xlsx"
            showPreview={false}
            maxSize={10}
            onChange={(f) => setFile(f)}
          />

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" type="button" onClick={onClose}>
              Batal
            </Button>
            <Button variant="primary" type="submit" disabled={!file}>
              Unggah
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
