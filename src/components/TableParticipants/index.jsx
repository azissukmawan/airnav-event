import React from "react";
import { Award } from "lucide-react";

const TableParticipants = ({ participants, onPreview }) => {
  return (
    <div className="bg-white rounded-3xl shadow-md p-4 md:p-6 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          {/* === HEADER === */}
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

          {/* === BODY === */}
          <tbody>
            {participants.length > 0 ? (
              participants.map((p, i) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition"
                >
                  <td className="py-5 px-6 text-center text-gray-700 font-medium">
                    {i + 1}
                  </td>
                  <td
                    className="py-5 px-6 text-gray-800 cursor-pointer font-medium"
                    onClick={() => onPreview(p)}
                  >
                    {p.name}
                  </td>
                  <td className="py-5 px-6 text-gray-700">{p.whatsapp}</td>
                  <td className="py-5 px-6 text-gray-700">{p.email}</td>
                  <td className="py-5 px-6 text-center">
                    <img
                      src={p.photo}
                      alt="foto"
                      className="w-15 h-15 object-cover mx-auto rounded-l border border-gray-200"
                    />
                  </td>
                  <td className="py-5 px-6 text-center text-gray-700">
                    Offline
                  </td>
                  <td className="py-5 px-6 text-center">
                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 font-medium">
                      Hadir
                    </span>
                  </td>
                  <td className="py-5 px-6 text-center text-yellow-500">
                    <Award className="mx-auto" />
                  </td>
                </tr>
              ))
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
    </div>
  );
};

export default TableParticipants;
