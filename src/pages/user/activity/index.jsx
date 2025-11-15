import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Award, Download, ScanLine, Clock, MessageCircle, X, CalendarCheck } from "lucide-react";
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
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedDayDetail, setSelectedDayDetail] = useState(null);

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

  const [isPolling, setIsPolling] = useState(false);

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

        const presensiPerHari = acara.presensi_per_hari || {};
        const totalHari = Object.keys(presensiPerHari).filter(key => key.startsWith("Hari-")).length;

        let status = "";
        if (sekarang < mulai) status = "Belum Dimulai";
        else if (sekarang >= mulai && sekarang <= selesai)
          status = "Berlangsung";
        else status = "Acara Selesai";

        const presensiList = Array.from({length: totalHari}, (_, index) => {
          const hariKe = index + 1;
          const hariKey = `Hari-${hariKe}`;
          const presensiHari = presensiPerHari[hariKey];

          let sudahPresensi = false;
          let tanggalSesi = null;
          let detailSesi = [];
          let totalSesi = 0;
          let totalHadir = 0;
          let statusPresensi = "belum";

          if (presensiHari) {
            const sesiArray = Object.entries(presensiHari).map(([key, sesi]) => ({
              nama: key,
              ...sesi
            }));

            totalSesi = sesiArray.length;
            totalHadir = sesiArray.filter(sesi => sesi.status === "Hadir").length;
            
            sudahPresensi = totalHadir > 0;

            if (sesiArray.length > 0) {
              tanggalSesi = sesiArray[0].tanggal_sesi;
            }

            detailSesi = sesiArray;

            if (totalHadir === totalSesi) {
              statusPresensi = "penuh";
            } else if (totalHadir > 0) {
              statusPresensi = "sebagian";
            } else {
              statusPresensi = "tidak-hadir";
            }
          }

          const hariSudahLewat = tanggalSesi ? (new Date(tanggalSesi) < sekarang) : false;

          return {
            hari: hariKe,
            tanggal: tanggalSesi,
            sudahPresensi: sudahPresensi,
            presensiHari: presensiHari || null,
            detailSesi: detailSesi,
            totalSesi: totalSesi,
            totalHadir: totalHadir,
            statusPresensi: statusPresensi,
            hariSudahLewat: hariSudahLewat,
          };
        });

        const totalHadir = presensiList.filter(p => p.sudahPresensi).length;
        const semuaHadirAtauSatuHari = totalHari <= 1 ? presensiList[0]?.sudahPresensi : totalHadir === totalHari;

        const sudahLewat = sekarang > selesai;
        const bisaDownload = semuaHadirAtauSatuHari && sudahLewat;
        const getDoorprize = group[0].has_doorprize == 1;

        return {
          id: acara.id,
          title: acara.mdl_nama,
          start_date: acara.mdl_acara_mulai,
          end_date: acara.mdl_acara_selesai,
          whatsapp: acara.mdl_link_wa,
          status,
          jumlahHari: totalHari,
          presensiList,
          totalHadir,
          sudahPresensi: semuaHadirAtauSatuHari,
          getDoorprize,
          isDownloaded: bisaDownload,
        };
      });

      setActivities(fetchedData);
    } catch (error) {
      console.error("Gagal fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();

    const pollInterval = setInterval(() => {
      if (isPolling) {
        fetchActivities();
      }
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [isPolling]);

  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
    setSelectedDayDetail(null);
    setIsPolling(false);
  };

  const handleScanSuccess = async (qrData) => {
    try {
      await fetchActivities();
      
      setTimeout(() => {
        setScannerOpen(false);
      }, 2000);
    } catch (error) {
      console.error("Gagal refresh data setelah scan:", error);
      setTimeout(() => {
        setScannerOpen(false);
      }, 2000);
    }
  };
  
  const filteredActivities = activities.filter((activity) =>
    activity.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleScanClick = () => {
    setScannerOpen(true);
  };

  const handleDayClick = (presensi, activityTitle) => {
    const hariSudahTiba = presensi.tanggal ? (new Date(presensi.tanggal) <= new Date()) : false;
    if (!hariSudahTiba) return;
    if (presensi.detailSesi && presensi.detailSesi.length > 0) {
      setSelectedDayDetail({
        hari: presensi.hari,
        tanggal: presensi.tanggal,
        detailSesi: presensi.detailSesi,
        activityTitle: activityTitle
      });
      setShowDetailModal(true);
      setIsPolling(true);
    }
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
                <div className="md:flex justify-between p-2 bg-blue-50 text-primary rounded-xl items-center">
                  <Link 
                    to={`/user/event/${activity.id}`}
                    className="hover:underline transition-all"
                  >
                    <Typography type="body" weight="bold">
                      {activity.title}
                    </Typography>
                  </Link>
                  <div className="md:flex gap-2 items-center mt-2 md:mt-0">
                    {/* Tanggal */}
                    <Typography type="body" weight="bold">
                      {(() => {
                        const startDate = new Date(activity.start_date);
                        const endDate = new Date(activity.end_date);

                        const isSameDay = 
                          startDate.getDate() === endDate.getDate() &&
                          startDate.getMonth() === endDate.getMonth() &&
                          startDate.getFullYear() === endDate.getFullYear();
                        
                        if (isSameDay) {
                          return startDate.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                        } else {
                          const isSameMonth = 
                            startDate.getMonth() === endDate.getMonth() &&
                            startDate.getFullYear() === endDate.getFullYear();
                          
                          if (isSameMonth) {
                            return `${startDate.getDate()}-${endDate.getDate()} ${startDate.toLocaleDateString("id-ID", {
                              month: "long",
                              year: "numeric",
                            })}`;
                          } else {
                            return `${startDate.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                            })} - ${endDate.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })}`;
                          }
                        }
                      })()}
                    </Typography>
                    
                    {/* Jam */}
                    <div className="w-31 flex p-2 bg-white gap-2 items-center justify-center rounded-md">
                      <Clock size={16}/>
                      <Typography type="caption1" weight="bold">
                        {new Date(activity.start_date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}-{new Date(activity.end_date).toLocaleTimeString("id-ID", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="md:flex items-center justify-between space-y-2 md:space-y-0">
                  <div>
                    <Typography type="caption1" className="text-gray-600">
                      Status:{" "}
                      <span
                        className={`inline-flex items-center gap-2 ml-1 px-2 py-1 rounded-md text-sm font-semibold ${statusColor}`}
                      >
                        {activity.status}
                      </span>
                    </Typography>
                  </div>
                  
                  {/* Badge doorprize */}
                  <div>
                    {activity.getDoorprize && (
                      <p className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-sm font-semibold text-warning-70 bg-warning-10">
                        <Award size={12}/>Pemenang Doorprize
                      </p>
                    )}
                  </div>
                </div>

                {/* Kehadiran */}
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-2">
                  {activity.jumlahHari <= 1 ? (
                    // Acara 1 hari atau kurang
                    (() => {
                      const presensi = activity.presensiList[0];
                      let bgClass = 'bg-gray-50 border-gray-300';
                      let iconComponent = <Clock size={20} className="text-gray-400" />;

                      if (presensi.statusPresensi === "penuh") {
                        bgClass = 'bg-success-10 border-success-70';
                        iconComponent = <CalendarCheck size={20} className="text-success-70" />;
                      } else if (presensi.statusPresensi === "sebagian" && presensi.hariSudahLewat) {
                        bgClass = 'bg-warning-10 border-warning-70';
                        iconComponent = <CalendarCheck size={20} className="text-warning-70" />;
                      } else if (presensi.statusPresensi === "tidak-hadir" && presensi.hariSudahLewat) {
                        bgClass = 'bg-error-10 border-error-70';
                        iconComponent = <X size={20} className="text-error-70" />;
                      }

                      return (
                        <div 
                          className={`p-4 rounded-xl border-2 flex items-center justify-center cursor-pointer hover:opacity-80 transition-opacity ${bgClass}`}
                          onClick={() => handleDayClick(presensi, activity.title)}
                        >
                          <div className="flex items-center gap-2">
                            {iconComponent}
                            <div>
                              <p className="text-sm font-semibold">Hari 1</p>
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    // Acara lebih dari 1 hari
                    activity.presensiList.map((presensi) => {
                      let bgClass = 'bg-gray-50 border-gray-300';
                      let iconComponent = <Clock size={20} className="text-gray-500" />;

                      if (presensi.statusPresensi === "penuh") {
                        bgClass = 'bg-success-10 border-success-70';
                        iconComponent = <CalendarCheck size={20} className="text-success-70" />;
                      } else if (presensi.statusPresensi === "sebagian" && presensi.hariSudahLewat) {
                        bgClass = 'bg-warning-10 border-warning-70';
                        iconComponent = <CalendarCheck size={20} className="text-warning-70" />;
                      } else if (presensi.statusPresensi === "tidak-hadir" && presensi.hariSudahLewat) {
                        bgClass = 'bg-error-10 border-error-70';
                        iconComponent = <X size={20} className="text-error-70" />;
                      }

                      return (
                        <div 
                          key={presensi.hari}
                          className={`p-4 rounded-xl border-2 flex items-center justify-center space-x-2 cursor-pointer hover:opacity-80 transition-opacity ${bgClass}`}
                          onClick={() => handleDayClick(presensi, activity.title)}
                        >
                          <div className="flex items-center">
                            {iconComponent}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">Hari {presensi.hari}</p>
                            {
                              presensi.tanggal && (
                                <p className="text-xs text-gray-600">
                                  {new Date(presensi.tanggal).toLocaleDateString("id-ID", {
                                    day: "numeric",
                                    month: "long",
                                  })}
                                </p>
                              )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {/* Sertifikat */}
                  {activity.totalHadir > 0 &&
                    (activity.isDownloaded ? (
                      <Button
                        variant="secondary"
                        iconLeft={<Download size={18} />}
                        className="w-full md:w-auto"
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem("token");

                            const response = await axios.post(
                              `${API_BASE_URL}/events/${activity.id}/generate-sertif`,
                              null,
                              {
                                headers: {
                                  Authorization: `Bearer ${token}`,
                                },
                              }
                            );

                            const fileUrl = response.data?.data;

                            if (fileUrl) {
                              window.open(fileUrl, "_blank");

                              setAlert({
                                message:
                                  "Sertifikat berhasil digenerate dan dibuka di tab baru",
                                type: "success",
                              });
                            } else {
                              throw new Error(
                                "URL file tidak ditemukan dalam response"
                              );
                            }
                          } catch (error) {
                            console.error("Gagal membuka sertifikat:", error);
                            setAlert({
                              message:
                                error.response?.data?.message ||
                                "Terjadi kesalahan saat membuka sertifikat",
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
                        className="w-full md:w-auto opacity-60 cursor-not-allowed"
                        disabled
                      >
                        Sertifikat
                      </Button>
                  ))}
                  {/* Whatsapp Group */}
                  <Button
                    variant="green1"
                    onClick={() => window.open(activity.whatsapp, '_blank')}
                    iconLeft={<MessageCircle size={18} />}
                    className="w-full md:w-auto whitespace-nowrap"
                  >
                    WhatsApp Group
                  </Button>
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

      {/* Modal Detail Sesi */}
      {showDetailModal && selectedDayDetail && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Detail Presensi</h2>
                <p className="text-sm text-gray-600">{selectedDayDetail.activityTitle}</p>
                <p className="text-sm font-semibold text-gray-700 mt-1">
                  Hari {selectedDayDetail.hari}
                  {selectedDayDetail.tanggal && (
                    <span className="text-gray-500 ml-2">
                      ({new Date(selectedDayDetail.tanggal).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })})
                    </span>
                  )}
                </p>
              </div>
              <button
                onClick={handleCloseDetailModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              {selectedDayDetail.detailSesi.map((sesi) => (
                <div
                  key={sesi.nama}
                  className={`p-4 rounded-lg border-2 ${
                    sesi.status === "Hadir"
                      ? "bg-success-10 border-success-70"
                      : "bg-gray-50 border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {sesi.status === "Hadir" ? (
                        <div className="w-8 h-8 rounded-full bg-success-70 flex items-center justify-center">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <Clock size={24} className="text-gray-400" />
                      )}
                      <div>
                        <p className="font-semibold text-gray-800">{sesi.nama}</p>
                        <p className={`text-sm font-bold ${
                          sesi.status === "Hadir" ? "text-success-70" : "text-gray-500"
                        }`}>
                          {sesi.status}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

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
