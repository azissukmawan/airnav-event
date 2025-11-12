import React, { useState, useEffect } from "react";
import axios from "axios";
import CardStatus from "../card-status";
import { Users, UserCheck, Lightbulb, Laptop, User } from "lucide-react";

const CardList = ({
  eventId,
  participants = [],
  doorprizeActive = false,
  eventType,
}) => {
  const [stats, setStats] = useState({
    jumlah_pendaftar: 0,
    jumlah_kehadiran: 0,
    online: 0,
    offline: 0,
    jumlah_doorprize: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!eventId) {
        calculateStatsFromParticipants();
        return;
      }

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${API_BASE_URL}/admin/events/${eventId}/stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const statsData = res.data?.data;
        if (statsData && typeof statsData === "object") {
          setStats(statsData);
        } else {
          calculateStatsFromParticipants();
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        calculateStatsFromParticipants();
      } finally {
        setLoading(false);
      }
    };

    const calculateStatsFromParticipants = () => {
      if (!Array.isArray(participants) || participants.length === 0) {
        setStats({
          jumlah_pendaftar: 0,
          jumlah_kehadiran: 0,
          online: 0,
          offline: 0,
          jumlah_doorprize: 0,
        });
        return;
      }

      const jumlahPendaftar = participants.length;
      const jumlahKehadiran = participants.filter(
        (p) => p.status_kehadiran === "hadir" || p.hadir === true
      ).length;
      const online = participants.filter(
        (p) => p.tipe === "online" || p.mdl_tipe === "online"
      ).length;
      const offline = participants.filter(
        (p) => p.tipe === "offline" || p.mdl_tipe === "offline"
      ).length;

      setStats({
        jumlah_pendaftar: jumlahPendaftar,
        jumlah_kehadiran: jumlahKehadiran,
        online: online,
        offline: offline,
        jumlah_doorprize: 0,
      });
    };

    fetchStats();
  }, [eventId, participants]);

  if (loading) {
    return <p className="text-gray-600">Memuat statistik...</p>;
  }

  return (
    <div>
      {error && (
        <div className="mb-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            ⚠️ Menampilkan data dari cache lokal
          </p>
        </div>
      )}

      <div
        className={`flex gap-4 mb-10 ${
          doorprizeActive ? "md:grid-cols-5" : "md:grid-cols-4"
        }`}
      >
        <CardStatus
          icon={<Users className="text-blue-500" />}
          value={stats.jumlah_pendaftar}
          label="Jumlah Pendaftar"
          color="border-blue-500"
        />
        <CardStatus
          icon={<UserCheck className="text-yellow-500" />}
          value={stats.jumlah_kehadiran}
          label="Jumlah Kehadiran"
          color="border-yellow-500"
        />

        {/* tampilkan online/offline hanya jika hybrid */}
        {eventType === "hybrid" && (
          <>
            <CardStatus
              icon={<Laptop className="text-red-500" />}
              value={stats.online}
              label="Online"
              color="border-red-500"
            />
            <CardStatus
              icon={<User className="text-indigo-500" />}
              value={stats.offline}
              label="Offline"
              color="border-indigo-500"
            />
          </>
        )}

        {doorprizeActive && (
          <CardStatus
            icon={<Lightbulb className="text-green-500" />}
            value={stats.jumlah_doorprize}
            label="Status Doorprize"
            color="border-green-500"
          />
        )}
      </div>
    </div>
  );
};

export default CardList;
