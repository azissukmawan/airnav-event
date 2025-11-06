import { useState, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import axios from "axios";
import Card from "../../../components/card";
import Modal from "../../../components/modal";
import Pagination from "../../../components/pagination";
import { useEvents } from "../../../contexts/EventContext";

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

  const statusOptions = [
    { value: "all", label: "Semua Status" },
    { value: "bisa-daftar", label: "Bisa Daftar" },
    { value: "segera-hadir", label: "Segera Hadir" },
    { value: "ditutup", label: "Ditutup" },
    { value: "selesai", label: "Selesai" },
    { value: "khusus-karyawan", label: "Khusus Karyawan" },
  ];

  return (
    <div className="space-y-6">
      {/* Filter status */}
      <div>
        <label className="text-sm font-semibold text-typo-primary mb-3 block">
          Status Event
        </label>
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => onFilterChange("status", option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeFilters.status === option.value
                  ? "bg-primary text-white shadow-md"
                  : "bg-background-secondary text-typo-secondary hover:bg-primary-20"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
      {/* Filter tipe */}
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
  const [role, setRole] = useState("peserta");

  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    tipe: "all",
    status: "all",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempFilters, setTempFilters] = useState({
    tipe: "all",
    status: "all",
  });

  // Ambil data user
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
        console.error(error);

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

  // Fetch pendaftaran
  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/me/pendaftaran`, {
          headers: {
            Authorization: `Bearer ${token}`,
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

  // Filter event
  const filteredEvents = events.filter((event) => {
    if (event.mdl_status?.toLowerCase() === 'archived') {
      return false;
    }

    const now = new Date();
    const registrationStart = new Date(event.mdl_pendaftaran_mulai);
    const registrationEnd = new Date(event.mdl_pendaftaran_selesai);
    const eventStart = new Date(event.mdl_acara_mulai);
    const eventEnd = new Date(event.mdl_acara_selesai);

    const isRegistered = registeredEvents.some(
      (e) => e.modul_acara_id === event.id
    );
    const isPrivate =
      ["private", "invite-only"].includes(event.mdl_kategori?.toLowerCase()) &&
      role === "peserta";

    let eventStatus = "bisa-daftar";
    if (isPrivate) eventStatus = "khusus-karyawan";
    else if (now < registrationStart) eventStatus = "segera-hadir";
    else if (now >= registrationStart && now <= registrationEnd)
      eventStatus = "bisa-daftar";
    else if (now > registrationEnd && now < eventStart)
      eventStatus = "ditutup";
    else if (now >= eventStart && now <= eventEnd)
      eventStatus = "ditutup";
    else if (now > eventEnd) eventStatus = "selesai";

    const matchesSearch =
      event.mdl_nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.mdl_lokasi.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesTipe = filters.tipe === "all" || event.mdl_tipe?.toLowerCase() === filters.tipe;
    let matchesStatus = filters.status === "all" || eventStatus === filters.status;

    return matchesSearch && matchesTipe && matchesStatus;
  });

  const handleSearch = (query) => setSearchQuery(query);
  const handleTempFilterChange = (filterType, value) =>
    setTempFilters((prev) => ({ ...prev, [filterType]: value }));
  const handleResetFilters = () => setTempFilters({ tipe: "all", status: "all" });
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
  const handleRowsPerPageChange = (perPage) => updatePerPage(perPage);

  const hasActiveFilters =
    filters.tipe !== "all" || filters.status !== "all";

  if (loading || loadingRegistered) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center justify-center space-x-2">
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
          <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
            Selamat Datang, {userName}!
          </h1>
          <h1 className="text-sm md:text-md text-typo-secondary mb-1">
            Lihat semua event yang tersedia untuk kamu
          </h1>
        </div>
        {profileImage && (
          <img
            src={profileImage}
            alt="Profile"
            className="hidden lg:block w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4">
        <SearchBar
          placeholder="Cari event berdasarkan nama atau lokasi..."
          onSearch={handleSearch}
          onFilterClick={handleOpenFilterModal}
        />
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          <span className="text-sm text-typo-secondary">Filter aktif:</span>
          {filters.tipe !== "all" && (
            <span className="px-3 py-1 bg-primary-20 text-primary rounded-full text-xs font-medium flex items-center gap-1">
              Tipe: {filters.tipe}
              <button
                onClick={() => {
                  const newFilters = { ...filters, tipe: "all" };
                  setFilters(newFilters);
                  updateFilters(newFilters);
                }}
                className="hover:bg-primary-40 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.status !== "all" && (
            <span className="px-3 py-1 bg-primary-20 text-primary rounded-full text-xs font-medium flex items-center gap-1">
              Status: {filters.status.replace("-", " ")}
              <button
                onClick={() => {
                  const newFilters = { ...filters, status: "all" };
                  setFilters(newFilters);
                  updateFilters(newFilters);
                }}
                className="hover:bg-primary-40 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Grid Event */}
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
              mdl_kategori={event.mdl_kategori}
              role={role}
            />
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <Filter className="w-16 h-16 mx-auto mb-4 text-typo-icon" />
            <p className="text-typo-secondary font-medium mb-1">
              Tidak ada event yang ditemukan
            </p>
            <p className="text-typo-icon text-sm">
              Coba ubah filter atau kata kunci pencarian
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
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

      {/* Modal Filter */}
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
