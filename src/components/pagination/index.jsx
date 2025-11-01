import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Props:
 * - currentPage: Nomor halaman aktif
 * - totalPages: Jumlah total halaman
 * - totalItems: Jumlah total data
 * - onPageChange: Fungsi callback (terima nomor halaman baru)
 * - rowsPerPage: Jumlah data per halaman
 * - onRowsPerPageChange: Fungsi callback (terima jumlah baru)
 */

// Helper function untuk membuat logic pagination "..."
const getPaginationNumbers = (currentPage, totalPages) => {
  const pageNumbers = [];
  const maxPagesToShow = 5; // Tampilkan 5 nomor/ellipsis
  const sidePages = 1; // Selalu tampilkan 1 halaman di awal dan 1 di akhir

  if (totalPages <= maxPagesToShow + sidePages) {
    // Jika total halaman sedikit, tampilkan semua
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else {
    // Tampilkan halaman pertama
    pageNumbers.push(1);

    // Tampilkan ellipsis jika perlu (kiri)
    if (currentPage > sidePages + 2) {
      pageNumbers.push("...");
    }

    // Hitung halaman tengah
    let start = Math.max(2, currentPage - sidePages);
    let end = Math.min(totalPages - 1, currentPage + sidePages);

    if (currentPage <= sidePages + 2) {
      start = 2;
      end = 2 + maxPagesToShow - 3; // 1, 2, 3, 4, ..., 10
    } else if (currentPage >= totalPages - sidePages - 1) {
      start = totalPages - (maxPagesToShow - 3) - 1; // 1, ..., 7, 8, 9, 10
      end = totalPages - 1;
    }

    for (let i = start; i <= end; i++) {
      pageNumbers.push(i);
    }

    // Tampilkan ellipsis jika perlu (kanan)
    if (currentPage < totalPages - sidePages - 1) {
      pageNumbers.push("...");
    }

    // Tampilkan halaman terakhir
    pageNumbers.push(totalPages);
  }

  return pageNumbers;
};

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  rowsPerPage,
  onRowsPerPageChange,
}) => {
  const startItem = (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalItems || 0);

  // Gunakan helper function yang baru
  const pageNumbers = getPaginationNumbers(currentPage, totalPages);

  // 1. Ganti <div> pembungkus dengan <React.Fragment> atau <>
  return (
    <>
      {/* 2. Bagian kiri: Info & dropdown (disederhanakan) */}
      <div className="flex items-center gap-4 text-sm text-gray-700">
        {/* Info jumlah data */}
        <span className="text-gray-600">
          Showing <span className="font-semibold">{startItem}</span>–
          <span className="font-semibold">{endItem}</span> of{" "}
          <span className="font-semibold">{totalItems}</span> entries
        </span>

        {/* Dropdown jumlah data per halaman */}
        <div className="flex items-center space-x-2">
          <span className="text-gray-700">Show</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 text-blue-700 bg-white"
          >
            {[5, 10, 20, 50, 100].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Bagian kanan: Pagination (menggunakan logic baru) */}
      <nav className="flex items-center space-x-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
            currentPage === 1
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          <ChevronLeft size={16} /> Previous
        </button>

        {/* Mapping menggunakan logic baru */}
        {pageNumbers.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-3 py-1 text-gray-500 text-sm">
              ...
            </span>
          ) : (
            <button
              key={index}
              onClick={() => onPageChange(page)}
              className={`px-3 py-1 rounded-md font-medium text-sm ${
                currentPage === page
                  ? "bg-blue-600 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${
            currentPage === totalPages
              ? "text-gray-400 cursor-not-allowed"
              : "text-gray-700 hover:bg-gray-100"
          }`}
        >
          Next <ChevronRight size={16} />
        </button>
      </nav>
    </>
  );
};

export default Pagination;
