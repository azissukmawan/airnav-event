import React, { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import Table from "../../../components/table";
import Search from "../../../components/form/SearchBar";
import Breadcrumb from "../../../components/breadcrumb";
import { Bell } from "lucide-react";
import { FiEye, FiEdit, FiTrash2 } from "react-icons/fi";

const AdminEvent = () => {
  const [search, setSearch] = useState("");
  const [openBroadcastForm, setOpenBroadcastForm] = useState(false);

  const handleOpenBroadcastForm = () => setOpenBroadcastForm(true);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Daftar Acara" },
  ];

  const columns = [
    {
      header: "No",
      accessor: (row, i) => row.id,
      className: "w-16 text-center",
    },
    { header: "Nama Acara", accessor: (row) => row.nama },
    { header: "Tanggal Buka Pendaftaran", accessor: (row) => row.tglBuka },
    { header: "Tanggal Tutup Pendaftaran", accessor: (row) => row.tglTutup },
    { header: "Tanggal Acara", accessor: (row) => row.tglAcara },
    {
      header: "Status",
      accessor: (row) => (
        <span className="bg-green-100 text-green-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">
          {row.status}
        </span>
      ),
    },
    {
      header: "Peserta",
      accessor: (row) => row.peserta,
      className: "text-center",
    },
    {
      header: "Aksi",
      accessor: (row) => (
        <div className="flex justify-center gap-3 text-lg">
          <button className="text-blue-600 hover:text-blue-800">
            <FiEye />
          </button>
          <button className="text-yellow-600 hover:text-yellow-800">
            <FiEdit />
          </button>
          <button className="text-red-600 hover:text-red-800">
            <FiTrash2 />
          </button>
        </div>
      ),
      className: "w-24",
    },
  ];

  const rowData = {
    nama: "Rapat Airnav",
    tglBuka: "11/9/2025",
    tglTutup: "11/9/2025",
    tglAcara: "11/9/2025",
    status: "Aktif",
    peserta: 5,
  };

  const data = Array(12)
    .fill(rowData)
    .map((item, index) => ({
      ...item,
      id: index + 1,
      peserta: index === 1 ? 4 : 5,
    }));

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 mt-4 space-y-6 bg-gray-50">
        {/* Breadcrumb */}
        <Breadcrumb items={breadcrumbItems} />
        {/* Header: Title + Notification */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-900">Daftar Acara</h1>
          <button
            className="mt-1 mr-2 py-3 px-4 rounded-4xl bg-blue-100"
            onClick={handleOpenBroadcastForm}
          >
            <Bell />
          </button>
        </div>{" "}
        <p className="text-gray-500 ">
          Menampilkan Halaman Event dari Acara{" "}
          <span className="font-semibold italic">“Nama Acara”</span>
        </p>
        <div className="flex md:flex-row items-center md:space-x-4 space-y-2 md:space-y-0 mb-10 w-full">
          <div className="flex-1 w-full">
            <Search
              placeholder="Search nama peserta..."
              onSearch={(value) => setSearch(value)}
            />
          </div>

          <Link
            to="/TambahAcara"
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
          >
            Tambah Acara
          </Link>
        </div>
        {/* Table */}
        <section className="bg-white rounded-lg shadow-md p-6">
          <div className="overflow-x-auto admin-event-table">
            <style>{`
              .admin-event-table table,
              .admin-event-table table th,
              .admin-event-table table td {
                text-align: center !important;
                vertical-align: middle !important;
              }
            `}</style>
            <Table columns={columns} data={data} />
          </div>

          {/* Pagination */}
          <div className="flex justify-end items-center mt-6 pt-4 border-t border-gray-200">
            <nav className="flex items-center gap-2 text-sm">
              <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded">
                &lt; Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-600 text-white font-medium">
                1
              </button>
              <button className="px-3 py-1 rounded-md text-gray-700 hover:bg-gray-100 font-medium">
                2
              </button>
              <button className="text-gray-600 hover:text-gray-800 px-3 py-1 rounded">
                Next &gt;
              </button>
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminEvent;
