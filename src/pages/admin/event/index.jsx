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

// === KOMPONEN TABS BARU ===
const EventTabs = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onTabChange(tab)}
          className={`
            px-5 py-2 font-semibold text-sm rounded-lg
            ${
              activeTab === tab
                ? "bg-primary text-white shadow-md"
                : "bg-gray-200 text-gray-900 hover:bg-gray-300"
            }
            focus:outline-none transition-all duration-200 whitespace-nowrap
          `}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};
// === END KOMPONEN TABS ===

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

  // === STATE BARU UNTUK TABS ===
  const [activeTab, setActiveTab] = useState("Semua");
  // Daftar tab sesuai desain
  const tabItems = ["Semua", "Draft", "Publish", "Selesai", "Archive"];

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
    let order = sortOrder;
    if (sortField === field) {
      order = sortOrder === "asc" ? "desc" : "asc";
      setSortOrder(order);
    } else {
      setSortField(field);
      order = "asc";
      setSortOrder(order);
    }

    const sortedData = [...eventData].sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      // jika field berupa tanggal
      if (
        aValue &&
        bValue &&
        !isNaN(Date.parse(aValue)) &&
        !isNaN(Date.parse(bValue))
      ) {
        return order === "asc"
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }

      // default (string/angka biasa)
      if (aValue < bValue) return order === "asc" ? -1 : 1;
      if (aValue > bValue) return order === "asc" ? 1 : -1;
      return 0;
    });

    setEventData(sortedData);
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
      return { label: "Selesai", color: "bg-red-100 text-red-700" };
    }
  };

  // === FILTER (Tab + Search) + SORT ===
  const filteredData = eventData
    // --- TAHAP 1: FILTER BERDASARKAN TAB ---
    .filter((item) => {
      // Jika tab "Semua", tampilkan semua data
      if (activeTab === "Semua") {
        return true;
      }

      // Ambil status publikasi dari item, ubah ke lowercase agar mudah dicocokkan
      const itemStatus = (item.mdl_status || "").toString().toLowerCase();
      const tabKey = activeTab.toLowerCase();

      // Logika pencocokan (disesuaikan dengan logika di kolom "Publikasi" Anda)
      if (tabKey === "publish") {
        // Tab "Archive" mungkin cocok dengan data "archive" atau "archived"
        return itemStatus.includes("active") || itemStatus.includes("active");
      }
      if (tabKey === "archive") {
        // Tab "Archive" mungkin cocok dengan data "archive" atau "archived"
        return (
          itemStatus.includes("archive") || itemStatus.includes("archived")
        );
      }
      if (tabKey === "selesai") {
        // Asumsi: Tab "Selesai" cocok dengan data "closed"
        return itemStatus.includes("closed");
      }

      // Untuk tab lain (Draft, Active, Publish), gunakan pencocokan langsung
      // .includes() lebih aman daripada === (misal: "active" akan cocok dengan "active")
      return itemStatus.includes(tabKey);
    })
    // --- TAHAP 2: FILTER BERDASARKAN SEARCH (NAMA ACARA) ---
    .filter((item) =>
      item.mdl_nama?.toLowerCase().includes(search.toLowerCase())
    )
    // --- TAHAP 3: SORTING ---
    .sort((a, b) => {
      if (!sortField) return 0;

      const aVal = a[sortField] || "";
      const bVal = b[sortField] || "";

      // Pindahkan logika sorting tanggal Anda yang lebih baik dari handleSort ke sini
      if (
        aVal &&
        bVal &&
        !isNaN(Date.parse(aVal)) &&
        !isNaN(Date.parse(bVal))
      ) {
        return sortOrder === "asc"
          ? new Date(aVal) - new Date(bVal)
          : new Date(bVal) - new Date(aVal);
      }

      // Fallback untuk string/angka
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
    // NAMA
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
      className: "w-[25%] text-left",
    },
    // TANGGAL DAFTAR
    {
      header: (
        <div
          onClick={() => handleSort("mdl_pendaftaran_mulai")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Pendaftaran <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) =>
        row.mdl_pendaftaran_mulai
          ? new Date(row.mdl_pendaftaran_mulai).toLocaleDateString("id-ID")
          : "-",

      className: "w-[14%] text-left",
    },

    // {
    //   header: "Pendaftaran",
    //   accessor: (row) =>
    //     row.mdl_pendaftaran_mulai
    //       ? new Date(row.mdl_pendaftaran_mulai).toLocaleDateString("id-ID")
    //       : "-",
    //   className: "w-[10%] whitespace-nowrap text-left",
    // },
    // JENIS ACARA
    {
      header: "Jenis Acara",
      accessor: (row) => {
        const val = row.mdl_kategori || "";
        if (!val) return "-";
        // Capitalize first letter of each word
        return val
          .toString()
          .split(" ")
          .map((w) =>
            w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""
          )
          .join(" ");
      },
      className: "w-[10%] whitespace-nowrap text-left",
    },
    // TANGGAL ACARA
    {
      header: (
        <div
          onClick={() => handleSort("mdl_acara_mulai")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Pelaksanaan <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) =>
        row.mdl_acara_mulai
          ? new Date(row.mdl_acara_mulai).toLocaleDateString("id-ID")
          : "-",

      className: "w-[10%] text-left",
    },
    // STATUS
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
            className={`${status.color} inline-flex items-center text-sm font-medium px-3 py-1 rounded-md whitespace-nowrap`}
            style={{ minWidth: 90, justifyContent: "center" }}
          >
            {status.label}
          </span>
        );
      },
      className: "w-[11%] text-left",
    },
    // PUBLIKASI
    {
      header: (
        <div
          onClick={() => handleSort("mdl_status")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Publikasi <ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => {
        const raw = row.mdl_status ?? "";
        if (!raw) return "-";
        
        // Map status values to display text
        let displayText = raw.toString();
        if (displayText.toLowerCase().includes("active")) {
          displayText = "Publish";
        }

        const label = displayText
          .split(" ")
          .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : ""))
          .join(" ");

        const key = raw.toString().toLowerCase();
        const color =
          key.includes("active") || key === "active"
            ? "bg-blue-900 text-white"  // Keep original color for "active"/"publish"
            : key.includes("draft")
            ? "bg-white-100 text-gray-700 outline-gray-700 outline"
            : key.includes("archived") || key.includes("archive")
            ? "bg-gray-700 text-white"
            : key.includes("closed")
            ? "bg-gray-400 text-white"
            : "bg-blue-100 text-blue-700";

        return (
          <span
            className={`${color} inline-flex items-center text-sm font-medium px-3 py-1 rounded-md whitespace-nowrap`}
            style={{ minWidth: 90, justifyContent: "center" }}
          >
            {label}
          </span>
        );
      },
      className: "w-[11%] text-left",
    },
    // AKSI
    {
      header: "Aksi",
      accessor: (row) => {
        // Check if publication status is "active" (shown as "Publish")
        const isPublished = row.mdl_status?.toLowerCase().includes('active');
        
        return (
          <div className="flex items-center gap-3">
            <Link to={`/admin/event/${row.id}`}>
              <button className="text-blue-500 hover:text-blue-700" title="Lihat">
                <FiEye size={18} />
              </button>
            </Link>
            
            {isPublished ? (
              // Disabled edit button for published events
              <button
                className="text-gray-400 cursor-not-allowed"
                title="Tidak dapat mengedit acara yang sudah dipublish"
                disabled
              >
                <FiEdit size={18} />
              </button>
            ) : (
              // Normal edit button for non-published events
              <Link to={`/admin/event/edit/${row.id}`}>
                <button
                  className="text-yellow-500 hover:text-yellow-700"
                  title="Edit"
                >
                  <FiEdit size={18} />
                </button>
              </Link>
            )}

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
        );
      },
      className: "w-[10%] text-left",
    },
  ];

  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 space-y-6 bg-gray-50 overflow-x-hidden">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Daftar Acara</h1>
            <h4 className="text-sm text-gray-500">
              Menampilkan Halaman Event Acara
            </h4>
          </div>

          {/* Search + Button */}
          <div className="flex items-center space-x-4">
            <div className="w-96">
              <Search
                placeholder="Cari nama acara..."
                onSearch={handleSearchChange}
              />
            </div>
            <button
              className="px-8 py-3 rounded-2xl font-semibold bg-blue-600 text-blue-50 hover:bg-blue-900 hover:text-blue-950"
              onClick={() => setIsAddEventOpen(true)}
            >
              Tambah Acara
            </button>
          </div>
        </div>
        {/* === BAGIAN TABS BARU === */}
        <div className="mb-6">
          <EventTabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1); // Reset ke halaman 1 setiap ganti tab
            }}
          />
        </div>
        {/* === END BAGIAN TABS === */}
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
