// src/utils/validateEventForm.js
export default function AddValidate(formData) {
  const errors = {};

  // --- Validasi Wajib Diisi ---
  if (!formData.mdl_nama) errors.mdl_nama = "Nama Acara wajib diisi.";
  if (!formData.mdl_deskripsi)
    errors.mdl_deskripsi = "Deskripsi Acara wajib diisi.";
  if (!formData.mdl_tipe) errors.mdl_tipe = "Tipe Acara wajib dipilih.";
  if (!formData.mdl_lokasi) errors.mdl_lokasi = "Lokasi wajib diisi.";
  if (!formData.mdl_kategori) errors.mdl_kategori = "Jenis Acara wajib dipilih.";

  if (!formData.mdl_pendaftaran_mulai)
    errors.mdl_pendaftaran_mulai = "Tanggal mulai pendaftaran wajib diisi.";
  if (!formData.mdl_pendaftaran_selesai)
    errors.mdl_pendaftaran_selesai = "Tanggal akhir pendaftaran wajib diisi.";

  if (!formData.mdl_acara_mulai)
    errors.mdl_acara_mulai = "Tanggal mulai acara wajib diisi.";
  if (!formData.mdl_acara_selesai)
    errors.mdl_acara_selesai = "Tanggal selesai acara wajib diisi.";

  if (!formData.mdl_link_wa)
    errors.mdl_link_wa = "URL Grup WhatsApp wajib diisi.";

  // --- Validasi Format URL ---
  if (formData.mdl_link_wa && !/^https?:\/\/.+/.test(formData.mdl_link_wa)) {
    errors.mdl_link_wa = "URL tidak valid (harus diawali http:// atau https://).";
  }

  // --- Validasi Logika Tanggal Pendaftaran ---
  //if (formData.mdl_pendaftaran_mulai && formData.mdl_pendaftaran_selesai) {
  //  const start = new Date(formData.mdl_pendaftaran_mulai);
  //  const end = new Date(formData.mdl_pendaftaran_selesai);
  //  if (start > end) {
  //    errors.mdl_pendaftaran_selesai =
  //      "Tanggal akhir harus setelah atau sama dengan tanggal mulai.";
  //  }
  //}

  // --- Validasi Logika antara pendaftaran & acara ---
  if (formData.mdl_pendaftaran_selesai && formData.mdl_acara_mulai_date) {
    const regEnd = new Date(formData.mdl_pendaftaran_selesai);
    const eventDate = new Date(formData.mdl_acara_mulai_date);
    if (eventDate < regEnd) {
      errors.mdl_acara_mulai_date =
        "Tanggal acara harus setelah pendaftaran ditutup.";
    }
  }

  // --- Validasi Logika Jam Acara ---
  //if (
  //  formData.mdl_acara_mulai_time &&
  //  formData.mdl_acara_selesai_time &&
  //  formData.mdl_acara_mulai_time >= formData.mdl_acara_selesai_time
  //) {
  //  errors.mdl_acara_selesai_time = "Jam selesai harus setelah jam mulai.";
  //}

  return errors;
}