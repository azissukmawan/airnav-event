import { Typography } from "../typography";
import { Calendar, MapPin, Building, Laptop, RefreshCcw } from "lucide-react";
import { Button } from "../button";

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
  mdl_kategori,
  role,
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
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${day} ${month} ${year}, ${hours}:${minutes} WIB`;
  };

  const now = new Date();

  const registrationStart = new Date(mdl_pendaftaran_mulai);
  const registrationEnd = new Date(mdl_pendaftaran_selesai);
  const eventEnd = new Date(mdl_acara_selesai);

  const isRegistered = registeredEvents.some(
    (e) => e.modul_acara_id === id
  );

  const isPrivateEvent = ["private", "invite-only"].includes(
    mdl_kategori?.toLowerCase()
  );
  const isRestrictedForUser = isPrivateEvent && role === "peserta";

  let displayStatus = "";
  let statusColor = "";

  if (isRegistered) {
    displayStatus = "Terdaftar";
    statusColor = "bg-success-10 text-success-60";
  } else if (isRestrictedForUser) {
    displayStatus = "Khusus Karyawan";
    statusColor = "bg-white text-primary";
  } else if (now < registrationStart) {
    displayStatus = "Segera Hadir";
    statusColor = "bg-warning-10 text-warning";
  } else if (now >= registrationStart && now <= registrationEnd) {
    displayStatus = "Pendaftaran Dibuka";
    statusColor = "bg-primary-10 text-primary";
  } else if (now > registrationEnd && now < eventEnd) {
    displayStatus = "Pendaftaran Ditutup";
    statusColor = "bg-typo-white2 text-typo-secondary";
  } else if (now >= eventEnd) {
    displayStatus = "Acara Selesai";
    statusColor = "bg-error-10 text-error";
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

  const isEventFinished = now >= eventEnd;
  const isButtonDisabled = isEventFinished;
  const buttonText = "Lihat Detail";
  const buttonVariant = isButtonDisabled ? "third" : "primary";
  const to = isButtonDisabled ? null : `/user/event/${id}`;

  const CardContent = (
    <div className="w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative">
        <img
          src={image || "/no-image.jpg"}
          alt={title}
          className="w-full h-56 object-cover"
        />
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
                className="text-blue-700 capitalize"
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

        {to && !isButtonDisabled ? (
          <Button variant={buttonVariant} to={to} className="w-full mt-4">
            {buttonText}
          </Button>
        ) : (
          <Button
            variant={buttonVariant}
            className="w-full mt-4 cursor-not-allowed opacity-70"
            disabled
          >
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );

  return CardContent;
}