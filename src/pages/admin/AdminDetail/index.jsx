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
  const [eventData, setEventData] = useState(null); // Data event dari API
  const [loading, setLoading] = useState(true);
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: eventData?.mdl_nama || "Informasi Acara" },
  ];

  // === FETCH EVENT DETAIL ===
  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!id) {
        console.log("⚠️ ID tidak ditemukan");
        setLoadingEvent(false);
        return;
      }

      try {
        setLoadingEvent(true);
        console.log("🔍 Fetching event detail untuk ID:", id);
        
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        
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
    <div className="min-h-screen flex relative bg-gray-50">
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
              {loadingEvent ? "Loading..." : (eventData?.mdl_nama || "Unknown Event")}
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
              <p><span className="font-medium">Kategori:</span> {eventData.mdl_kategori || "-"}</p>
              <p><span className="font-medium">Lokasi:</span> {eventData.mdl_lokasi || "-"}</p>
              <p><span className="font-medium">Tanggal:</span> {eventData.mdl_acara_mulai ? new Date(eventData.mdl_acara_mulai).toLocaleDateString("id-ID") : "-"}</p>
              <p><span className="font-medium">Status:</span> <span className={`px-2 py-1 rounded text-xs ${
                eventData.mdl_status === "berlangsung" ? "bg-green-100 text-green-700" : 
                eventData.mdl_status === "draft" ? "bg-yellow-100 text-yellow-700" : 
                "bg-gray-100 text-gray-700"
              }`}>{eventData.mdl_status || "-"}</span></p>
            </div>
            <Link to={`/admin/event/edit/${id}`}>
              <button className="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-200 hover:text-blue-950 text-sm text-blue-50 mt-4 leading-relaxed">
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