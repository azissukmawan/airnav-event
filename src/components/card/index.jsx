import { Typography } from "../typography";
import { Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../button";

export default function Card({
  id,
  title,
  date,
  location,
  image,
  status,
}) {
  const statusColor =
    status === "Bisa Daftar"
      ? "bg-primary-20 text-primary"
      : status === "Terdaftar"
      ? "bg-success-20 text-success"
      : status === "Segera Hadir"
      ? "bg-warning-20 text-warning"
      : "bg-typo-surface text-typo-secondary";

  const showButton = [
    "Bisa Daftar",
    "Terdaftar",
    "Segera Hadir",
    "Ditutup",
    "Detail",
  ].includes(status);

  let buttonText = "";
  let buttonVariant = "";
  let to = "";

  if (showButton) {
    if (status === "Ditutup") {
      buttonText = "Tutup";
      buttonVariant = "third";
    } else {
      buttonText = "Detail Acara";
      buttonVariant = "primary";
      to = `/user/event/${id}`;
    }
  }

  const CardContent = (
    <div className="w-full bg-white rounded-2xl shadow border border-gray-200 overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="relative">
        <img src={image} alt={title} className="w-full h-56 object-cover" />
        <Typography
          type="caption1"
          weight="semibold"
          className={`absolute top-3 left-3 ${statusColor} text-xs px-3 py-1 rounded-full shadow`}
        >
          {status}
        </Typography>
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
              <Calendar className="w-4 h-4 text-blue-700" />
              <Typography
                type="caption2"
                weight="medium"
                className="text-blue-700"
              >
                {date}
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
