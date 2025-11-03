import { useState } from "react";
import Dropdown from "../form/Dropdown";
import { Typography } from "../typography";
import { X } from "lucide-react";

export default function InviteMultipleDropdown() {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const userOptions = [
    { value: 1, label: "Ahmad Fikri" },
    { value: 2, label: "Nabila Rahma" },
    { value: 3, label: "Rizky Maulana" },
    { value: 4, label: "Siti Zahra" },
    { value: 5, label: "Dimas Ananda" },
  ];

  const handleSelect = (value) => {
    // cari data lengkap dari options
    const selectedOption = userOptions.find((u) => u.value === value);
    // tambahkan kalau belum ada
    if (selectedOption && !selectedUsers.some((u) => u.value === value)) {
      setSelectedUsers([...selectedUsers, selectedOption]);
    }
  };

  const handleRemove = (value) => {
    setSelectedUsers(selectedUsers.filter((u) => u.value !== value));
  };

  return (
    <div className="flex flex-col gap-3">
      <Typography type="subheading" weight="semibold">
        Pilih Peserta
      </Typography>

      {/* Dropdown untuk memilih */}
      <Dropdown
        type="search"
        label="Cari dan pilih peserta"
        options={userOptions}
        variant="white"
        onSelect={handleSelect}
      />

      {/* List peserta terpilih */}
      {selectedUsers.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedUsers.map((user) => (
            <div
              key={user.value}
              className="flex items-center gap-2 bg-primary-10 text-primary rounded-full px-3 py-1 text-sm"
            >
              {user.label}
              <button
                onClick={() => handleRemove(user.value)}
                className="hover:text-red-500 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Contoh output JSON */}
      <pre className="bg-gray-50 border rounded-md p-2 text-xs text-gray-600 mt-2">
        {JSON.stringify(selectedUsers.map((u) => u.value))}
      </pre>
    </div>
  );
}
