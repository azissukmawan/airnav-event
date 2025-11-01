import React from "react";
import { Award } from "lucide-react";
// HAPUS: import ChevronLeft, ChevronRight

// HAPUS: const Pagination = (...)

const TableParticipants = ({ participants = [], winners = [], onPreview }) => {
  const winnerNames = new Set(
    Array.isArray(winners) ? winners.map((w) => w.name || w.nama) : []
  );

  const sortedParticipants = [...participants].sort((a, b) => {
    const aIsWinner = winnerNames.has(a.name) ? 0 : 1;
    const bIsWinner = winnerNames.has(b.name) ? 0 : 1;
    return aIsWinner - bIsWinner;
  });

  return (
    <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-blue-100 text-blue-900 text-[16px] font-semibold">
              <th className="py-5 px-6 text-center rounded-tl-2xl">No</th>
              <th className="py-5 px-6 text-left">Nama Peserta</th>
              <th className="py-5 px-6 text-left">No Whatsapp</th>
              <th className="py-5 px-6 text-left">Email</th>
              <th className="py-5 px-6 text-center">Foto</th>
              <th className="py-5 px-6 text-center">Tipe</th>
              <th className="py-5 px-6 text-center">Status</th>
              <th className="py-5 px-6 text-center rounded-tr-2xl">
                Doorprize
              </th>
            </tr>
          </thead>

          {/* === BODY (Dimodifikasi) === */}
          <tbody>
            {sortedParticipants.length > 0 ? (
              sortedParticipants.map((p, i) => {
                const isWinner = winnerNames.has(p.name);

                return (
                  <tr
                    key={p.id}
                    className={`${
                      isWinner ? "bg-yellow-50" : "hover:bg-blue-50"
                    } border-b border-gray-200`}
                  >
                    <td className="py-5 px-6 text-center text-gray-700 font-medium">
                      {i + 1}
                    </td>
                    <td
                      onClick={() => onPreview(p)}
                      className="py-5 px-6 cursor-pointer"
                    >
                      {p.name}
                    </td>
                    <td className="py-5 px-6 text-gray-700">{p.whatsapp}</td>
                    <td className="py-5 px-6 text-gray-700">{p.email}</td>
                    <td className="py-5 px-6 text-center">
                      <div className="w-12 h-12 mx-auto rounded-full overflow-hidden border border-gray-200">
                        <img
                          src={p.photo || "/default-avatar.png"}
                          alt="foto"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="py-5 px-6 text-center text-gray-700">
                      {p.type || "Offline"}
                    </td>
                    <td className="py-5 px-6 text-center">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${
                          p.status === "Hadir"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {p.status || "Tidak Hadir"}
                      </span>
                    </td>
                    <td className="py-5 px-6 text-center">
                      {winnerNames.has(p.name) ? (
                        <Award
                          className="mx-auto text-yellow-500"
                          title="Pemenang"
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

      {/* === HAPUS KOMPONEN PAGINATION DARI SINI === */}
    </div>
  );
};

export default TableParticipants;
