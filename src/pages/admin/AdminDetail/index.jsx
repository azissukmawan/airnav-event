import React, { useState } from "react";
import { Link } from "react-router-dom";
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

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara" },
  ];

  // Data broadcast / detail acara
  const broadcastData = {
    namaAcara: "Nama Acara",
    lokasi: "AirNav",
    tanggalMulaiPendaftaran: "2025-11-01",
    tanggalPenutupanPendaftaran: "2025-11-27",
    tanggalAcara: "2025-11-28",
    jamAcara: "09.00 - 17.00",
    modulAcara: "https://example.com/modul.pdf",
    susunanAcara: "Pembukaan, Sesi 1, Sesi 2",
    deskripsi: "Deskripsi acara",
  };

  // Data peserta
  const participants = [
    {
      id: 1,
      name: "Airnav",
      whatsapp: "081931284014",
      email: "Airnav@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      name: "Dayeuhkolot",
      whatsapp: "081983881730",
      email: "dayeuhkolot@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/45.jpg",
    },
    {
      id: 3,
      name: "Budi",
      whatsapp: "081234567890",
      email: "budi@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/20.jpg",
    },
    {
      id: 4,
      name: "Airnav",
      whatsapp: "081931284014",
      email: "Airnav@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/42.jpg",
    },
    {
      id: 5,
      name: "Dayeuhkolot",
      whatsapp: "081983881730",
      email: "dayeuhkolot@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/48.jpg",
    },
    {
      id: 6,
      name: "Budi",
      whatsapp: "081234567890",
      email: "budi@gmail.com",
      photo: "https://randomuser.me/api/portraits/men/50.jpg",
    },
  ];

  const filteredParticipants = participants.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  // Handlers modal peserta
  const handleOpenPreview = (participant) => {
    setSelectedParticipant(participant);
    setOpenPreview(true);
  };
  const handleClosePreview = () => {
    setOpenPreview(false);
    setSelectedParticipant(null);
  };

  // Handlers modal broadcast
  const handleOpenBroadcastForm = () => setOpenBroadcastForm(true);
  const handleCloseBroadcastForm = () => setOpenBroadcastForm(false);

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
              onSearch={(value) => setSearch(value)}
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
          <h2 className="text-xl font-semibold text-blue-900">Nama Acara</h2>
          <Link to="/InfoAcara">
            <p className="text-sm text-blue-900 mt-2 leading-relaxed">
              Lihat Detail Acara
            </p>
          </Link>
        </div>
        {/* Live Broadcast */}
        <div
          className="flex items-center gap-2 mt-4 mb-5 text-blue-900 bg-green-200 px-3 py-2 rounded-lg w-fit cursor-pointer"
          onClick={handleOpenBroadcastForm}
        >
          <Radio size={22} weight="fill" />
          <span className="text-sm font-medium">Live Broadcast Aktif</span>
        </div>

        {/* Card List */}
        <CardList participantsCount={participants.length} />

        {/* Table Participants */}
        <TableParticipants
          participants={filteredParticipants}
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

      {/* Broadcast Preview Modal */}
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
