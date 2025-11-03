import { Typography } from "../typography";
import {
  Calendar,
  MapPin,
  Laptop,
  Users,
  MonitorSmartphone,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function CardLanding({
  id,
  title,
  slug,
  location,
  image,
  type,
  mdl_pendaftaran_mulai,
  mdl_pendaftaran_selesai,
  mdl_acara_mulai,
  mdl_acara_selesai,
  registeredEvents = [],
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/event/${slug}`);
  };

  const normalizedType = type
    ? type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()
    : "";

  // Format tanggal seperti di Card lama
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";

    const date = new Date(dateString);
    const months = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  };

  const now = new Date();
  const registrationStart = mdl_pendaftaran_mulai
    ? new Date(mdl_pendaftaran_mulai)
    : null;
  const registrationEnd = mdl_pendaftaran_selesai
    ? new Date(mdl_pendaftaran_selesai)
    : null;
  const eventStart = mdl_acara_mulai ? new Date(mdl_acara_mulai) : null;
  const eventEnd = mdl_acara_selesai ? new Date(mdl_acara_selesai) : null;

  const isRegistered = registeredEvents.some(
    (event) => event.modul_acara_id === id
  );

  let statusText = "";
  if (isRegistered) {
    statusText = "Terdaftar";
  } else if (registrationStart && now < registrationStart) {
    statusText = "Segera Hadir";
  } else if (
    registrationStart &&
    registrationEnd &&
    now >= registrationStart &&
    now <= registrationEnd
  ) {
    statusText = "Bisa Daftar";
  } else if (registrationEnd && now > registrationEnd) {
    statusText = "Ditutup";
  } else {
    statusText = "-";
  }

  const statusColor =
    statusText === "Bisa Daftar"
      ? "bg-blue-100 text-blue-700"
      : statusText === "Terdaftar"
      ? "bg-green-100 text-green-700"
      : statusText === "Segera Hadir"
      ? "bg-yellow-100 text-yellow-700"
      : statusText === "Ditutup"
      ? "bg-gray-100 text-[#64646D]"
      : "bg-gray-100 text-gray-600";

  const typeStyle = {
    Online: {
      bg: "bg-sky-50",
      text: "text-sky-700",
      icon: <MonitorSmartphone className="w-4 h-4 text-blue-700" />,
    },
    Hybrid: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      icon: <Laptop className="w-4 h-4 text-purple-700" />,
    },
    Offline: {
      bg: "bg-green-50",
      text: "text-green-700",
      icon: <Users className="w-4 h-4 text-green-700" />,
    },
  }[normalizedType] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    icon: null,
  };

  return (
    <div
      onClick={handleClick}
      className="w-full min-w-0 bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer flex flex-col h-full"
    >
      {/* Gambar & status */}
      <div className="relative">
        <img
          src={image || "/no-image.jpg"}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-300"
          onError={(e) => {
            e.currentTarget.src = defaultImage;
          }}
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow ${statusColor}`}
        >
          {statusText}
        </span>
      </div>

      {/* Konten */}
      <div className="p-5 space-y-3 flex flex-col justify-between">
        <Typography
          type="heading6"
          weight="semibold"
          className="text-gray-900 leading-snug text-left"
        >
          {title}
        </Typography>

        {/* Info acara */}
        <div className="flex flex-wrap gap-2 text-sm text-left">
          {[
            {
              icon: typeStyle.icon,
              text: type,
              bg: typeStyle.bg,
              color: typeStyle.text,
            },
            {
              icon: <Calendar className="w-4 h-4 text-blue-700" />,
              text: mdl_acara_mulai ? formatDateTime(mdl_acara_mulai) : "-",
              bg: "bg-blue-50",
              color: "text-blue-700",
            },
            ...(type !== "Online"
              ? [
                  {
                    icon: <MapPin className="w-4 h-4 text-blue-700" />,
                    text: location || "No location",
                    bg: "bg-blue-50",
                    color: "text-blue-700",
                  },
                ]
              : []),
          ].map((item, i) => (
            <div
              key={i}
              className={`inline-flex items-center gap-2 ${item.bg} ${item.color} px-2 py-1 rounded-xl font-medium`}
            >
              {item.icon}
              <Typography
                type="caption2"
                weight="medium"
                className="block break-words max-w-full"
              >
                {item.text}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
