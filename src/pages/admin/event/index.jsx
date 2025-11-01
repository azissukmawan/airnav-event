import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import { Bell } from "lucide-react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import AddEvent from "../../../components/AddEvent";
import Pagination from "../../../components/pagination";
import DeletePopup from "../../../components/Popup/Delete";

const AdminEvent = () => {
  const [search, setSearch] = useState("");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);

  // 🔹 Data awal event
  const initialData = [
    {
      id: 1,
      nama: "Rapat Koordinasi Tahunan",
      tglBuka: "01/10/2025",
      jenis: "Rapat",
      tglAcara: "10/10/2025",
      status: "Berlangsung",
      peserta: 120,
    },
    {
      id: 2,
      nama: "Pelatihan Manajemen Risiko",
      tglBuka: "03/10/2025",
      jenis: "Pelatihan",
      tglAcara: "15/10/2025",
      status: "Segera Hadir",
      peserta: 85,
    },
    {
      id: 3,
      nama: "Workshop Sistem Informasi",
      tglBuka: "05/10/2025",
      jenis: "Workshop",
      tglAcara: "18/10/2025",
      status: "Berakhir",
      peserta: 60,
    },
    {
      id: 4,
      nama: "Rapat Evaluasi Triwulan",
      tglBuka: "08/10/2025",
      jenis: "Rapat",
      tglAcara: "20/10/2025",
      status: "Segera Hadir",
      peserta: 45,
    },
    {
      id: 5,
      nama: "Sosialisasi Kebijakan Baru",
      tglBuka: "10/10/2025",
      jenis: "Sosialisasi",
      tglAcara: "22/10/2025",
      status: "Berlangsung",
      peserta: 90,
    },
    {
      id: 6,
      nama: "Rapat Pimpinan",
      tglBuka: "12/10/2025",
      jenis: "Rapat",
      tglAcara: "25/10/2025",
      status: "Berakhir",
      peserta: 30,
    },
    {
      id: 7,
      nama: "Seminar Keselamatan Penerbangan",
      tglBuka: "13/10/2025",
      jenis: "Seminar",
      tglAcara: "28/10/2025",
      status: "Segera Hadir",
      peserta: 200,
    },
  ];

  const [eventData, setEventData] = useState(initialData);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Daftar Acara" },
  ];

  // 🔹 Search handler
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // 🔹 Filtered data
  const filteredData = eventData.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  // 🔹 Pagination
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // 🔹 Delete action
  const handleDelete = () => {
    setEventData((prev) => prev.filter((item) => item.id !== selectedEventId));
    setIsDeleteOpen(false);
    setTimeout(() => setIsDeleteSuccess(true), 300);
  };

  const columns = [
    {
      header: "No",
      accessor: (row) => row.id,
      className: "w-16 text-center",
    },
    {
      header: "Nama Acara",
      accessor: (row) => row.nama,
      className: "text-left",
    },
    {
      header: (
        <div className="whitespace-normal">
          Tanggal Buka <br /> Pendaftaran
        </div>
      ),
      accessor: (row) => row.tglBuka,
    },
    { header: "Jenis Acara", accessor: (row) => row.jenis },
    { header: "Tanggal Acara", accessor: (row) => row.tglAcara },
    {
      header: "Status",
      accessor: (row) => {
        let statusClass = "";
        switch (row.status) {
          case "Berlangsung":
            statusClass = "bg-green-100 text-green-700";
            break;
          case "Segera Hadir":
            statusClass = "bg-yellow-100 text-yellow-700";
            break;
          case "Berakhir":
            statusClass = "bg-red-100 text-red-700";
            break;
          default:
            statusClass = "bg-gray-100 text-gray-600";
        }
        return (
          <span
            className={`${statusClass} text-xs font-semibold px-2.5 py-0.5 rounded-full`}
          >
            {row.status}
          </span>
        );
      },
    },
    {
      header: "Peserta",
      accessor: (row) => row.peserta,
      className: "text-center",
    },
    {
      header: "Aksi",
      className: "text-center",
      accessor: (row) => (
        <div className="flex justify-center items-center space-x-3">
          {/* VIEW DETAIL */}
          <Link to="/Admin/detail">
            <button
              onClick={() => console.log("View:", row.id)}
              className="text-blue-500 hover:text-blue-700 transition-colors"
              title="Lihat"
            >
              <FiEye size={18} />
            </button>
          </Link>

          {/* EDIT */}
          <Link to="/InfoAcara">
            <button
              onClick={() => console.log("Edit:", row.id)}
              className="text-yellow-500 hover:text-yellow-700 transition-colors"
              title="Edit"
            >
              <FiEdit size={18} />
            </button>
          </Link>

          {/* DELETE */}
          <button
            onClick={() => {
              setSelectedEventId(row.id);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700 transition-colors"
            title="Hapus"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" />

      <main className="flex-1 p-6  space-y-6 bg-gray-50 min-w-0">
        {/* Breadcrumb */}
        <div className="mt-4">
          <Breadcrumb items={breadcrumbItems} />
        </div>
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-900">Daftar Acara</h1>
          <button
            className="mt-1 mr-2 py-3 px-4 rounded-4xl bg-blue-100"
            onClick={() => console.log("Broadcast")}
          >
            <Bell />
          </button>
        </div>

        <p className="text-gray-500">
          Menampilkan Halaman Event dari Acara{" "}
          <span className="font-semibold italic">“Nama Acara”</span>
        </p>

        {/* Search & Button */}
        <div className="flex md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 mb-10 w-full">
          <div className="flex-1 w-full">
            <Search
              placeholder="Search nama acara..."
              onSearch={handleSearchChange}
            />
          </div>

          <Link
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
            onClick={() => setIsAddEventOpen(true)}
          >
            Tambah Acara
          </Link>
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="relative w-full overflow-x-auto rounded-lg border border-gray-200 admin-event-table">
            <Table columns={columns} data={paginatedData} />
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(value) => {
                setRowsPerPage(value);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        {/* Popup Add Event */}
        <AddEvent
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
        />

        {/* Popup Delete Confirm */}
        <DeletePopup
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />

        {/* Popup Delete Success */}
        {isDeleteSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mx-auto mb-3 text-green-500"
                width="48"
                height="48"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Berhasil!
              </h3>
              <p className="text-gray-600 mb-5">Data berhasil dihapus.</p>
              <button
                onClick={() => setIsDeleteSuccess(false)}
                className="px-6 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminEvent;
