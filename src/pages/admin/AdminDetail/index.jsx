import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import CardList from "../../../components/CardStatus/CardList";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import TableParticipants from "../../../components/TableParticipants";
import ParticipantPreview from "../../../components/ParticipantPreview";
import Modal from "../../../components/modal";
import Dropdown from "../../../components/form/Dropdown";
import { X } from "lucide-react";

const AdminDetail = () => {
  const { id } = useParams();
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [search, setSearch] = useState("");
  const [participants, setParticipants] = useState([]);
  const [eventData, setEventData] = useState(null); // Data event dari API
  const [loading, setLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState(null);
  const [userIds, setUserIds] = useState([]);
  const [winners, setWinners] = useState([]);

  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleInvite = async () => {
    try {
      setInviteLoading(true);
      setInviteError(null);

      // normalisasi: ambil angka + filter invalid (NaN)
      const idsArray = userIds
        .map((u) => Number(u.id))
        .filter((v) => Number.isFinite(v));

      console.log("🧩 userIds (raw):", userIds);
      console.log("🧩 idsArray (normalized):", idsArray);

      if (!idsArray.length) {
        setInviteError("Pilih minimal 1 peserta untuk diundang.");
        setInviteLoading(false);
        return;
      }

      // Pre-check: pastikan semua id ada di daftar users (frontend)
      // (users adalah state yang berisi daftar user dari API /admin/users)
      const missing = idsArray.filter(
        (id) => !users.some((u) => Number(u.id) === id)
      );
      if (missing.length) {
        setInviteError(
          `ID peserta berikut tidak valid atau tidak ditemukan: ${missing.join(
            ", "
          )}`
        );
        setInviteLoading(false);
        return;
      }

      // siap kirim ke server
      const payload = { user_ids: idsArray };
      console.log("📤 Mengirim payload:", payload);

      const res = await axios.post(
        `${API_BASE_URL}/events/${id}/daftar-invite`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log("📥 Response invite:", res.data);
      alert("Peserta berhasil diundang!");
      setInviteOpen(false);
      setUserIds([]); // reset ke array, bukan string
    } catch (err) {
      console.error("❌ Gagal invite peserta:", err);

      // Tampilkan pesan validasi dari backend bila ada (struktur Laravel biasanya di err.response.data.errors)
      const beMessage =
        err.response?.data?.message ||
        (err.response?.data?.errors &&
          JSON.stringify(err.response.data.errors)) ||
        err.message;

      setInviteError(beMessage);
    } finally {
      setInviteLoading(false);
    }
  };

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: eventData?.mdl_nama || "Informasi Acara" },
  ];

  // === FETCH EVENT DETAIL ===
  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/winners`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("📦 Winners:", res.data);

        // normalisasi: array of objects dengan id dan nama
        const winnersArray = res.data?.data?.winners || [];
        setWinners(winnersArray);
      } catch (err) {
        console.error("❌ Gagal fetch winners:", err);
        setWinners([]);
      }
    };

    if (id) fetchWinners();

    const fetchEventDetail = async () => {
      if (!id) {
        console.log("⚠️ ID tidak ditemukan");
        setLoadingEvent(false);
        return;
      }

      try {
        setLoadingEvent(true);
        console.log("🔍 Fetching event detail untuk ID:", id);

        const res = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Event detail dari API:", res.data);

        // Sesuaikan struktur response
        let eventDetail = null;
        if (res.data?.data?.data) {
          eventDetail = res.data.data.data;
        } else if (res.data?.data) {
          eventDetail = res.data.data;
        }

        console.log("✅ Event data yang diset:", eventDetail);
        setEventData(eventDetail);
      } catch (err) {
        console.error("❌ Gagal mengambil detail event:", err);
        console.error("❌ Error response:", err.response);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchEventDetail();
  }, [id, token]);

  // === FETCH PARTICIPANTS ===
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!id) {
        console.log("⚠️ ID tidak ditemukan");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔍 Fetching participants untuk event ID:", id);

        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/participants`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("📦 Response lengkap:", res);
        console.log("📦 Data peserta dari API:", res.data);

        // Cek berbagai kemungkinan struktur response
        let participantsData = [];

        if (res.data?.data?.data) {
          participantsData = res.data.data.data;
        } else if (res.data?.data) {
          participantsData = res.data.data;
        } else if (Array.isArray(res.data)) {
          participantsData = res.data;
        }

        console.log("✅ Participants yang diset:", participantsData);
        setParticipants(participantsData);
      } catch (err) {
        console.error("❌ Gagal mengambil data peserta:", err);
        console.error("❌ Error response:", err.response);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id, token]);

  // === FILTER PARTICIPANTS ===
  const filteredParticipants = useMemo(() => {
    if (!Array.isArray(participants)) return [];
    return participants.filter((p) =>
      p.nama?.toLowerCase().includes(search.toLowerCase())
    );
  }, [participants, search]);

  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * rowsPerPage;
    const lastPageIndex = firstPageIndex + rowsPerPage;
    return filteredParticipants.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredParticipants, rowsPerPage]);

  const totalPages = Math.ceil(filteredParticipants.length / rowsPerPage);

  // === HANDLERS ===
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (value) => {
    setRowsPerPage(value);
    setCurrentPage(1);
  };

  const handleOpenPreview = (participant) => {
    setSelectedParticipant(participant);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedParticipant(null);
  };

  // === RENDER ===
  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-00">
      <Sidebar role="admin" />

      <div className="flex-1 p-6 mt-3 space-y-4 min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col mt-5">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-blue-900">
              Informasi Acara
            </h1>
          </div>
          <p className="text-gray-500 mt-2">
            Menampilkan Halaman Peserta dari Acara{" "}
            <span className="font-semibold italic">
              {loadingEvent
                ? "Loading..."
                : eventData?.mdl_nama || "Unknown Event"}
            </span>
          </p>
        </div>

        {/* Search + Doorprize */}
        <div className="flex md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 mb-10 w-full">
          <div className="flex-1 w-full">
            <Search
              placeholder="Search nama peserta..."
              onSearch={handleSearchChange}
            />
          </div>
          <Link
            to={`/admin/event/doorprize/${id}`}
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
          >
            Doorprize
          </Link>
        </div>

        {/* Card Info Acara */}
        {loadingEvent ? (
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-10 w-full">
            <p className="text-gray-500">Loading event info...</p>
          </div>
        ) : eventData ? (
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-10 w-full">
            <h2 className="text-xl font-semibold text-blue-900 mb-2">
              {eventData.mdl_nama}
            </h2>
            <div className="text-sm text-gray-600 space-y-1 mt-3">
              <p>
                <span className="font-medium">Kategori:</span>{" "}
                {eventData.mdl_kategori || "-"}
              </p>
              <p>
                <span className="font-medium">Lokasi:</span>{" "}
                {eventData.mdl_lokasi || "-"}
              </p>
              <p>
                <span className="font-medium">Tanggal:</span>{" "}
                {eventData.mdl_acara_mulai
                  ? new Date(eventData.mdl_acara_mulai).toLocaleDateString(
                      "id-ID"
                    )
                  : "-"}
              </p>
              <p>
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    eventData.mdl_status === "berlangsung"
                      ? "bg-green-100 text-green-700"
                      : eventData.mdl_status === "draft"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {eventData.mdl_status || "-"}
                </span>
              </p>
            </div>
            <Link to={`/admin/event/edit/${id}`}>
              <button className="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-200 hover:text-blue-950 text-sm text-blue-50 mt-4 leading-relaxed">
                Lihat Detail Lengkap
              </button>
            </Link>
            {/* <button
              onClick={() => setInviteOpen(true)}
              className="ms-2 px-3 py-2 rounded-xl bg-green-700 hover:bg-green-200 hover:text-green-950 text-sm text-green-50 mt-4 leading-relaxed"
            >
              Invite Peserta
            </button> */}
            <Modal
              isOpen={inviteOpen}
              onClose={() => setInviteOpen(false)}
              title="Invite Peserta"
              className="overflow-visible z-50"
              footer={
                <>
                  <button
                    onClick={() => setInviteOpen(false)}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    onClick={handleInvite}
                    disabled={inviteLoading}
                    className="px-4 py-2 rounded-lg bg-green-700 text-white hover:bg-green-800 disabled:opacity-50"
                  >
                    {inviteLoading ? "Mengundang..." : "Kirim Undangan"}
                  </button>
                </>
              }
            >
              <p className="text-sm text-gray-600 mb-3">
                Pilih peserta yang ingin diundang.
              </p>

              {/* Dropdown Multiple Search */}
              <Dropdown
                type="search"
                label="Cari peserta..."
                options={participants.map((p) => ({
                  value: p.id,
                  label: p.nama,
                }))}
                className="relative z-[9999]"
                variant="white"
                onSelect={(value) => {
                  const selected = participants.find((p) => p.id === value);
                  if (selected && !userIds.some((u) => u.id === value)) {
                    setUserIds([...userIds, selected]);
                  }
                }}
              />

              {/* List user terpilih */}
              {userIds.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {userIds.map((u) => (
                    <div
                      key={u.id}
                      className="flex items-center gap-2 bg-primary-10 text-primary rounded-full px-3 py-1 text-sm"
                    >
                      {u.nama}
                      <button
                        onClick={() =>
                          setUserIds(userIds.filter((x) => x.id !== u.id))
                        }
                        className="hover:text-red-500 transition"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {inviteError && (
                <p className="text-red-500 text-sm mt-2">{inviteError}</p>
              )}
            </Modal>
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-10 w-full">
            <p className="text-red-500">Failed to load event data</p>
          </div>
        )}

        {/* Loading & Error State */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Memuat data peserta...</p>
          </div>
        ) : error ? (
          <div className="text-center py-10">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : (
          <>
            {/* Card List */}
            <CardList eventId={id} participants={participants} />

            {/* Table Participants */}
            <TableParticipants
              participants={currentTableData}
              onPreview={handleOpenPreview}
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredParticipants.length}
              rowsPerPage={rowsPerPage}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={handleRowsPerPageChange}
            />
          </>
        )}
      </div>

      {/* Participant Preview Modal */}
      {openPreview && selectedParticipant && (
        <ParticipantPreview
          isOpen={openPreview}
          onClose={handleClosePreview}
          data={selectedParticipant}
        />
      )}
    </div>
  );
};

export default AdminDetail;
