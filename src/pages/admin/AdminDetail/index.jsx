import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import Sidebar from "../../../components/sidebar";
import CardList from "../../../components/CardStatus/CardList";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import TableParticipants from "../../../components/TableParticipants";
import ParticipantPreview from "../../../components/ParticipantPreview";
import { Bell, Radio } from "lucide-react";

const AdminDetail = () => {
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [openBroadcastForm, setOpenBroadcastForm] = useState(false);
  const [search, setSearch] = useState("");
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara" },
  ];

  const broadcastData = {
    namaAcara: "Pelatihan Digitalisasi Airnav",
    success: true,
    data: [],
  };

  // === FETCH PARTICIPANTS ===
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/admin/events/2/participants`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
        });
        console.log("📦 Data peserta dari API:", res.data);

        // Sesuaikan dengan respon API
        setParticipants(res.data.data || []);
      } catch (err) {
        console.error("❌ Gagal mengambil data peserta:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, []);

  // === FILTER PARTICIPANTS ===
  const filteredParticipants = useMemo(() => {
    return participants.filter((p) =>
      p.nama.toLowerCase().includes(search.toLowerCase())
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

  const handleOpenBroadcastForm = () => setOpenBroadcastForm(true);
  const handleCloseBroadcastForm = () => setOpenBroadcastForm(false);

  // === RENDER ===
  return (
    <div className="min-h-screen flex relative bg-gray-50">
      <Sidebar role="admin" />

      <div className="flex-1 p-6 mt-4 space-y-4 min-h-screen">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />

        {/* Header */}
        <div className="flex flex-col mt-5">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-blue-900">
              Informasi Acara
            </h1>
            <button
              className="mt-1 mr-2 py-3 px-4 rounded-4xl bg-blue-100"
              onClick={handleOpenBroadcastForm}
            >
              <Bell />
            </button>
          </div>
          <p className="text-gray-500 mt-2">
            Menampilkan Halaman Peserta dari Acara{" "}
            <span className="font-semibold italic">
              {broadcastData.namaAcara}
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
            to="/admin/doorprize"
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
          >
            Doorprize
          </Link>
        </div>

        {/* Card Info Acara */}
        <div className="bg-white p-8 rounded-xl shadow-sm max-w-md mb-5 w-full">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Nama Acara
          </h2>
          <Link to="/InfoAcara">
            <button className="px-3 py-2 rounded-xl bg-blue-900 hover:bg-blue-200 hover:text-blue-950 text-sm text-blue-50 mt-2 leading-relaxed">
              Lihat Detail Acara
            </button>
          </Link>
        </div>

        {/* Card List */}
        <CardList participants={participants} />

        {/* Table Participants */}
        <TableParticipants
          participants={currentTableData}
          onPreview={handleOpenPreview}
        />
      </div>

      {/* Participant Preview Modal */}
      {openPreview && selectedParticipant && (
        <ParticipantPreview
          isOpen={openPreview}
          onClose={handleClosePreview}
          data={selectedParticipant}
        />
      )}

      {/* Broadcast Modal */}
      {openBroadcastForm && (
        <ParticipantPreview
          isOpen={openBroadcastForm}
          onClose={handleCloseBroadcastForm}
          data={broadcastData}
        />
      )}
    </div>
  );
};

export default AdminDetail;