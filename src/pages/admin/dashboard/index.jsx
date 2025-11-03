import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import { Link } from "react-router-dom";
import axios from "axios";

import { Typography } from "../../../components/typography";
import { Calendar, ChevronsRight, XCircle } from "lucide-react";
import AddEvent from "../../../components/AddEvent";

function SummaryCard({ icon, title, value, iconBgColor, iconColor }) {
  return (
    <div className="flex items-center gap-3 bg-white p-5 rounded-xl shadow-sm border border-gray-100 hover:shadow transition-all duration-200">
      <div className={`p-3 rounded-full ${iconBgColor}`}>
        {React.cloneElement(icon, { size: 22, className: iconColor })}
      </div>
      <div>
        <Typography type="heading5" weight="bold" className="text-gray-900">
          {value}
        </Typography>
        <Typography type="body-small" className="text-gray-500">
          {title}
        </Typography>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    coming_soon: 0,
    ongoing: 0,
    closed: 0,
  });

  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const handleOpenAddEvent = () => setIsAddEventOpen(true);
  const handleCloseAddEvent = () => setIsAddEventOpen(false);

    // 🔹 Fetch data dari API saat komponen dimuat
  useEffect(() => {
    axios
      .get("https://mediumpurple-swallow-757782.hostingersite.com/api/dashboard-admin/stats")
      .then((response) => {
        if (response.data && response.data.success) {
          const eventStats = response.data.event_stats;
          setStats({
            coming_soon: eventStats.coming_soon || 0,
            ongoing: eventStats.ongoing || 0,
            closed: eventStats.closed || 0,
          });
        } else {
          console.error("Struktur data tidak sesuai:", response.data);
        }
      })
      .catch((error) => {
        console.error("Gagal ambil data stats:", error);
      });
  }, []);
  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0">
      <Sidebar role="admin" />

      <main className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            
            <div>
              <Typography
                type="heading5"
                weight="bold"
                className="text-gray-900"
              >
                Welcome Admin !
              </Typography>
              <Typography type="body-small" className="text-gray-500">
                System Administrator
              </Typography>
            </div>
          </div>
        </header>

        {/* Tombol Tambah */}
        <div className="flex justify-end mt-5 mb-5">
          <Link
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
            onClick={handleOpenAddEvent}
          >
            Tambah Acara
          </Link>
        </div>

        {/* Kartu Statistik */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<Calendar />}
              value={stats.coming_soon}
              title="Event Coming Soon"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<ChevronsRight />}
              value={stats.ongoing}
              title="Event OnGoing"
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<XCircle />}
              value={stats.closed}
              title="Event Closed"
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />
          </div>
        </div>

        <AddEvent isOpen={isAddEventOpen} onClose={handleCloseAddEvent} />
      </main>
    </div>
  );
}
