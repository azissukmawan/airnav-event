import React from 'react';

/**
 * Props:
 * - currentPage: Nomor halaman saat ini
 * - totalPages: Jumlah total halaman
 * - onPageChange: Fungsi callback (menerima nomor halaman baru)
 */
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  const baseClasses = "px-4 py-2 border border-gray-300 transition-colors";
  const activeClasses = "bg-blue-600 text-white border-blue-600";
  const defaultClasses = "bg-white text-blue-600 hover:bg-gray-100";
  const disabledClasses = "opacity-50 cursor-not-allowed bg-gray-50";

  return (
    <nav>
      <ul className="flex space-x-1">
        <li>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`${baseClasses} rounded-l-md ${currentPage === 1 ? disabledClasses : defaultClasses}`}
          >
            &laquo;
          </button>
        </li>

        {pageNumbers.map((number) => (
          <li key={number}>
            <button
              onClick={() => onPageChange(number)}
              className={`${baseClasses} ${currentPage === number ? activeClasses : defaultClasses}`}
            >
              {number}
            </button>
          </li>
        ))}

        <li>
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`${baseClasses} rounded-r-md ${currentPage === totalPages ? disabledClasses : defaultClasses}`}
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;