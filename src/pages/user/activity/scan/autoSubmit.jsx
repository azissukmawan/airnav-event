import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Modal from "../../../../components/modal";
import Loading from "../../../../components/loading";

export default function PresensiAutoSubmit() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("Memproses presensi...");
  const [errorMsg, setErrorMsg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [kode, setKode] = useState("");

  useEffect(() => {
    // Ambil kode dari URL
    const parts = window.location.pathname.split("/");
    const kodeFromUrl = parts[parts.length - 1];

    if (kodeFromUrl) {
      // Simpan ke localStorage
      localStorage.setItem("pendingPresensiKode", kodeFromUrl);
      setKode(kodeFromUrl);
      console.log("Kode presensi disimpan:", kodeFromUrl);
    } else {
      console.warn("Tidak ada kode presensi di URL.");
    }
  }, []);

  useEffect(() => {
    if (!kode) return;

    const token = localStorage.getItem("token");

    // Jika belum login
    if (!token) {
      setLoading(false);
      setModalTitle("Login Diperlukan");
      setErrorMsg("Silakan login terlebih dahulu untuk melakukan presensi.");
      setIsModalOpen(true);

      // Simpan tujuan redirect setelah login
      localStorage.setItem("redirectAfterLogin", `/presensi/${kode}`);
      return;
    }

    // Jika sudah login, kirim presensi otomatis
    const submitPresensi = async () => {
      try {
        const res = await axios.post(
          `${API_BASE_URL}/presensi`,
          { kode: kode },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.data.success) {
          setStatus("Presensi berhasil dicatat!");
          localStorage.removeItem("pendingPresensiKode");
        } else {
          setStatus("Gagal mencatat presensi.");
          setModalTitle("Presensi Gagal");
          setErrorMsg(res.data.message || "Gagal mencatat presensi.");
          setIsModalOpen(true);
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          "Terjadi kesalahan saat mencatat presensi.";
        setStatus(msg);
        setModalTitle("Presensi Gagal");
        setErrorMsg(msg);
        setIsModalOpen(true);
      } finally {
        setLoading(false);
      }
    };

    submitPresensi();
  }, [kode]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      navigate("/user/activities");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 text-center">
      <h1 className="text-xl font-bold mb-2">Presensi Kegiatan</h1>
      {loading ? (
        <div className="flex flex-col items-center gap-2">
          <Loading variant="presensi" />
          <p className="text-gray-700">{status}</p>
        </div>
      ) : (
        <p className="text-gray-700">{status}</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={modalTitle}
        footer={
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Tutup
          </button>
        }
      >
        <p>{errorMsg}</p>
      </Modal>
    </div>
  );
}
