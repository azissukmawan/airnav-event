import React from 'react';
import PropTypes from 'prop-types'; // Baik untuk ditambahkan

// ========================================================================
// CSS UNTUK TABEL RESPONSIVE (DIHAPUS)
// ========================================================================
// ... Blok CSS kustom 'responsiveTableStyle' telah dihapus ...


/**
 * Props:
 * - columns: Array of objects (e.g., [{ header: 'Nama', accessor: (row) => row.nama }])
 * - data: Array of objects (e.g., [{ nama: 'Budi', umur: 20 }])
 */
const Table = ({ columns, data }) => {
  return (
    // 1. Tag <style> dan Fragment (<>) dihapus.
    // 2. Mengganti 'overflow-hidden' menjadi 'overflow-x-auto'
    <div className="shadow-md rounded-lg overflow-x-auto mx-4 md:mx-0">
      
      {/* 3. Menghapus 'responsive-table' dari className */}
      <table className="w-full table-auto">
        
        {/* === HEADER (DIUBAH) === */}
        {/* ... (kode header Anda tidak berubah) ... */}
        <thead className="text-sm text-blue-800 bg-sky-100">
          <tr>
            {columns.map((col, index) => (
              // Mengganti padding py-3 ke py-4 dan menghapus 'uppercase'
              <th key={index} className="px-6 py-4 text-left font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        {/* === BODY (DIUBAH) === */}
        {/* ... (kode body Anda tidak berubah) ... */}
        <tbody className="bg-white">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              // Menambahkan 'border-b' dan 'hover'
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-50">
                {columns.map((col, colIndex) => (
                  // 4. Menghapus atribut 'data-label'
                  <td 
                    key={colIndex} 
                    className="px-6 py-4 text-gray-800 whitespace-nowrap"
                  >
                    {/* === PERUBAHAN LOGIKA PENTING ===
                      Mengubah dari row[col.accessor] menjadi col.accessor(row)
                      Ini WAJIB agar bisa merender tombol dan badge.
                    */}
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            // Bagian "Tidak ada data" (tidak diubah)
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-500"
              >
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

// Menambahkan PropTypes untuk validasi
Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.shape({
    header: PropTypes.string.isRequired,
    accessor: PropTypes.func.isRequired, // Accessor sekarang harus berupa fungsi
  })).isRequired,
  data: PropTypes.array.isRequired,
};

export default Table;

