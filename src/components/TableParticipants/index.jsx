import React, { useState, useMemo } from "react";
import { Award, ArrowUpDown } from "lucide-react";
import Pagination from "../pagination";

const TableParticipants = ({ participants = [], winners = [], onPreview, doorprizeActive = false, }) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Buat set berisi nama pemenang
  const winnerNames = useMemo(
    () =>
      new Set(
        Array.isArray(winners)
          ? winners.map((w) =>
              typeof w === "string"
                ? w.trim().toLowerCase()
                : (w.nama || w.name || "").trim().toLowerCase()
            )
          : []
      ),
    [winners]
  );

  // Handle sorting kolom
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // Urutkan peserta sesuai kolom & pemenang di atas
  const sortedParticipants = useMemo(() => {
    const data = [...participants].sort((a, b) => {
      const nameA = a?.nama || a?.name || "";
      const nameB = b?.nama || b?.name || "";

      const aIsWinner = winnerNames.has(nameA.toLowerCase());
      const bIsWinner = winnerNames.has(nameB.toLowerCase());

      // Pemenang muncul duluan
      if (aIsWinner !== bIsWinner) return aIsWinner ? -1 : 1;

      // Urutkan nama
      if (sortField === "nama") {
        const result = nameA.localeCompare(nameB, "id", {
          sensitivity: "base",
        });
        return sortOrder === "asc" ? result : -result;
      }

      // Urutkan status
      if (sortField === "status") {
        const aStatus = a?.status || "Tidak Hadir";
        const bStatus = b?.status || "Tidak Hadir";
        const result = aStatus.localeCompare(bStatus, "id", {
          sensitivity: "base",
        });
        return sortOrder === "asc" ? result : -result;
      }

      return 0;
    });
    return data;
  }, [participants, sortField, sortOrder, winnerNames]);

  // Pagination setup
  const totalItems = sortedParticipants.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedParticipants = sortedParticipants.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 border border-gray-200 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* ===== TABLE HEADER ===== */}
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
              {doorprizeActive && (
                <th className="py-5 px-3 text-left rounded-tr-2xl">Doorprize</th>
              )}
            </tr>
          </thead>

          {/* ===== TABLE BODY ===== */}
          <tbody>
            {displayedParticipants.length > 0 ? (
              displayedParticipants.map((p, i) => {
                const isWinner = winnerNames.has(
                  (p.nama || "").trim().toLowerCase()
                );
                return (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50 border-b border-gray-200 transition-colors"
                  >
                    {/* NO */}
                    <td className="py-5 px-6 text-center text-gray-700 font-medium">
                      {startIndex + i + 1}
                    </td>

                    {/* NAMA */}
                    <td
                      onClick={() => onPreview(p)}
                      className="py-5 px-6 cursor-pointer text-gray-800"
                    >
                      {p.nama}
                    </td>

                    {/* WHATSAPP */}
                    <td className="py-5 px-2 text-gray-700">{p.no_whatsapp}</td>

                    {/* EMAIL */}
                    <td className="py-5 px-2 text-gray-700">{p.email}</td>

                    {/* FOTO */}
                    <td className="py-5 px-2 text-left">
                      <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200 bg-gray-200 flex items-center justify-center">
                        {p.photo_profile ? (
                          <img
                            src={p.photo_profile}
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
                    {doorprizeActive && (
                      <td className="py-5 px-2 text-left">
                        {isWinner ? (
                          <Award
                            size={20}
                            className="text-yellow-500 mx-auto"
                            title="Pemenang Doorprize"
                          />
                        ) : (
                          <span className="text-gray-300">—</span>
                        )}
                      </td>
                    )}
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

      {/* ===== PAGINATION ===== */}
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
