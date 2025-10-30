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
  id,       // tambahkan id event
  title,
  date,
  location,
  image,
  status,
  type,
}) {
  const navigate = useNavigate();

  // Fungsi untuk navigasi
  const handleClick = () => {
    navigate(`/event/${id}`);
  };

  // Warna status
  const statusColor =
    status === "Bisa Daftar"
      ? "bg-blue-100 text-blue-700"
      : status === "Terdaftar"
      ? "bg-green-100 text-green-700"
      : status === "Segera Hadir"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Ditutup"
      ? "bg-gray-100 text-[#64646D]"
      : "bg-gray-100 text-gray-600";

  // Warna + ikon tipe acara
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
  }[type] || {
    bg: "bg-gray-50",
    text: "text-gray-600",
    icon: null,
  };

  return (
    <div
      onClick={handleClick}
      className="w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-lg hover:scale-[1.01] transition-all cursor-pointer"
    >
      {/* Gambar & status */}
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-56 object-cover transition-transform duration-300"
        />
        <span
          className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full shadow ${statusColor}`}
        >
          {status}
        </span>
      </div>

      {/* Konten */}
      <div className="p-5 space-y-3">
        <Typography
          type="heading6"
          weight="semibold"
          className="text-gray-900 leading-snug text-left"
        >
          {title}
        </Typography>

        {/* Info acara */}
        <div className="space-y-2 space-x-1 text-sm text-left">
          {[
            {
              icon: typeStyle.icon,
              text: type,
              bg: typeStyle.bg,
              color: typeStyle.text,
            },
            {
              icon: <Calendar className="w-4 h-4 text-blue-700" />,
              text: date,
              bg: "bg-blue-50",
              color: "text-blue-700",
            },
            {
              icon: <MapPin className="w-4 h-4 text-blue-700" />,
              text: location,
              bg: "bg-blue-50",
              color: "text-blue-700",
            },
          ].map((item, i) => (
            <div
              key={i}
              className={`inline-flex items-center gap-2 ${item.bg} ${item.color} px-2 py-1 rounded-xl font-medium`}
            >
              {item.icon}
              <Typography type="caption2" weight="medium">
                {item.text}
              </Typography>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
