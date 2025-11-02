import { Typography } from "../typography";
import { Calendar, MapPin, Building, Laptop, RefreshCcw } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../button";
import defaultImage from "../../assets/no-image.jpg";

export default function Card({
  id,
  title,
  location,
  image,
  mdl_pendaftaran_mulai,
  mdl_pendaftaran_selesai,
  mdl_acara_mulai,
  mdl_acara_selesai,
  tipe,
  registeredEvents = [],
}) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "-";
    
    const date = new Date(dateString);
    
    const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  };

  const now = new Date();

  const registrationStart = new Date(mdl_pendaftaran_mulai);
  const registrationEnd = new Date(mdl_pendaftaran_selesai);
  const eventStart = new Date(mdl_acara_mulai);
  const eventEnd = new Date(mdl_acara_selesai);

  const isRegistered = registeredEvents.some(event => event.modul_acara_id === id);

  let displayStatus = "";
  let statusColor = "";

  // Status card
  if (isRegistered) {
    displayStatus = "Terdaftar";
    statusColor = "bg-success-10 text-success";
  } else if (now < registrationStart) {
    displayStatus = "Segera Hadir";
    statusColor = "bg-warning-10 text-warning";
  } else if (now >= registrationStart && now <= registrationEnd) {
    displayStatus = "Bisa Daftar";
    statusColor = "bg-primary-10 text-primary";
  } else if (now > registrationEnd) {
    displayStatus = "Ditutup";
    statusColor = "bg-typo-white2 text-typo-secondary";
  }

  let TypeIcon;
  if (tipe?.toLowerCase() === "offline") {
    TypeIcon = Building;
  } else if (tipe?.toLowerCase() === "online") {
    TypeIcon = Laptop;
  } else if (tipe?.toLowerCase() === "hybrid") {
    TypeIcon = RefreshCcw;
  } else {
    TypeIcon = Building;
  }

  let showButton = true;
  let buttonText = "";
  let buttonVariant = "primary";
  let to = `/user/event/${id}`;

  // Button card
  if (now < registrationStart) {
    buttonText = "Lihat Detail";
  } else if (isRegistered) {
    buttonText = "Lihat Detail";
  } else if (now >= registrationStart && now <= registrationEnd) {
    buttonText = "Lihat Detail";
  } else if (now > registrationEnd && now < eventStart) {
    buttonText = "Lihat Detail";
  } else if (now >= eventStart && now <= eventEnd) {
    buttonText = "Lihat Detail";
  } else if (now > eventEnd) {
    buttonText = "Tutup";
    buttonVariant = "third";
  }

  const CardContent = (
    <div className="w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative">
        <img src={image || defaultImage} alt={title} className="w-full h-56 object-cover" />
        {displayStatus && (
          <Typography
            type="caption1"
            weight="semibold"
            className={`absolute top-3 left-3 ${statusColor} text-xs px-3 py-1 rounded-full shadow`}
          >
            {displayStatus}
          </Typography>
        )}
      </div>

      <div className="p-5">
        <Typography
          type="heading6"
          weight="semibold"
          className="text-gray-900 text-left leading-snug mb-3"
        >
          {title}
        </Typography>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="flex gap-2 text-blue-700 bg-blue-50 px-2 py-1 text-sm rounded-xl font-medium items-center">
              <TypeIcon className="w-4 h-4 text-blue-700" />
              <Typography
                type="caption2"
                weight="medium"
                className="text-blue-700"
              >
                {tipe}
              </Typography>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex gap-2 text-blue-700 bg-blue-50 px-2 py-1 text-sm rounded-xl font-medium items-center">
              <Calendar className="w-4 h-4 text-blue-700" />
              <Typography
                type="caption2"
                weight="medium"
                className="text-blue-700"
              >
                {formatDateTime(mdl_acara_mulai)}
              </Typography>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex gap-2 text-blue-700 bg-blue-50 px-2 py-1 text-sm rounded-xl font-medium items-center">
              <MapPin className="w-4 h-4 text-blue-700" />
              <Typography
                type="caption2"
                weight="medium"
                className="text-blue-700"
              >
                {location}
              </Typography>
            </span>
          </div>
        </div>

        {showButton && (
          <Button variant={buttonVariant} to={to} className="w-full mt-4">
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );

  // Bungkus dengan <Link> jika tidak ada button
  if (!showButton) {
    return <Link to={to}>{CardContent}</Link>;
  }

  return CardContent;
}