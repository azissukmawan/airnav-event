import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Award, Download, ScanLine } from "lucide-react";
import SearchBar from "../../../components/form/SearchBar";
import Scanner from "./scan";
import Alert from "../../../components/alert";

const Activity = () => {
  const [query, setQuery] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");
  const [alert, setAlert] = useState(null);

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

        const rawData = response.data.data.data;

        const groupedData = rawData.reduce((acc, item) => {
          const acaraId = item.modul_acara_id;
          if (!acc[acaraId]) {
            acc[acaraId] = [];
          }
          acc[acaraId].push(item);
          return acc;
        }, {});

        const fetchedData = Object.values(groupedData).map((group) => {
          const acara = group[0].modul_acara;
          
          const mulai = new Date(acara.mdl_acara_mulai);
          const selesai = new Date(acara.mdl_acara_selesai);
          const sekarang = new Date();

          // Hitung jumlah hari
          const mulaiDate = new Date(mulai.getFullYear(), mulai.getMonth(), mulai.getDate());
          const selesaiDate = new Date(selesai.getFullYear(), selesai.getMonth(), selesai.getDate());
          const diffTime = selesaiDate.getTime() - mulaiDate.getTime();
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;

          let status = "";
          if (sekarang < mulai) status = "Belum Dimulai";
          else if (sekarang >= mulai && sekarang <= selesai)
            status = "Berlangsung";
          else status = "Acara Selesai";

          // Mapping presensi per hari
          const presensiList = group.map((item, index) => ({
            hari: index + 1,
            tanggal: item.presensi?.tanggal_absen || null,
            sudahPresensi: item.presensi !== null,
            waktuAbsen: item.presensi?.waktu_absen || null,
          }));

          // Cek apakah semua hari sudah presensi
          const totalHadir = presensiList.filter(p => p.sudahPresensi).length;
          const semuaHadirAtauSatuHari = diffDays <= 1 ? presensiList[0]?.sudahPresensi : totalHadir === diffDays;

          const sudahLewat = sekarang > selesai;
          const bisaDownload = semuaHadirAtauSatuHari && sudahLewat;
          const getDoorprize = group[0].has_doorprize == 1;

          return {
            id: acara.id,
            title: acara.mdl_nama,
            date: acara.mdl_acara_mulai,
            status,
            jumlahHari: diffDays,
            presensiList,
            totalHadir,
            sudahPresensi: semuaHadirAtauSatuHari,
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

  const handleScanClick = () => {
    setScannerOpen(true);
  };

  const handleScanSuccess = (qrData) => {
    const activityId = qrData;

    setActivities((prev) =>
      prev.map((item) =>
        item.id === activityId
          ? { ...item, sudahPresensi: true }
          : item
      )
    );

    setTimeout(() => {
      setScannerOpen(false);
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

      <div className="mb-4 w-full md:flex space-y-2 md:space-y-0 gap-3">
        <div className="flex-1">
          <SearchBar
            placeholder="Cari aktivitas..."
            onSearch={(value) => setQuery(value)}
          />
        </div>
        <Button
          variant="primary"
          onClick={handleScanClick}
          iconLeft={<ScanLine size={18} />}
          className="whitespace-nowrap"
        >
          Scan QR
        </Button>
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
                      
                      {activity.jumlahHari <= 1 ? (
                        // Acara 1 hari atau kurang
                        activity.sudahPresensi && (
                          <span className="inline-flex items-center gap-2 ml-1 px-2 py-1 rounded-md text-sm font-semibold text-success-70 bg-success-10">
                            Hadir
                          </span>
                        )
                      ) : (
                        // Acara lebih dari 1 hari
                        activity.presensiList.map((presensi) => 
                          presensi.sudahPresensi && (
                            <span
                              key={presensi.hari}
                              className="inline-flex items-center gap-1 ml-1 px-2 py-1 rounded-md text-sm font-semibold text-success-70 bg-success-10"
                            >
                              Hadir Hari {presensi.hari}
                            </span>
                          )
                        )
                      )}
                      
                      {/* Badge doorprize */}
                      {activity.getDoorprize && (
                        <span className="inline-flex items-center gap-1 ml-1 px-2 py-1 rounded-md text-sm font-semibold text-warning-70 bg-warning-10">
                          <Award size={12}/>Pemenang Doorprize
                        </span>
                      )}
                    </Typography>
                  </div>

                  {/* Sertifikat */}
                  {activity.totalHadir > 0 && (
                    activity.isDownloaded ? (
                      <Button
                        variant="secondary"
                        iconLeft={<Download size={18} />}
                        className="w-30"
                        onClick={async () => {
                          console.log(activity);
                          try {
                            const token = localStorage.getItem("token");

                            const response = await axios.get(
                              `${API_BASE_URL}/sertifikat/acara/${activity.id}/download`,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                                responseType: 'blob'
                              }
                            );

                            const url = window.URL.createObjectURL(new Blob([response.data]));
                            const link = document.createElement('a');
                            link.href = url;
                            link.setAttribute('download', `Sertifikat-${activity.title}.pdf`);
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                            window.URL.revokeObjectURL(url);

                            setAlert({
                              message: "Sertifikat berhasil diunduh",
                              type: "success",
                            });
                          } catch (error) {
                            console.error("Gagal download sertifikat:", error);
                            setAlert({
                              message:
                                error.response?.data?.message ||
                                "Terjadi kesalahan saat mengunduh sertifikat",
                              type: "error",
                            });
                          }
                        }}
                      >
                        Sertifikat
                      </Button>
                    ) : (
                      <Button
                        variant="third"
                        iconLeft={<Download size={18} />}
                        className="w-30 opacity-60 cursor-not-allowed"
                        disabled
                      >
                        Sertifikat
                      </Button>
                    )
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
        activityTitle="Scan QR untuk Presensi"
      />
    </div>
  );
};

export default Activity;