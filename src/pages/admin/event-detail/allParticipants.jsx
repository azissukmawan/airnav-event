import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import Pagination from "../../../components/pagination";
import Breadcrumb from "../../../components/breadcrumb";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

const AllParticipants = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [participant, setParticipants] = useState([]);
  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${id}/all-participants`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserData(res.data.data || []);
        setLoading(false);
      } catch (err) {
        console.error("Gagal fetch peserta:", err);
      }
    };
    fetchParticipants();
  }, [id]);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara", link: `/admin/event/${id}` },
    { label: "Data Peserta", link: `/admin/event/${id}/allparticipants` },
  ];

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1);
  };

  // 🔹 Ambil inisial nama
  const getInitials = (name) => {
    if (!name) return "?";
    const parts = name.split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const getRandomColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-red-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const filteredData = userData.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.nama?.toLowerCase().includes(searchLower) ||
      item.email?.toLowerCase().includes(searchLower) ||
      item.no_whatsapp?.toLowerCase().includes(searchLower)
    );
  });

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  const columns = [
    {
      header: "No",
      accessor: (row) => {
        const index = paginatedData.indexOf(row);
        return (currentPage - 1) * rowsPerPage + index + 1;
      },
      className: "w-[5%] text-center",
    },

    {
      header: "Nama Peserta",
      accessor: (row) => row.nama || "-",
      className: "w-[25%] text-left font-medium",
    },
    {
      header: "No Whatsapp",
      accessor: (row) => row.no_whatsapp || "-",
      className: "w-[25%] text-left",
    },
    {
      header: "Email",
      accessor: (row) => (
        <div className="truncate max-w-[200px]" title={row.email}>
          {row.email || "-"}
        </div>
      ),
      className: "w-[30%] text-left",
    },
    {
      header: "Foto",
      accessor: (row) =>
        row.photo_profile ? (
          <img
            src={row.photo_profile}
            alt={row.nama}
            className="w-11 h-11 rounded-xl overflow-hidden object-cover border border-gray-200"
          />
        ) : (
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-semibold ${getRandomColor(
              row.nama || "?"
            )}`}
          >
            {getInitials(row.nama)}
          </div>
        ),
      className: "w-[10%] text-center",
    },
  ];

  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0 bg-gray-50 min-h-screen">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden pt-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="flex justify-between items-center mb-7">
          <div>
            <h1 className="text-4xl font-bold text-primary-70 mb-2">
              Daftar Peserta
            </h1>
            <h4 className=" text-gray-500">
              Menampilkan daftar peserta yang terdaftar dalam event
            </h4>
          </div>

          <div className="w-162">
            <Search
              placeholder="Cari nama, email, atau no whatsapp..."
              onSearch={handleSearchChange}
            />
          </div>
        </div>

        <section className="bg-white rounded-lg shadow-md p-6">
          {loading ? (
            <p className="text-center text-gray-500">Memuat data...</p>
          ) : error ? (
            <p className="text-center text-red-500">{error}</p>
          ) : filteredData.length === 0 ? (
            <p className="text-center text-gray-500">Tidak ada data peserta</p>
          ) : (
            <div className="overflow-x-auto w-full">
              <div className="min-w-[800px]">
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
                itemLabel="Peserta"
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AllParticipants;
