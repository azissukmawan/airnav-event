import { useState } from "react";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Download, ScanLine, Bell } from "lucide-react";
import SearchBar from "../../../components/form/SearchBar";
import Scanner from "./scan";

const Activity = () => {
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([
    {
      id: 1,
      title: "HUT AirNav Indonesia",
      date: "20 November 2025",
      status: "On Going",
      isDownloaded: false,
    },
    {
      id: 2,
      title: "Pelatihan Safety Management",
      date: "5 October 2025",
      status: "Selesai",
      isDownloaded: false,
    },
    {
      id: 3,
      title: "Workshop Inovasi Digital",
      date: "15 December 2025",
      status: "Selesai",
      isDownloaded: true,
    },
  ]);

  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleDownload = (id) => {
    setActivities((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isDownloaded: true } : item
      )
    );
    console.log("Download sertifikat untuk id:", id);
  };

  const handleScanClick = (activity) => {
    setSelectedActivity(activity);
    setScannerOpen(true);
  };

  const handleScanSuccess = (qrData) => {
    console.log("QR Code scanned:", qrData);
    console.log("Activity:", selectedActivity);

    setActivities((prev) =>
      prev.map((item) =>
        item.id === selectedActivity.id
          ? { ...item, status: "Selesai" }
          : item
      )
    );

    setTimeout(() => {
      setScannerOpen(false);
      setSelectedActivity(null);
    }, 2000);
  };

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
            Aktivitas Saya
          </h1>
          <h1 className="text-sm md:text-md text-typo-secondary mb-1">
            Berikut daftar aktivitas yang tersedia
          </h1>
          <Typography type="body" className="text-typo-secondary">
          </Typography>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="p-3 rounded-full bg-primary-10 text-primary"
            onClick={() => {}}
          >
            <Bell />
          </button>
          <img 
            src="https://ui-avatars.com/api/?name=User+Name&size=200&background=3b82f6&color=fff&bold=true"
            alt="Profile" 
            className="hidden lg:block w-14 h-14 rounded-full object-cover border-gray-200 shadow-sm"
          />
        </div>
      </div>

      <div className="mb-4 w-full">
        <SearchBar
          placeholder="Cari aktivitas..."
          onSearch={(value) => setQuery(value)}
        />
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const isOngoing = activity.status === "On Going";
            const statusColor = isOngoing
              ? "bg-warning-10 text-warning"
              : "bg-success-10 text-success";

            return (
              <div
                key={activity.id}
                className="w-full bg-white p-4 rounded-xl shadow-sm space-y-4"
              >
                <div className="flex justify-between p-3 bg-blue-50 text-primary rounded-xl">
                  <Typography type="body" weight="bold">
                    {activity.title}
                  </Typography>
                  <Typography type="body" weight="bold">
                    <span className="block md:hidden">
                      {new Date(activity.date).toLocaleDateString("id-ID")}
                    </span>
                    <span className="hidden md:block">
                      {new Date(activity.date).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </Typography>
                </div>

                <div className="flex items-center justify-between">
                  <Typography type="caption1" className="text-gray-600">
                    Status:{" "}
                    <span
                      className={`inline-flex items-center gap-2 ml-1 px-2 py-1 rounded-md text-sm font-semibold ${statusColor}`}
                    >
                      {activity.status}
                    </span>
                  </Typography>

                  {isOngoing ? (
                    <Button
                      variant="primary"
                      onClick={() => handleScanClick(activity)}
                      iconLeft={<ScanLine size={18} />}
                      className="w-30"
                    >
                      Scan
                    </Button>
                  ) : (
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-3 h-3 rounded-full ${
                          activity.isDownloaded ? "bg-gray-400" : "bg-success"
                        }`}
                        title={
                          activity.isDownloaded
                            ? "Sertifikat sudah diunduh"
                            : "Sertifikat belum diunduh"
                        }
                      ></span>

                      <Button
                        variant={activity.isDownloaded ? "third" : "secondary"}
                        onClick={() => handleDownload(activity.id)}
                        iconLeft={<Download size={18} />}
                        className="w-30"
                        disabled={activity.isDownloaded}
                      >
                        {activity.isDownloaded ? "Terunduh" : "Sertifikat"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <Typography
            type="body"
            className="text-gray-600 text-center py-4"
          >
            Tidak ada aktivitas yang cocok dengan pencarian.
          </Typography>
        )}
      </div>

      <Scanner
        isOpen={scannerOpen}
        onClose={() => {
          setScannerOpen(false);
          setSelectedActivity(null);
        }}
        onScanSuccess={handleScanSuccess}
        activityTitle={selectedActivity?.title || ""}
      />
    </div>
  );
};

export default Activity;