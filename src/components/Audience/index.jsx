import React, { useState } from "react";
import { X } from "lucide-react";
import { Typography } from "../typography";
import { Button } from "../button";

export default function Audience({ isOpen, onClose, participants = [] }) {
  const [selectedIds, setSelectedIds] = useState([]);

  if (!isOpen) return null;

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((i) => i !== id)
        : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === participants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(participants.map((p) => p.id));
    }
  };

  const selectedParticipants = participants.filter((p) =>
    selectedIds.includes(p.id)
  );

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-3xl p-6 relative">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div className="mb-6">
          <Typography
            type="heading4"
            className="text-blue-700"
            weight="semibold"
          >
            Tambah Peserta
          </Typography>
          <Typography type="body" className="text-blue-700">
            Pilih peserta yang ingin diundang
          </Typography>
        </div>

        {/* Table */}
        <div className="border rounded-xl max-h-80 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-200 sticky top-0 z-10">
              <tr>
                <th className="p-3 text-left bg-blue-200">
                  <input
                    type="checkbox"
                    checked={
                      participants.length > 0 &&
                      selectedIds.length === participants.length
                    }
                    onChange={toggleSelectAll}
                    className="w-4 h-4 accent-blue-600"
                  />
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Nama Peserta
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  No Whatsapp
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="p-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {participants.length > 0 ? (
                participants.map((p) => (
                  <tr
                    key={p.id}
                    className={`hover:bg-blue-50 ${
                      selectedIds.includes(p.id) ? "bg-blue-100" : ""
                    }`}
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(p.id)}
                        onChange={() => toggleSelect(p.id)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </td>
                    <td className="p-3 text-sm text-gray-800 cursor-pointer" onClick={() => toggleSelect(p.id)}>
                      {p.name}
                    </td>
                    <td className="p-3 text-sm text-gray-800">{p.no}</td>
                    <td className="p-3 text-sm text-gray-600">{p.email}</td>
                    <td className="p-3 text-sm text-gray-600">{p.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-6 text-gray-500 text-sm"
                  >
                    Tidak ada peserta ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
        {/* Chip Nama yang Dipilih */}
        {selectedParticipants.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4 mt-3">
            {selectedParticipants.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {p.name}
                <button
                  onClick={() => toggleSelect(p.id)}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
        {/* Footer */}
        <div className="flex justify-center mt-6 gap-3">
          <Button
            variant="primary"
            onClick={() => {
              onClose();
            }}
          >
            Kirim
          </Button>
        </div>
      </div>
    </div>
  );
}
