import React, { useState, useMemo } from "react";
import { Award, ArrowUpDown } from "lucide-react";
import Pagination from "../Pagination";

const TableParticipants = ({ participants = [], winners = [], onPreview }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const winnerNames = new Set(
    Array.isArray(winners) ? winners.map((w) => w.nama || w.name) : []
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedParticipants = useMemo(() => {
    const data = [...participants].sort((a, b) => {
      const aIsWinner = winnerNames.has(a.nama);
      const bIsWinner = winnerNames.has(b.nama);

      if (aIsWinner !== bIsWinner) return aIsWinner ? -1 : 1;

      if (sortField === "nama") {
        const result = a.nama.localeCompare(b.nama);
        return sortOrder === "asc" ? result : -result;
      }

      if (sortField === "status") {
        const aStatus = a.status || "Tidak Hadir";
        const bStatus = b.status || "Tidak Hadir";
        const result = aStatus.localeCompare(bStatus);
        return sortOrder === "asc" ? result : -result;
      }

      return 0;
    });
    return data;
  }, [participants, sortField, sortOrder, winnerNames]);

  const totalItems = sortedParticipants.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedParticipants = sortedParticipants.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 border border-gray-200 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-[16px] font-semibold">
              <th className="py-5 px-6 text-center rounded-tl-2xl">No</th>
              <th
                className="py-5 px-6 text-left cursor-pointer hover:text-blue-700"
                onClick={() => handleSort("nama")}
              >
                <div className="flex items-center gap-2">
                  Nama Peserta <ArrowUpDown size={16} />
                </div>
              </th>
              <th className="py-5 px-2 text-left">No Whatsapp</th>
              <th className="py-5 px-2 text-left">Email</th>
              <th className="py-5 px-2 text-left">Foto</th>
              <th className="py-5 px-5 text-left">Tipe</th>
              <th
                className="py-5 px-2 text-left cursor-pointer hover:text-blue-700"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status <ArrowUpDown size={16} />
                </div>
              </th>
              <th className="py-5 px-3 text-left rounded-tr-2xl">Doorprize</th>
            </tr>
          </thead>

          <tbody>
            {displayedParticipants.length > 0 ? (
              displayedParticipants.map((p, i) => {
                const isWinner = winnerNames.has(p.nama);
                return (
                  <tr
                    key={p.id}
                    className={`${
                      isWinner ? "bg-yellow-50" : "hover:bg-blue-50"
                    } border-b border-gray-200`}
                  >
                    <td className="py-5 px-6 text-center text-gray-700 font-medium">
                      {startIndex + i + 1}
                    </td>
                    <td
                      onClick={() => onPreview(p)}
                      className="py-5 px-6 cursor-pointer text-gray-800"
                    >
                      {p.nama}
                    </td>
                    <td className="py-5 px-2 text-gray-700">{p.no_whatsapp}</td>
                    <td className="py-5 px-2 text-gray-700">{p.email}</td>

                    {/* FOTO */}
                    <td className="py-5 px-2 text-left">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-200 flex items-center justify-center">
                        {p.photo ? (
                          <img
                            src={p.photo}
                            alt="foto"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-700 font-bold">
                            {p.nama ? p.nama.charAt(0).toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* TIPE */}
                    <td className="py-5 px-5 text-gray-700">
                      {p.type || "Offline"}
                    </td>

                    {/* STATUS */}
                    <td className="py-5 px-2 text-left">
                      <span
                        className={`px-3 py-1 rounded-xl font-bold text-xs ${
                          p.status === "Hadir"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {p.status || "Tidak Hadir"}
                      </span>
                    </td>

                    {/* DOORPRIZE */}
                    <td className="py-5 px-2 text-left">
                      {isWinner ? (
                        <Award
                          className="text-yellow-500"
                          title="Pemenang"
                          size={18}
                        />
                      ) : (
                        <span className="text-gray-300">—</span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={8}
                  className="py-6 px-6 text-center text-gray-500 italic"
                >
                  Tidak ada peserta ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* === PAGINATION SECTION === */}
      <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          onPageChange={setCurrentPage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(value) => {
            setRowsPerPage(value);
            setCurrentPage(1);
          }}
        />
      </div>
    </div>
  );
};

export default TableParticipants;
