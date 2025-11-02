import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Download, ScanLine } from "lucide-react";
import SearchBar from "../../../components/form/SearchBar";
import Scanner from "./scan";
import Alert from "../../../components/alert";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

const Activity = () => {
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [alert, setAlert] = useState(null);

  const navigate = useNavigate();

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

          let status = "";
          if (sekarang < mulai) status = "Belum Dimulai";
          else if (sekarang >= mulai && sekarang <= selesai)
            status = "On Going";
          else status = "Selesai";

          const sudahPresensi = item.presensi !== null;
          const sudahLewat = sekarang > selesai;
          const bisaDownload = sudahPresensi && sudahLewat;

          return {
            id: item.id,
            eventId: acara.id,
            title: acara.mdl_nama,
            date: acara.mdl_acara_mulai,
            status,
            sudahPresensi,
            isDownloaded: bisaDownload,
            templateUrl: acara.mdl_template_sertifikat_url,
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
  };

  return (
    <div>
      {/* Container alert fixed di kanan atas */}
      <div className="fixed top-4 right-4 z-50">
        {alert && (
          <Alert
            message={alert.message}
            type={alert.type}
            onClose={() => setAlert(null)}
          />
        )}
      </div>

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

                  {activity.isDownloaded ? (
                    <Button
                      variant="secondary"
                      iconLeft={<Download size={18} />}
                      className="w-30"
                      onClick={async () => {
                        console.log("Activity data:", activity);
                        console.log("Template URL:", activity.templateUrl);
                        try {
                          const token = localStorage.getItem("token");

                          // POST ke API untuk generate sertifikat
                          const response = await axios.post(
                            `${API_BASE_URL}/sertifikat/generate`,
                            { id_acara: activity.eventId },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                            }
                          );

                          console.log("API Response:", response.data);

                          // Simpan data sertifikat + template URL dari activity
                          const certData = {
                            ...response.data,
                            templateUrl: activity.templateUrl || "/cert.jpg"
                          };

                          console.log("Saving to localStorage:", certData);

                          localStorage.setItem(
                            "cert_data",
                            JSON.stringify(certData)
                          );

                          // Redirect ke halaman certificate
                          window.open("/user/certificate", "_blank");
                        } catch (error) {
                          console.error("Gagal generate sertifikat:", error);
                          setAlert({
                            message:
                              error.response?.data?.message ||
                              "Terjadi kesalahan",
                            type: "error",
                          });
                        }
                      }}
                    >
                      Sertifikat
                    </Button>
                  ) : activity.sudahPresensi &&
                    activity.status !== "Selesai" ? (
                    <Button
                      variant="third"
                      iconLeft={<Download size={18} />}
                      className="w-30 opacity-60 cursor-not-allowed"
                      disabled
                    >
                      Sertifikat
                    </Button>
                  ) : activity.status === "On Going" ? (
                    <Button
                      variant="primary"
                      onClick={() => handleScanClick(activity)}
                      iconLeft={<ScanLine size={18} />}
                      className="w-30"
                    >
                      Scan
                    </Button>
                  ) : null}
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