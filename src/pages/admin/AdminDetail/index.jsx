import React, { useEffect, useState, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import CardList from "../../../components/CardStatus/CardList";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import TableParticipants from "../../../components/TableParticipants";
import ParticipantPreview from "../../../components/ParticipantPreview";

const AdminDetail = () => {
  const { id } = useParams();
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [search, setSearch] = useState("");  
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(participants.length || 5); 


  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: eventData?.mdl_nama || "Informasi Acara" },
  ];

  // === HELPER: Tentukan status acara berdasarkan tanggal ===
  const getEventStatus = (startDate, endDate) => {
    if (!startDate) return { label: "-", color: "bg-gray-100 text-gray-700" };

    const today = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    if (today < start) {
      return { label: "Segera Hadir", color: "bg-yellow-100 text-yellow-700" };
    } else if (today >= start && today <= end) {
      return { label: "Berlangsung", color: "bg-green-100 text-green-700" };
    } else {
      return { label: "Berakhir", color: "bg-red-100 text-red-700" };
    }
  };

  useEffect(() => {
  if (participants.length > 0) {
    setRowsPerPage(participants.length);
  }
}, [participants]);

  // === FETCH EVENT DETAIL ===
  useEffect(() => {
    
    const fetchEventDetail = async () => {
      if (!id) {
        setLoadingEvent(false);
        return;
      }

      try {
        setLoadingEvent(true);
        const res = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const eventDetail =
          res.data?.data?.data || res.data?.data || res.data || null;

        setEventData(eventDetail);
      } catch (err) {
        console.error("Gagal mengambil detail event:", err);
        setError(err.response?.data?.message || err.message);
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
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/participants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const participantsData =
          res.data?.data?.data || res.data?.data || res.data || [];

        setParticipants(participantsData);
      } catch (err) {
        console.error("Gagal mengambil data peserta:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [id, token]);

  // === FETCH DOORPRIZE WINNERS ===
  useEffect(() => {
    const fetchWinners = async () => {
      if (!id) return;
      try {
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/winners`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // ambil array winners dari response
        const winnersData = res.data?.data?.winners || [];

        setWinners(Array.isArray(winnersData) ? winnersData : []);
      } catch (err) {
        if (err.response?.status === 404) {
          console.warn("Belum ada data pemenang untuk event ini");
          setWinners([]);
        } else {
          console.error("Gagal mengambil data pemenang:", err);
        }
      }
    };

    fetchWinners();
  }, [id, token]);

  // === FILTER & PAGINATION ===
  const filteredParticipants = useMemo(() => {
    if (!Array.isArray(participants)) return [];
    return participants.filter((p) =>
      p.nama?.toLowerCase().includes(search.toLowerCase())
    );
  }, [participants, search]);

  const sortedParticipants = useMemo(() => {
    return [...filteredParticipants].sort((a, b) => {
      if (eventData?.doorprize_active !== 1) return 0;

      const aWinner = winners.some(
        (w) => w.name?.trim().toLowerCase() === a.nama?.trim().toLowerCase()
      );
      const bWinner = winners.some(
        (w) => w.name?.trim().toLowerCase() === b.nama?.trim().toLowerCase()
      );
      return bWinner - aWinner;
    });
  }, [filteredParticipants, winners, eventData]);

  const currentTableData = useMemo(() => {
    const firstIndex = (currentPage - 1) * rowsPerPage;
    const lastIndex = firstIndex + rowsPerPage;
    return sortedParticipants.slice(firstIndex, lastIndex);
  }, [currentPage, sortedParticipants, rowsPerPage]);

  const totalPages = Math.ceil(sortedParticipants.length / rowsPerPage);

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
    <div className="flex-1 w-full lg:pl-52 pt-6 lg:pt-0">
      <Sidebar role="admin" />

      <div className="flex-1 p-6 mt-3 space-y-4">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col mt-5">
          <h1 className="text-4xl font-bold text-blue-900">Informasi Acara</h1>
          <p className="text-gray-500 mt-2">
            Menampilkan halaman peserta dari acara{" "}
            <span className="font-semibold italic">
              {loadingEvent
                ? "Loading..."
                : eventData?.mdl_nama || "Unknown Event"}
            </span>
          </p>
        </div>
        <div className="flex flex-row md:flex-col md:space-x-4 space-y-2 md:space-y-0 mb-10 w-full">
          <div className="flex-1 w-full">
            <Search
              placeholder="Cari nama peserta..."
              onSearch={handleSearchChange}
            />
          </div>
          {eventData?.mdl_doorprize_aktif === 1 && (
            <Link
              to={`/admin/event/doorprize/${id}`}
              className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
            >
              Doorprize
            </Link>
          )}
        </div>

        {/* Card Info Acara */}
        {loadingEvent ? (
          <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-full md:max-w-md lg:max-w-lg mb-10">
            <p className="text-gray-500">Loading event info...</p>
          </div>
        ) : eventData ? (
          <div className="bg-white p-6 rounded-xl shadow-sm w-full max-w-full md:max-w-md lg:max-w-lg mb-10">
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
                {(() => {
                  const status = getEventStatus(
                    eventData.mdl_acara_mulai,
                    eventData.mdl_acara_selesai
                  );
                  return (
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${status.color}`}
                    >
                      {status.label}
                    </span>
                  );
                })()}
              </p>
            </div>
            <Link to={`/admin/event/edit/${id}`}>
              <button className="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-200 hover:text-blue-950 text-sm text-blue-50 mt-4">
                Lihat Detail Lengkap
              </button>
            </Link>
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
            <CardList
              eventId={id}
              participants={participants}
              doorprizeActive={eventData?.mdl_doorprize_aktif === 1}
            />

            {/* Bungkus tabel dengan overflow-x-auto */}
            <div className="overflow-x-auto">
              <TableParticipants
                participants={currentTableData}
                winners={winners}
                onPreview={handleOpenPreview}
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={sortedParticipants.length}
                rowsPerPage={rowsPerPage}
                onPageChange={setCurrentPage}
                onRowsPerPageChange={handleRowsPerPageChange}
                doorprizeActive={eventData?.mdl_doorprize_aktif === 1}
              />
            </div>
          </>
        )}
      </div>

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
