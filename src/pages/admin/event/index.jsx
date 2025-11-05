import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";
import { ArrowUpDown } from "lucide-react";
import AddEvent from "../event-add";
import Pagination from "../../../components/pagination";
import Breadcrumb from "../../../components/breadcrumb";
import DeletePopup from "../../../components/pop-up/Delete";

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

  // sorting state
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/admin/events`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const events = res.data?.data?.data || res.data?.data || res.data || [];

        if (Array.isArray(events)) {
          setEventData(events);
        } else {
          console.warn("Data bukan array:", events);
          setEventData([]);
        }
      } catch (error) {
        console.error("Gagal fetch event:", error);
        setError("Gagal mengambil data event");
        setEventData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [token]);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Daftar Acara", link: "/admin/events" },
  ];

  // === SEARCH ===
  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // === SORT (Nama Acara & Status) ===
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // === Fungsi Hitung Status Berdasarkan Tanggal ===
  const getEventStatus = (start, end) => {
    const now = new Date();
    const startDate = new Date(start);
    const endDate = new Date(end);

    if (!start || !end)
      return { label: "Tidak Diketahui", color: "bg-gray-100 text-gray-700" };

    if (now >= startDate && now <= endDate) {
      return { label: "Berlangsung", color: "bg-green-100 text-green-700" };
    } else if (now < startDate) {
      return { label: "Segera Hadir", color: "bg-yellow-100 text-yellow-700" };
    } else {
      return { label: "Berakhir", color: "bg-red-100 text-red-700" };
    }
  };

  // === FILTER + SORT ===
  const filteredData = eventData
    .filter((item) =>
      item.mdl_nama?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortField) return 0;

      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }
      return 0;
    });

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
      setEventData((prev) =>
        prev.filter((item) => item.id !== selectedEventId)
      );
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Gagal menghapus event:", err);
      alert("Gagal menghapus event!");
    }
  };

  // === TABLE COLUMNS ===
  const columns = [
    {
      header: "No",
      accessor: (row, i) => {
        const index = paginatedData.indexOf(row);
        return index === -1 ? "-" : (currentPage - 1) * rowsPerPage + index + 1;
      },
      className: "w-[4%] text-center",
    },
    {
      header: (
        <div
          onClick={() => handleSort("mdl_nama")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Nama Acara <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => (
        <div className="line-clamp-2 break-words max-w-[330px]">
          {row.mdl_nama || "-"}
        </div>
      ),
      className: "w-[28%] text-left",
    },
    {
      header: "Pendaftaran",
      accessor: (row) =>
        row.mdl_pendaftaran_mulai
          ? new Date(row.mdl_pendaftaran_mulai).toLocaleDateString("id-ID")
          : "-",
      className: "w-[10%] whitespace-nowrap text-left",
    },
    {
      header: "Jenis Acara",
      accessor: (row) => row.mdl_kategori || "-",
      className: "w-[10%] whitespace-nowrap text-left",
    },
    {
      header: "Tanggal Acara",
      accessor: (row) =>
        row.mdl_acara_mulai
          ? new Date(row.mdl_acara_mulai).toLocaleDateString("id-ID")
          : "-",
      className: "w-[12%] whitespace-nowrap text-left",
    },
    {
      header: (
        <div
          onClick={() => handleSort("mdl_acara_mulai")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Status <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => {
        const status = getEventStatus(
          row.mdl_acara_mulai,
          row.mdl_acara_selesai
        );
        return (
          <span
            className={`${status.color} text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap`}
          >
            {status.label}
          </span>
        );
      },
      className: "w-[11%] text-left",
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <Link to={`/admin/event/${row.id}`}>
            <button className="text-blue-500 hover:text-blue-700" title="Lihat">
              <FiEye size={18} />
            </button>
          </Link>
          <Link to={`/admin/event/edit/${row.id}`}>
            <button
              className="text-yellow-500 hover:text-yellow-700"
              title="Edit"
            >
              <FiEdit size={18} />
            </button>
          </Link>
          <button
            onClick={() => {
              setSelectedEventId(row.id);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700 mb-1.5"
            title="Hapus"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      ),
      className: "w-[10%] text-left",
    },
  ];

  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 space-y-6 bg-gray-50 overflow-x-hidden">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-900">Daftar Acara</h1>
        </div>

        {/* Search + Button */}
        <div className="flex md:flex-row items-center md:space-x-4 mb-10">
          <div className="flex-1">
            <Search
              placeholder="Cari nama acara..."
              onSearch={handleSearchChange}
            />
          </div>
          <button
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950"
            onClick={() => setIsAddEventOpen(true)}
          >
            Tambah Acara
          </button>
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="min-w-[900px]">
                <Table columns={columns} data={paginatedData} />
              </div>
            </div>
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

        <AddEvent
          isOpen={isAddEventOpen}
          onClose={() => setIsAddEventOpen(false)}
        />
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
