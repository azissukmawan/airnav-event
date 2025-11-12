import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DropdownHariSesi = ({ participants, onFilter }) => {
  const hariList = Object.keys(participants || {});
  const [selectedHari, setSelectedHari] = useState("");
  const [selectedSesi, setSelectedSesi] = useState("");

  // Ambil daftar sesi dari hari yang dipilih
  const sesiList = selectedHari
    ? Object.keys(participants[selectedHari] || {})
    : [];

  // Set default Hari-1 dan Sesi-1 saat data sudah tersedia
  useEffect(() => {
    if (hariList.length > 0 && !selectedHari) {
      const defaultHari = hariList.find((h) => h === "Hari-1") || hariList[0];
      const defaultSesiList = Object.keys(participants[defaultHari] || {});
      const defaultSesi =
        defaultSesiList.find((s) => s === "Sesi-1") || defaultSesiList[0];

      setSelectedHari(defaultHari);
      setSelectedSesi(defaultSesi);
    }
  }, [hariList, participants]);

  // Kirim data filter ke parent setiap kali berubah
  useEffect(() => {
    if (onFilter && selectedHari && selectedSesi) {
      onFilter(selectedHari, selectedSesi);
    }
  }, [selectedHari, selectedSesi]);

  return (
    <div className="flex gap-3 mb-4 relative w-80 mb-3">
      {/* Hari */}
      <div className="flex-1 flex flex-col relative">
        <label className="font-semibold text-gray-700 "></label>
        <select
          value={selectedHari}
          onChange={(e) => {
            const newHari = e.target.value;
            setSelectedHari(newHari);
            // Reset sesi ke sesi pertama dari hari baru
            const newSesiList = Object.keys(participants[newHari] || {});
            setSelectedSesi(newSesiList[0] || "");
          }}
          className="border border-blue-900 rounded-xl p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
        >
          {hariList.length === 0 ? (
            <option value="">Memuat...</option>
          ) : (
            <>
              <option value="">Pilih Hari</option>
              {hariList.map((hari) => (
                <option key={hari} value={hari}>
                  {hari.replace("Hari-", "Hari ")}
                </option>
              ))}
            </>
          )}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-[18px] text-gray-500 pointer-events-none"
        />
      </div>

      {/* Sesi */}
      <div className="flex-1 flex flex-col relative">
        <label className="font-semibold text-gray-700"></label>
        <select
          value={selectedSesi}
          onChange={(e) => setSelectedSesi(e.target.value)}
          disabled={!selectedHari}
          className="border border-blue-900 rounded-xl p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none disabled:bg-gray-100 disabled:text-gray-500"
        >
          <option value="">Pilih Sesi</option>
          {sesiList.map((sesi) => (
            <option key={sesi} value={sesi}>
              {sesi.replace("Sesi-", "Sesi ")}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-[18px] text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default DropdownHariSesi;
