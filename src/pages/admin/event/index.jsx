import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { ArrowUpDown } from "lucide-react";
import AddEvent from "../../../components/AddEvent";
import Pagination from "../../../components/pagination";
import DeletePopup from "../../../components/Popup/Delete";

const AdminEvent = () => {
  const [eventData, setEventData] = useState([]);
  const [search, setSearch] = useState("");
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Daftar Acara" },
  ];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/events?per_page=100`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("📦 Response API:", res.data);
        const events = Array.isArray(res.data?.data?.data)
          ? res.data.data.data
          : [];

        setEventData(events);
      } catch (error) {
        console.error("❌ Gagal fetch event:", error);
        setError("Gagal mengambil data event");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  // === SEARCH ===
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const filteredData = eventData.filter((item) =>
    item.mdl_nama?.toLowerCase().includes(search.toLowerCase())
  );

  // === PAGINATION ===
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  // === DELETE ===
  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/events/${selectedEventId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEventData((prev) => prev.filter((item) => item.id !== selectedEventId));
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("❌ Gagal menghapus event:", err);
      alert("Gagal menghapus event!");
    }
  };

  // === SORT (dummy function, bisa diimplementasikan nanti) ===
  const handleSort = (field) => {
    console.log("Sort by:", field);
    // Implementasi sorting bisa ditambahkan di sini
  };

  // === TABLE COLUMNS ===
  const columns = [
    { 
      header: "No", 
      accessor: (row, i) => {
        const index = paginatedData.indexOf(row);
        return index === -1 ? '-' : ((currentPage - 1) * rowsPerPage) + index + 1;
      },
      className: "w-16 text-center" 
    },
    { header: "Nama Acara", accessor: (row) => row.mdl_nama || "-" },
    {
      header: "Tanggal Buka Pendaftaran",
      accessor: (row) =>
        row.mdl_pendaftaran_mulai
          ? new Date(row.mdl_pendaftaran_mulai).toLocaleDateString("id-ID")
          : "-",
    },
    { header: "Jenis Acara", accessor: (row) => row.mdl_kategori || "-" },
    {
      header: "Tanggal Acara",
      accessor: (row) =>
        row.mdl_acara_mulai
          ? new Date(row.mdl_acara_mulai).toLocaleDateString("id-ID")
          : "-",
    },
    {
      header: (
        <div
          onClick={() => handleSort("status")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Status <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => {
        const status = row.mdl_status || "unknown";
        const statusClass =
          status === "berlangsung"
            ? "bg-green-100 text-green-700"
            : status === "draft"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-gray-100 text-gray-700";
        return (
          <span className={`${statusClass} text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
            {status}
          </span>
        );
      },
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex justify-center items-center space-x-3">
          <Link to={`/admin/event/${row.id}`}>
            <button className="text-blue-500 hover:text-blue-700" title="Lihat">
              <FiEye size={18} />
            </button>
          </Link>
          <button
            onClick={() => console.log("Edit:", row.id)}
            className="text-yellow-500 hover:text-yellow-700"
            title="Edit"
          >
            <FiEdit size={18} />
          </button>
          <button
            onClick={() => {
              setSelectedEventId(row.id);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700"
            title="Hapus"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar role="admin" />
      <main className="flex-1 p-6 space-y-6 bg-gray-50">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-900">Daftar Acara</h1>
        </div>

        {/* Search + Button */}
        <div className="flex md:flex-row items-center md:space-x-4 mb-10">
          <div className="flex-1">
            <Search placeholder="Cari nama acara..." onSearch={handleSearchChange} />
          </div>
          <Link
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950"
            onClick={() => setIsAddEventOpen(true)}
          >
            Tambah Acara
          </Link>
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <Table columns={columns} data={paginatedData} />
          )}
          <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredData.length}
              onPageChange={setCurrentPage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={(val) => {
                setRowsPerPage(val);
                setCurrentPage(1);
              }}
            />
          </div>
        </section>

        <AddEvent isOpen={isAddEventOpen} onClose={() => setIsAddEventOpen(false)} />
        <DeletePopup
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
};

export default AdminEvent;