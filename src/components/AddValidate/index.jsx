// src/utils/validateEventForm.js

export default function AddValidate(formData) {
  const errors = {};

  // --- Validasi Wajib Diisi ---
  if (!formData.namaAcara) errors.namaAcara = "Nama Acara wajib diisi.";
  if (!formData.deskripsi) errors.deskripsi = "Deskripsi Acara wajib diisi.";
  if (!formData.tipeAcara) errors.tipeAcara = "Tipe Acara wajib dipilih.";
  if (!formData.lokasi) errors.lokasi = "Lokasi wajib diisi.";
  if (!formData.jenisAcara) errors.jenisAcara = "Jenis Acara wajib dipilih.";
  if (!formData.regStartDate) errors.regStartDate = "Tanggal mulai pendaftaran wajib diisi.";
  if (!formData.regEndDate) errors.regEndDate = "Tanggal akhir pendaftaran wajib diisi.";
  if (!formData.tanggalAcara) errors.tanggalAcara = "Tanggal Acara wajib diisi.";
  if (!formData.jamMulai) errors.jamMulai = "Jam Mulai wajib diisi.";
  if (!formData.jamSelesai) errors.jamSelesai = "Jam Selesai wajib diisi.";
  if (!formData.urlWA) errors.urlWA = "URL Grup WhatsApp wajib diisi.";

  // --- Validasi Format ---
  if (formData.urlWA && !/^https?:\/\/.+/.test(formData.urlWA)) {
    errors.urlWA = "URL tidak valid (harus diawali http:// atau https://).";
  }

  // --- Validasi Logika Tanggal ---
  if (formData.regStartDate && formData.regEndDate) {
    const start = new Date(formData.regStartDate);
    const end = new Date(formData.regEndDate);
    if (start > end) {
      errors.regEndDate = "Tanggal akhir harus setelah atau sama dengan tanggal mulai.";
    }
  }

  if (formData.regEndDate && formData.tanggalAcara) {
    const regEnd = new Date(formData.regEndDate);
    const eventDate = new Date(formData.tanggalAcara);
    if (eventDate < regEnd) {
      errors.tanggalAcara = "Tanggal acara harus setelah pendaftaran ditutup.";
    }
  }

  // --- Validasi Logika Waktu ---
  if (formData.jamMulai && formData.jamSelesai && formData.jamMulai >= formData.jamSelesai) {
    errors.jamSelesai = "Jam selesai harus setelah jam mulai.";
  }

  return errors;
}
