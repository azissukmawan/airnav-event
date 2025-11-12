import React, { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const DropdownHariSesi = ({ participants, onFilter }) => {
  const [selectedHari, setSelectedHari] = useState("");
  const [selectedSesi, setSelectedSesi] = useState("");

  // daftar hari dari key object (Hari-1, Hari-2, dst)
  const hariList = Object.keys(participants || {}).sort((a, b) => {
    const numA = parseInt(a.replace("Hari-", ""));
    const numB = parseInt(b.replace("Hari-", ""));
    return numA - numB;
  });

  // ambil sesi dari hari yang dipilih
  const sesiList = selectedHari
    ? Object.keys(participants[selectedHari] || {}).sort((a, b) => {
        const numA = parseInt(a.replace("Sesi-", ""));
        const numB = parseInt(b.replace("Sesi-", ""));
        return numA - numB;
      })
    : [];

  // set default ke Hari pertama dan Sesi pertama yang tersedia (HANYA SEKALI)
  useEffect(() => {
    if (hariList.length > 0 && !selectedHari) {
      const defaultHari = hariList[0];
      const defaultSesiList = Object.keys(participants[defaultHari] || {}).sort(
        (a, b) => {
          const numA = parseInt(a.replace("Sesi-", ""));
          const numB = parseInt(b.replace("Sesi-", ""));
          return numA - numB;
        }
      );
      const defaultSesi = defaultSesiList[0] || "";

      setSelectedHari(defaultHari);
      setSelectedSesi(defaultSesi);
    }
  }, [hariList.length]); // Hanya trigger saat ada data pertama kali

  // kirim peserta yang difilter ke parent setiap perubahan
  useEffect(() => {
    if (selectedHari && selectedSesi && onFilter) {
      const dataFiltered = participants[selectedHari]?.[selectedSesi] || [];
      onFilter(dataFiltered);
    }
  }, [selectedHari, selectedSesi]);

  const handleHariChange = (e) => {
    const newHari = e.target.value;
    setSelectedHari(newHari);

    // reset sesi ke sesi pertama dari hari baru
    const newSesiList = Object.keys(participants[newHari] || {}).sort(
      (a, b) => {
        const numA = parseInt(a.replace("Sesi-", ""));
        const numB = parseInt(b.replace("Sesi-", ""));
        return numA - numB;
      }
    );
    setSelectedSesi(newSesiList[0] || "");
  };

  const handleSesiChange = (e) => {
    setSelectedSesi(e.target.value);
  };

  return (
    <div className="flex gap-3 w-80">
      {/* Dropdown Hari */}
      <div className="flex-1 relative">
        <select
          value={selectedHari}
          onChange={handleHariChange}
          className="border border-blue-900 rounded-xl p-2 pr-8 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none"
        >
          <option value="">Pilih Hari</option>
          {hariList.map((hari) => (
            <option key={hari} value={hari}>
              {hari.replace("Hari-", "Hari ")}
            </option>
          ))}
        </select>
        <ChevronDown
          size={18}
          className="absolute right-3 top-[10px] text-gray-500 pointer-events-none"
        />
      </div>

      {/* Dropdown Sesi */}
      <div className="flex-1 relative">
        <select
          value={selectedSesi}
          onChange={handleSesiChange}
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
          className="absolute right-3 top-[10px] text-gray-500 pointer-events-none"
        />
      </div>
    </div>
  );
};

export default DropdownHariSesi;