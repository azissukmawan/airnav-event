import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import Card from "../../../components/card";
import Modal from "../../../components/modal";
import Pagination from "../../../components/pagination";
import { useEvents } from "../../../contexts/EventContext";
import axios from "axios";

const SearchBar = ({ placeholder = "Cari sesuatu...", onSearch, onFilterClick }) => {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const handleSearchClick = () => {
    if (onSearch) onSearch(query);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center flex-1 bg-white rounded-full border border-typo-inline overflow-hidden focus-within:ring-2 focus-within:ring-primary-60">
        <button
          onClick={handleSearchClick}
          className="p-4 text-typo-icon hover:text-primary-60 transition-colors"
        >
          <Search className="w-5 h-5" />
        </button>

        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="flex-1 p-2 outline-none text-typo-secondary placeholder-typo-icon"
        />
      </div>

      <button
        onClick={onFilterClick}
        className="flex items-center justify-center p-4 bg-white border border-typo-inline rounded-full hover:bg-background-secondary hover:border-primary transition-all"
      >
        <Filter className="w-5 h-5 text-typo-icon" />
      </button>
    </div>
  );
};

const FilterContent = ({ activeFilters, onFilterChange }) => {
  const tipeOptions = [
    { value: "all", label: "Semua Tipe" },
    { value: "online", label: "Online" },
    { value: "offline", label: "Offline" },
    { value: "hybrid", label: "Hybrid" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-typo-primary mb-3 block">
          Tipe Event
        </label>
        <div className="flex flex-wrap gap-2">
          {tipeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange("tipe", option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilters.tipe === option.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-background-secondary text-typo-secondary hover:bg-primary-20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const Event = () => {
  const { events, loading, pagination, updateFilters, updatePage, updatePerPage } = useEvents();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tipe: "all",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    tipe: "all",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });

        const data = response.data.data;
        setUserName(data.name || "User");

        if (data.profile_photo) {
          setProfileImage(data.profile_photo);
        } else {
          const avatarName = encodeURIComponent(data.name || "User");
          setProfileImage(
            `https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`
          );
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser.name || "User");
            const avatarName = encodeURIComponent(parsedUser.name || "User");
            setProfileImage(
              `https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`
            );
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/me/pendaftaran`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const result = await response.json();

        if (result.success) {
          setRegisteredEvents(result.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoadingRegistered(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.mdl_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.mdl_lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTipe = true;
    if (filters.tipe !== "all") {
      matchesTipe = event.mdl_tipe?.toLowerCase() === filters.tipe.toLowerCase();
    }

    return matchesSearch && matchesTipe;
  });

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleTempFilterChange = (filterType, value) => {
    setTempFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleResetFilters = () => {
    setTempFilters({ tipe: "all" });
  };

  const handleApplyFilters = () => {
    setFilters(tempFilters);
    updateFilters(tempFilters);
    setIsFilterModalOpen(false);
  };

  const handleOpenFilterModal = () => {
    setTempFilters(filters);
    setIsFilterModalOpen(true);
  };

  const handlePageChange = (page) => {
    updatePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRowsPerPageChange = (perPage) => {
    updatePerPage(perPage);
  };

  const hasActiveFilters = filters.tipe !== "all";

  if (loading || loadingRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
            Selamat Datang, {userName}!
          </h1>
          <h1 className="text-sm md:text-md text-typo-secondary mb-1">
            Lihat semua event yang tersedia untuk kamu
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {profileImage && (
            <img
              src={profileImage}
              alt="Profile"
              className="hidden lg:block w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="mb-4">
        <SearchBar
          placeholder="Cari event berdasarkan nama atau lokasi..."
          onSearch={handleSearch}
          onFilterClick={handleOpenFilterModal}
        />
      </div>

      {hasActiveFilters && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-typo-secondary">Filter aktif:</span>
          {filters.tipe !== "all" && (
            <span className="px-3 py-1 bg-primary-20 text-primary rounded-full text-xs font-medium flex items-center gap-1">
              Tipe: {filters.tipe.charAt(0).toUpperCase() + filters.tipe.slice(1)}
              <button
                onClick={() => {
                  const newFilters = { tipe: "all" };
                  setFilters(newFilters);
                  updateFilters(newFilters);
                }}
                className="hover:bg-primary-40 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          <button
            onClick={() => {
              const newFilters = { tipe: "all" };
              setFilters(newFilters);
              updateFilters(newFilters);
            }}
            className="text-sm text-primary hover:text-primary-60 font-medium"
          >
            Reset semua
          </button>
        </div>
      )}

      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-typo-secondary">
          Menampilkan <span className="font-semibold">{filteredEvents.length}</span> event pada halaman ini
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card
              key={event.id}
              id={event.id}
              title={event.mdl_nama}
              date={event.mdl_acara_mulai}
              location={event.mdl_lokasi}
              image={event.media_urls.banner || null}
              mdl_pendaftaran_mulai={event.mdl_pendaftaran_mulai}
              mdl_pendaftaran_selesai={event.mdl_pendaftaran_selesai}
              mdl_acara_mulai={event.mdl_acara_mulai}
              mdl_acara_selesai={event.mdl_acara_selesai}
              tipe={event.mdl_tipe}
              registeredEvents={registeredEvents}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <div className="text-typo-icon mb-2">
              <Filter className="w-16 h-16 mx-auto mb-4" />
            </div>
            <p className="text-typo-secondary font-medium mb-1">
              Tidak ada event yang ditemukan
            </p>
            <p className="text-typo-icon text-sm">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {filteredEvents.length > 0 && (
        <div className="mt-8 flex items-center justify-between">
          <Pagination
            currentPage={pagination.currentPage}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            onPageChange={handlePageChange}
            rowsPerPage={pagination.perPage}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
        </div>
      )}

      <Modal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        title="Filter Event"
        size="sm"
        footer={
          <>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-typo-inline text-typo-primary font-medium rounded-lg hover:bg-background-secondary transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApplyFilters}
              className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-60 transition-colors shadow-md"
            >
              Terapkan Filter
            </button>
          </>
        }
      >
        <FilterContent activeFilters={tempFilters} onFilterChange={handleTempFilterChange} />
      </Modal>
    </div>
  );
};

export default Event;