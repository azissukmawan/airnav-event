import React, { useState, useMemo } from "react";
import { Award, ArrowUpDown, Download } from "lucide-react";
import Pagination from "../../pagination";
import { Button } from "../../button";
import axios from "axios";

const TableParticipants = ({
  participants = [],
  winners = [],
  onPreview,
  doorprizeActive = false,
}) => {
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loadingId, setLoadingId] = useState(null);

  const showTypeColumn = useMemo(() => {
    return participants.some((p) => (p.type || "").toLowerCase() === "hybrid");
  }, [participants]);

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const handleDownload = async (participant) => {
    try {
      setLoadingId(participant.id);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/sertifikat/generate`,
        { id_acara: participant.id_acara || participant.event_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      localStorage.setItem("cert_data", JSON.stringify(response.data));
      window.open("/user/certificate", "_blank");
    } catch (error) {
      console.error("Gagal generate sertifikat:", error);
      alert(
        error.response?.data?.message ||
          "Terjadi kesalahan saat mengunduh sertifikat"
      );
    } finally {
      setLoadingId(null);
    }
  };

  const sortedParticipants = useMemo(() => {
    const data = [...participants].sort((a, b) => {
      const nameA = a?.nama || a?.name || "";
      const nameB = b?.nama || b?.name || "";

      const aIsWinner = winnerNames.has(nameA.toLowerCase());
      const bIsWinner = winnerNames.has(nameB.toLowerCase());

      if (aIsWinner !== bIsWinner) return aIsWinner ? -1 : 1;

      if (sortField === "nama") {
        const result = nameA.localeCompare(nameB, "id", {
          sensitivity: "base",
        });
        return sortOrder === "asc" ? result : -result;
      }

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

  const totalItems = sortedParticipants.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const displayedParticipants = sortedParticipants.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 border border-gray-200 space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse table-fixed">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-[16px] font-semibold">
              <th className="py-4 px-4 text-center rounded-tl-2xl w-[60px]">
                No
              </th>
              <th
                className="py-4 px-4 text-left cursor-pointer hover:text-blue-700 w-[220px]"
                onClick={() => handleSort("nama")}
              >
                <div className="flex items-center gap-2">
                  Nama Peserta <ArrowUpDown size={16} />
                </div>
              </th>
              <th className="py-4 px-4 text-left w-[150px]">No Whatsapp</th>
              <th className="py-4 px-4 text-left w-[200px]">Email</th>
              <th className="py-4 px-4 text-left w-[70px]">Foto</th>
              {showTypeColumn && (
                <th className="py-4 px-4 text-left w-[100px]">Tipe</th>
              )}
              <th
                className="py-4 px-4 text-left cursor-pointer hover:text-blue-700 w-[125px]"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center gap-2">
                  Status <ArrowUpDown size={16} />
                </div>
              </th>
              <th className="py-4 px-4 text-left w-[100px]">Sertifikat</th>
              {doorprizeActive && (
                <th className="py-4 px-4 text-center rounded-tr-2xl w-[120px]">
                  Doorprize
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {displayedParticipants.length > 0 ? (
              displayedParticipants.map((p, i) => {
                const isWinner = winnerNames.has(
                  (p.nama || "").trim().toLowerCase()
                );
                const sudahPresensi = p.status === "Hadir";
                const sudahSelesai = p.event_status === "Selesai";
                const bisaDownload = sudahPresensi && sudahSelesai;

                return (
                  <tr
                    key={p.id}
                    className="hover:bg-blue-50 border-b border-gray-200 transition-colors"
                  >
                    <td className="py-4 px-4 text-center text-gray-700 font-medium w-[60px]">
                      {startIndex + i + 1}
                    </td>

                    <td
                      onClick={() => onPreview(p)}
                      className="py-4 px-4 cursor-pointer text-gray-800 truncate w-[200px]"
                    >
                      {p.nama}
                    </td>

                    <td className="py-4 px-4 text-gray-700 w-[150px] truncate">
                      {p.no_whatsapp}
                    </td>
                    <td className="py-4 px-4 text-gray-700 w-[200px] truncate">
                      {p.email}
                    </td>

                    <td className="py-4 px-4 w-[100px]">
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

                    {showTypeColumn && (
                      <td className="py-4 px-4 text-gray-700 w-[100px]">
                        {p.type || "Offline"}
                      </td>
                    )}

                    <td className="py-4 px-4 text-left w-[120px]">
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

                    <td className="py-4 px-4 text-left w-[150px]">
                      {bisaDownload ? (
                        <Button
                          variant="secondary"
                          iconLeft={<Download size={18} />}
                          onClick={() => handleDownload(p)}
                          disabled={loadingId === p.id}
                          className="whitespace-nowrap"
                        >
                          {loadingId === p.id ? "Mengunduh..." : "Sertifikat"}
                        </Button>
                      ) : (
                        <Button
                          variant="third"
                          className="text-xs opacity-60 cursor-not-allowed whitespace-nowrap"
                          disabled
                        >
                          Sertifikat
                        </Button>
                      )}
                    </td>

                    {doorprizeActive && (
                      <td className="py-4 px-4 mr-1 text-center w-[100px]">
                        {isWinner ? (
                          <Award
                            size={20}
                            className="text-yellow-500 mx-auto"
                            title="Pemenang"
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
                  colSpan={showTypeColumn ? 8 : 7}
                  className="py-6 px-6 text-center text-gray-500 italic"
                >
                  Tidak ada peserta ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

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
