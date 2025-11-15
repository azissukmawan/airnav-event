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

  // --- Validasi Logika Pendaftaran ---
if (formData.mdl_pendaftaran_mulai && formData.mdl_pendaftaran_selesai) {
  const daftarMulai = new Date(formData.mdl_pendaftaran_mulai).getTime();
  const daftarSelesai = new Date(formData.mdl_pendaftaran_selesai).getTime();

  // Validasi: Selesai harus *setelah* Mulai
  if (daftarMulai >= daftarSelesai) {
    errors.mdl_pendaftaran_selesai =
      "Tanggal dan waktu pendaftaran selesai harus setelah dari pendaftaran mulai (tidak boleh sama).";
  }
}

// --- Validasi Logika Acara ---
if (formData.mdl_acara_mulai && formData.mdl_acara_selesai) {
  const acaraMulai = new Date(formData.mdl_acara_mulai).getTime();
  const acaraSelesai = new Date(formData.mdl_acara_selesai).getTime();

  // Validasi: Selesai harus *setelah* Mulai
  if (acaraMulai >= acaraSelesai) {
    errors.mdl_acara_selesai =
      "Tanggal dan waktu acara selesai harus setelah dari acara mulai (tidak boleh sama).";
  }
}

// --- Validasi Hubungan antara Pendaftaran & Acara ---
if (formData.mdl_pendaftaran_selesai && formData.mdl_acara_mulai) {
  const daftarSelesai = new Date(formData.mdl_pendaftaran_selesai).getTime();
  const acaraMulai = new Date(formData.mdl_acara_mulai).getTime();

  // Validasi: Acara Mulai harus *setelah* Pendaftaran Selesai
  if (daftarSelesai >= acaraMulai) {
    errors.mdl_acara_mulai =
      "Tanggal acara mulai harus setelah pendaftaran selesai (tidak boleh sama).";
  }
}

// Validasi tanggal pendaftaran tidak boleh di masa lalu
const now = new Date().getTime();
if (formData.mdl_pendaftaran_mulai && new Date(formData.mdl_pendaftaran_mulai).getTime() < now) {
  errors.mdl_pendaftaran_mulai = "Tanggal mulai pendaftaran tidak boleh di masa lalu.";
}
if (formData.mdl_pendaftaran_selesai && new Date(formData.mdl_pendaftaran_selesai).getTime() < now) {
  errors.mdl_pendaftaran_selesai = "Tanggal akhir pendaftaran tidak boleh di masa lalu.";
}
if (formData.mdl_acara_mulai && new Date(formData.mdl_acara_mulai).getTime() < now) {
  errors.mdl_acara_mulai = "Tanggal mulai acara tidak boleh di masa lalu.";
}
if (formData.mdl_acara_selesai && new Date(formData.mdl_acara_selesai).getTime() < now) {
  errors.mdl_acara_selesai = "Tanggal akhir acara tidak boleh di masa lalu.";
}

return errors;
}