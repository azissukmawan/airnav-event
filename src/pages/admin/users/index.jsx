import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import { FiTrash2 } from "react-icons/fi";
import { ArrowUpDown } from "lucide-react";
import Pagination from "../../../components/pagination";
import Breadcrumb from "../../../components/breadcrumb";
import DeletePopup from "../../../components/pop-up/Delete";

// Tabs
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

const AdminUser = () => {
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const [activeTab, setActiveTab] = useState("Semua");
  const tabItems = ["Semua", "Karyawan", "Non Karyawan", "Tidak Verifikasi"];

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUsers = async () => {
        setLoading(true);
        try {
        let url = `${API_BASE_URL}/admin/users`;

        if (activeTab === "Tidak Verifikasi") {
            url = `${API_BASE_URL}/admin/users-not-verified`;
        }

        const res = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const users = res.data?.data || [];

        if (Array.isArray(users)) {
            setUserData(users);
        } else {
            console.warn("Data bukan array:", users);
            setUserData([]);
        }
        } catch (error) {
        console.error("Gagal fetch users:", error);
        setError("Gagal mengambil data user");
        setUserData([]);
        } finally {
        setLoading(false);
        }
    };

    fetchUsers();
    }, [token, API_BASE_URL, activeTab]);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Daftar User", link: "/admin/users" },
  ];

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 1:
        return { label: "Karyawan", color: "bg-green-100 text-green-700" };
      case 0:
        return { label: "Non Karyawan", color: "bg-red-100 text-red-700" };
    }
  };

  const filteredData = userData
    .filter((item) => {
        if (activeTab === "Karyawan") {
        return item.detail_peserta?.status_karyawan === 1;
        } else if (activeTab === "Non Karyawan") {
        return item.detail_peserta?.status_karyawan === 0;
        } else if (activeTab === "Tidak Verifikasi") {
        return true;
        }
        return true;
    })
    .filter((item) => {
        const searchLower = search.toLowerCase();
        return (
        item.name?.toLowerCase().includes(searchLower) ||
        item.email?.toLowerCase().includes(searchLower) ||
        item.username?.toLowerCase().includes(searchLower)
        );
    })
    .sort((a, b) => {
        if (!sortField) return 0;

        let aVal = a[sortField];
        let bVal = b[sortField];

        if (sortField === "status_karyawan") {
        aVal = a.detail_peserta?.status_karyawan ?? 0;
        bVal = b.detail_peserta?.status_karyawan ?? 0;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (typeof aVal === "number" && typeof bVal === "number") {
        return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
        }

        return 0;
    });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${selectedUserId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData((prev) =>
        prev.filter((item) => item.id !== selectedUserId)
      );
      setIsDeleteOpen(false);
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      alert("Gagal menghapus user!");
    }
  };

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
          onClick={() => handleSort("name")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Nama<ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => (
        <div className="line-clamp-2 max-w-[330px]">
          {row.name || "-"}
        </div>
      ),
      className: "w-[25%] text-left",
    },
    {
      header: "Email",
      accessor: (row) => (
        <div className="truncate max-w-[200px]" title={row.email}>
          {row.email || "-"}
        </div>
      ),
      className: "w-[23%] text-left",
    },
    {
      header: (
        <div
          onClick={() => handleSort("status_karyawan")}
          className="flex items-center gap-2 cursor-pointer select-none hover:text-blue-700"
        >
          Status<ArrowUpDown size={14} />
        </div>
      ),
      accessor: (row) => {
        const status = getStatusLabel(row.detail_peserta?.status_karyawan);
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>
            {status.label}
          </span>
        );
      },
      className: "w-[12%] text-left",
    },
    {
      header: "No Telp",
      accessor: (row) => row.telp || "-",
      className: "w-[13%] whitespace-nowrap text-left",
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setSelectedUserId(row.id);
              setIsDeleteOpen(true);
            }}
            className="text-red-500 hover:text-red-700"
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
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Kelola Akun</h1>
            <h4 className="text-sm text-gray-500">
              Menampilkan Halaman Kelola Akun pada Sistem
            </h4>
          </div>

          {/* Search */}
          <div className="flex items-center space-x-4">
            <div className="w-147">
              <Search
                placeholder="Cari nama atau email..."
                onSearch={handleSearchChange}
              />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <EventTabs
            tabs={tabItems}
            activeTab={activeTab}
            onTabChange={(tab) => {
              setActiveTab(tab);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada data user</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="min-w-[900px]">
                <Table columns={columns} data={paginatedData} />
              </div>
            </div>
          )}

          {filteredData.length > 0 && (
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
                itemLabel="Akun"
              />
            </div>
          )}
        </section>

        <DeletePopup
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
        />
      </main>
    </div>
  );
};

export default AdminUser;