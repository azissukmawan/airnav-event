import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useWindowSize } from "react-use";
import { Wheel } from "react-custom-roulette";
import Confetti from "react-confetti";
import axios from "axios";
import Modal from "../../../components/modal";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import Breadcrumb from "../../../components/breadcrumb";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "../../../components/sidebar";

export default function EventWheel() {
  const navigate = useNavigate();
  const { id } = useParams(); // Ambil ID dari URL
  const { width, height } = useWindowSize();
  const token = localStorage.getItem("token");
  
  const [data, setData] = useState([]);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [winner, setWinner] = useState(null);
  const [newWinner, setNewWinner] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [winners, setWinners] = useState([]);
  const [eventTitle, setEventTitle] = useState("Loading...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Hanya peserta yang hadir tapi belum menang
  const wheelData = data.filter(
    (p) =>
      !winners.some(
        (w) => w.toLowerCase().trim() === p.option.toLowerCase().trim()
      )
  );

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara", link: `/admin/event/${id}` },
    { label: "Doorprize" },
  ];

  useEffect(() => {
    if (!token) {
      setError("Token tidak ditemukan. Silakan login ulang.");
      setLoading(false);
      return;
    }

    if (!id) {
      setError("ID Event tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchEventDetail = async () => {
      try {
        console.log("🔍 Fetching event detail untuk ID:", id);
        const res = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("📦 Event detail:", res.data);
        
        // Sesuaikan struktur response
        const eventData = res.data?.data?.data || res.data?.data;
        setEventTitle(eventData?.mdl_nama || "Judul tidak tersedia");
      } catch (err) {
        console.error("❌ Error fetching event detail:", err);
        setEventTitle("Judul tidak tersedia");
      }
    };

    const fetchParticipantsAndWinners = async () => {
      try {
        setLoading(true);
        console.log("🔍 Fetching participants & winners untuk event ID:", id);

        const [participantsRes, winnersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/admin/events/${id}/participants`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get(`${API_BASE_URL}/admin/events/${id}/winners`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        console.log("📦 Participants response:", participantsRes.data);
        console.log("📦 Winners response:", winnersRes.data);

        // Parse participants - cek berbagai struktur
        let participantsData = [];
        if (participantsRes.data?.data?.data) {
          participantsData = participantsRes.data.data.data;
        } else if (participantsRes.data?.data) {
          participantsData = participantsRes.data.data;
        } else if (Array.isArray(participantsRes.data)) {
          participantsData = participantsRes.data;
        }

        // Filter peserta yang hadir (cek berbagai field name)
        const hadirOnly = participantsData.filter((p) => {
          const status = p.status || p.status_kehadiran || p.hadir;
          return (
            status === "Hadir" ||
            status === "hadir" ||
            status === true ||
            p.hadir === true
          );
        });

        console.log("✅ Participants yang hadir:", hadirOnly.length);
        setData(hadirOnly.map((p) => ({ option: p.nama, id: p.id })));

        // Parse winners
        let winnersData = [];
        if (winnersRes.data?.data?.winners) {
          winnersData = winnersRes.data.data.winners;
        } else if (winnersRes.data?.data) {
          winnersData = Array.isArray(winnersRes.data.data)
            ? winnersRes.data.data
            : [];
        }

        console.log("✅ Winners:", winnersData.length);
        setWinners(winnersData.map((w) => w.name || w.nama));
      } catch (err) {
        console.error("❌ Error fetching data:", err);
        console.error("❌ Error response:", err.response?.data);
        
        if (err.response?.status === 403) {
          setError("Akses ditolak. Anda tidak memiliki izin untuk event ini.");
        } else if (err.response?.status === 404) {
          setError("Data tidak ditemukan.");
        } else {
          setError(err.response?.data?.message || "Gagal mengambil data.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
    fetchParticipantsAndWinners();
  }, [token, id]);

  const handleSpinClick = async () => {
    if (mustSpin || wheelData.length === 0) return;

    try {
      console.log("🎲 Drawing winner untuk event ID:", id);
      const response = await axios.post(
        `${API_BASE_URL}/admin/events/${id}/draw-winner`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📦 Winner response:", response.data);
      const winnerFromAPI = response.data.data.winner || response.data.data;

      // Cari index di wheelData (bukan data asli)
      const selectedIndex = wheelData.findIndex(
        (p) =>
          p.option.toLowerCase().trim() ===
          (winnerFromAPI.name || winnerFromAPI.nama).toLowerCase().trim()
      );

      if (selectedIndex === -1) {
        alert(
          `${winnerFromAPI.name || winnerFromAPI.nama} sudah menang sebelumnya atau tidak ada di wheel.`
        );
        return;
      }

      setPrizeNumber(selectedIndex);
      setNewWinner(winnerFromAPI.name || winnerFromAPI.nama);
      setMustSpin(true);
      setShowConfetti(false);
    } catch (err) {
      console.error("❌ Error drawing winner:", err);
      console.error("❌ Error response:", err.response?.data);
      alert(err.response?.data?.message || "Gagal melakukan undian.");
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    setWinner(newWinner);

    // Tambahkan ke daftar pemenang
    setWinners((prev) =>
      newWinner && !prev.includes(newWinner) ? [...prev, newWinner] : prev
    );

    setModalOpen(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex relative bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 p-6 mt-4 space-y-4 min-h-screen">
          <div className="flex items-center justify-center h-64">
            <p className="text-gray-500 text-lg">Memuat data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex relative bg-gray-50">
        <Sidebar role="admin" />
        <div className="flex-1 p-6 mt-4 space-y-4 min-h-screen">
          <Breadcrumb items={breadcrumbItems} />
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600 text-lg font-semibold mb-2">Error</p>
            <p className="text-red-500">{error}</p>
            <button
              onClick={() => navigate(`/admin/event/${id}`)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Kembali ke Detail Event
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0">
      <Sidebar role="admin" />
      <div className="flex-1 p-6 mt-4 space-y-4 min-h-screen">
        {showConfetti &&
          ReactDOM.createPortal(
            <div className="fixed inset-0 z-[9999] pointer-events-none">
              <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
                gravity={0.4}
                tweenDuration={800}
              />
            </div>,
            document.body
          )}

        <Breadcrumb items={breadcrumbItems} />

        <div className="flex flex-col mt-5">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-blue-900">Doorprize</h1>
          </div>
          <p className="text-gray-500 mt-2">{eventTitle}</p>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Roda */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full">
                  <Typography type="body" className="text-blue-700 font-medium">
                    {wheelData.length} Peserta Tersedia
                  </Typography>
                  <span className="text-gray-400">•</span>
                  <Typography type="body" className="text-gray-600">
                    {data.length} Total Hadir
                  </Typography>
                </div>
              </div>

              <div className="flex justify-center mb-8">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
                  <div className="relative w-[300px] sm:w-[360px] md:w-[420px] flex justify-center">
                    {wheelData.length > 0 ? (
                      <Wheel
                        mustStartSpinning={mustSpin}
                        prizeNumber={prizeNumber}
                        data={wheelData}
                        outerBorderColor={["#f2f2f2"]}
                        outerBorderWidth={[6]}
                        radiusLineColor={["#ffffff"]}
                        radiusLineWidth={[1]}
                        fontSize={13}
                        textColors={["#ffffff"]}
                        backgroundColors={[
                          "#F22B35",
                          "#F99533",
                          "#24CA69",
                          "#514E50",
                          "#46AEFF",
                          "#9145B7",
                        ]}
                        onStopSpinning={handleStopSpinning}
                      />
                    ) : (
                      <div className="text-center py-12">
                        <Typography type="body" className="text-gray-500">
                          {data.length === 0
                            ? "Tidak ada peserta yang hadir"
                            : "Semua peserta sudah menang"}
                        </Typography>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSpinClick}
                  disabled={mustSpin || wheelData.length === 0}
                  className={`px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform ${
                    mustSpin || wheelData.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl hover:scale-105"
                  }`}
                >
                  {mustSpin ? "Memutar..." : "Putar Sekarang"}
                </button>
              </div>
            </div>
          </div>

          {/* Daftar Pemenang */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-blue-800">
                  Daftar Pemenang
                </h3>
                {winners.length > 0 && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                    {winners.length}
                  </span>
                )}
              </div>

              {winners.length > 0 ? (
                <ul className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {winners.map((name, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow"
                    >
                      <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{name}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-12">
                  <Typography type="body" className="text-gray-400">
                    Belum ada pemenang
                  </Typography>
                  <Typography type="small" className="text-gray-400 mt-1">
                    Putar roda untuk memulai!
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Hasil Undian"
          footer={
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Tutup
            </Button>
          }
        >
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="text-6xl mb-4 animate-bounce">🎉</div>
            <Typography
              type="heading5"
              weight="semibold"
              className="text-gray-700 mb-3"
            >
              Selamat kepada
            </Typography>
            <Typography
              type="heading3"
              weight="bold"
              className="text-blue-700 mb-2"
            >
              {winner}
            </Typography>
            <div className="mt-4 px-6 py-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <Typography type="body" className="text-yellow-800 font-semibold">
                🏆 Pemenang Doorprize 🏆
              </Typography>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
}