import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Award, Download, ScanLine } from "lucide-react";
import SearchBar from "../../../components/form/SearchBar";
import Scanner from "./scan";
import Alert from "../../../components/alert";
import { useNavigate } from "react-router-dom";

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
            status = "Berlangsung";
          else status = "Acara Selesai";

          const sudahPresensi = item.presensi !== null;
          const sudahLewat = sekarang > selesai;
          const bisaDownload = sudahPresensi && sudahLewat;
          const getDoorprize = item.has_doorprize == 1;

          return {
            id: acara.id,
            title: acara.mdl_nama,
            date: acara.mdl_acara_mulai,
            status,
            sudahPresensi,
            getDoorprize,
            isDownloaded: bisaDownload,
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
    setActivities((prev) =>
      prev.map((item) =>
        item.id === selectedActivity.id
          ? { ...item, sudahPresensi: true }
          : item
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
  }

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
              activity.status === "Berlangsung"
                ? "bg-success-10 text-success"
                : activity.status === "Belum Dimulai"
                ? "bg-blue-100 text-blue-600"
                : "bg-error-10 text-error";

            return (
              <div
                key={activity.id}
                className="w-full bg-white p-4 rounded-xl shadow-sm space-y-2"
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

                <div className="md:flex items-center justify-between space-y-2">
                  <div className="md:flex">
                    <Typography type="caption1" className="text-gray-600">
                      Status:{" "}
                      <span
                        className={`inline-flex items-center gap-2 ml-1 px-2 py-1 rounded-md text-sm font-semibold ${statusColor}`}
                      >
                        {activity.status}
                      </span>
                      {activity.sudahPresensi && (
                        <span className="inline-flex items-center gap-2 ml-1 px-2 py-1 rounded-md text-sm font-semibold text-success-70 bg-success-10">Hadir</span>
                      )}
                      {activity.getDoorprize && (
                        <span className="inline-flex items-center gap-1 ml-1 px-2 py-1 rounded-md text-sm font-semibold text-warning-70 bg-warning-10"><Award size={12}/>Pemenang Doorprize</span>
                      )}
                    </Typography>
                  </div>

                  {activity.isDownloaded ? (
                    <Button
                      variant="secondary"
                      iconLeft={<Download size={18} />}
                      className="w-30"
                      onClick={async () => {
                        console.log(activity);
                        try {
                          const token = localStorage.getItem("token");

                          const response = await axios.post(
                            `${API_BASE_URL}/sertifikat/generate`,
                            { id_acara: activity.id },
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                                "Content-Type": "application/json",
                              },
                            }
                          );

                          // Simpan data sertifikat
                          localStorage.setItem(
                            "cert_data",
                            JSON.stringify(response.data)
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
                    activity.status !== "Acara Selesai" ? (
                    <Button
                      variant="third"
                      iconLeft={<Download size={18} />}
                      className="w-30 opacity-60 cursor-not-allowed"
                      disabled
                    >
                      Sertifikat
                    </Button>
                  ) : activity.status === "Berlangsung" ? (
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
