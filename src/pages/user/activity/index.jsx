import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Download, ScanLine } from "lucide-react";
import SearchBar from "../../../components/form/SearchBar";
import Scanner from "./scan";

const Activity = () => {
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const data = response.data.data;
        setUserName(data.name || "User");

        if (data.profile_photo) {
          setProfileImage(data.profile_photo);
        } else {
          const avatarName = encodeURIComponent(data.name || "User");
          setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser.name || "User");
            const avatarName = encodeURIComponent(parsedUser.name || "User");
            setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`${API_BASE_URL}/me/pendaftaran`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const fetchedData = response.data.data.data.map((item) => {
          const acara = item.modul_acara;

          const mulai = new Date(acara.mdl_acara_mulai);
          const selesai = new Date(acara.mdl_acara_selesai);
          const sekarang = new Date();

          const mulaiDate = new Date(mulai.getFullYear(), mulai.getMonth(), mulai.getDate());
          const selesaiDate = new Date(selesai.getFullYear(), selesai.getMonth(), selesai.getDate());
          const sekarangDate = new Date(sekarang.getFullYear(), sekarang.getMonth(), sekarang.getDate());

          let status = "";
          if (sekarangDate < mulaiDate) status = "Belum Dimulai";
          else if (sekarangDate >= mulaiDate && sekarangDate <= selesaiDate)
            status = "On Going";
          else status = "Selesai";

          return {
            id: item.id,
            title: acara.mdl_nama,
            date: acara.mdl_acara_mulai,
            status,
            isDownloaded: item.no_sertifikat !== null,
          };
        });

        setActivities(fetchedData);
      } catch (error) {
        console.error("Gagal memuat aktivitas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
        item.id === selectedActivity.id ? { ...item, status: "Selesai" } : item
      )
    );

    setTimeout(() => {
      setScannerOpen(false);
      setSelectedActivity(null);
    }, 2000);
  };

  if (loading) {
    return (
      <Typography type="body" className="text-gray-600 text-center py-10">
        Memuat aktivitas...
      </Typography>
    );
  }

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
          <Typography type="body" className="text-typo-secondary"></Typography>
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

      <div className="mb-4 w-full">
        <SearchBar
          placeholder="Cari aktivitas..."
          onSearch={(value) => setQuery(value)}
        />
      </div>

      <div className="space-y-4">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((activity) => {
            const statusColor =
              activity.status === "On Going"
                ? "bg-warning-10 text-warning"
                : activity.status === "Belum Dimulai"
                ? "bg-blue-100 text-blue-600"
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
                    {new Date(activity.date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
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

                  {activity.status === "On Going" && (
                    <Button
                      variant="primary"
                      onClick={() => handleScanClick(activity)}
                      iconLeft={<ScanLine size={18} />}
                      className="w-30"
                    >
                      Scan
                    </Button>
                  )}

                  {activity.status === "Selesai" && (
                    <div className="flex items-center gap-3">
                      <Button
                        variant="secondary"
                        iconLeft={<Download size={18} />}
                        className="w-30"
                        onClick={() =>
                          window.open("/user/certificate", "_blank")
                        }
                      >
                        Sertifikat
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <Typography type="body" className="text-gray-600 text-center py-4">
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