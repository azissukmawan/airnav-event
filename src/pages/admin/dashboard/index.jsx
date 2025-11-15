import React, { useState, useEffect } from "react";
import Sidebar from "../../../components/sidebar";
import axios from "axios";

import { Typography } from "../../../components/typography";
import { Button } from "../../../components/button";
import { Calendar, ChevronsRight, XCircle, Plus } from "lucide-react";
import AddEvent from "../event-add";

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
  const [isLoading, setIsLoading] = useState(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);

  const handleOpenAddEvent = () => setIsAddEventOpen(true);
  const handleCloseAddEvent = () => setIsAddEventOpen(false);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const token =
          localStorage.getItem("token") || sessionStorage.getItem("token");
        const headers = token
          ? { Authorization: `Bearer ${token}` }
          : undefined;

        const response = await axios.get(
          "https://mediumpurple-swallow-757782.hostingersite.com/api/dashboard-admin/stats",
          { headers }
        );

        if (response.data && response.data.success) {
          const eventStats = response.data.event_stats || {};
          setStats({
            coming_soon: eventStats.coming_soon || 0,
            ongoing: eventStats.ongoing || 0,
            closed: eventStats.closed || 0,
          });
        } else {
          console.error(response.data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex-1 w-full lg:pl-52 pt-20 lg:pt-0 bg-gray-50 min-h-screen">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 space-y-6 overflow-x-hidden">
        {/* Header */}
        <header className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div>
              <Typography
                type="heading3"
                weight="bold"
                className="text-primary-70"
              >
                Selamat Datang Admin !
              </Typography>
              <h4 className="text-sm text-gray-500">System Administrator</h4>
            </div>
          </div>
        </header>

        {/* Tombol Tambah */}
        <div className="flex justify-end mt-5 mb-5">
          <Button
            variant="primary"
            iconLeft={<Plus />}
            onClick={handleOpenAddEvent}
          >
            Tambah Acara
          </Button>
        </div>

        {/* Kartu Statistik */}
        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<Calendar />}
              value={isLoading ? "..." : stats.coming_soon}
              title="Acara Segera Hadir"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<ChevronsRight />}
              value={isLoading ? "..." : stats.ongoing}
              title="Acara Sedang Berlangsung"
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<XCircle />}
              value={isLoading ? "..." : stats.closed}
              title="Acara Berakhir"
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
