import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { Link } from "react-router-dom";

import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import { Bell, Plus, Calendar, ChevronsRight, XCircle } from "lucide-react";
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
  const handleOpenBroadcastForm = () => setOpenBroadcastForm(true);
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const handleOpenAddEvent = () => setIsAddEventOpen(true);
  const handleCloseAddEvent = () => setIsAddEventOpen(false);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar role="admin" />

      <main className="flex-1 px-6 md:px-10 py-8 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <img
              src="#"
              alt="Avatar"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <Typography
                type="heading5"
                weight="bold"
                className="text-gray-900"
              >
                Welcome Lifa !
              </Typography>
              <Typography type="body-small" className="text-gray-500">
                System Administrator
              </Typography>
            </div>
          </div>

          <button
            className="mt-1 mr-2 py-3 px-4 rounded-4xl bg-blue-100"
            onClick={handleOpenBroadcastForm}
          >
            <Bell />
          </button>
        </header>
        {/* Tombol Tambah */}
        <div className="flex justify-end mt-5 mb-5">
          <Link
            
            className="px-8 py-3 rounded-2xl font-semibold bg-blue-900 text-blue-50 hover:bg-blue-200 hover:text-blue-950 transition-colors"
          onClick={() => setIsAddEventOpen(true)} 
          >
            Tambah Acara
          </Link>
        </div>

        <div className="flex flex-wrap gap-4 mb-10">
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<Calendar />}
              value="67"
              title="Event Coming Soon"
              iconBgColor="bg-blue-100"
              iconColor="text-blue-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<ChevronsRight />}
              value="45"
              title="Event OnGoing"
              iconBgColor="bg-yellow-100"
              iconColor="text-yellow-600"
            />
          </div>
          <div className="flex-1 min-w-[250px]">
            <SummaryCard
              icon={<XCircle />}
              value="2"
              title="Event Closed"
              iconBgColor="bg-red-100"
              iconColor="text-red-600"
            />
          </div>
        </div>
         <AddEvent
          isOpen={isAddEventOpen}
          onClose={handleCloseAddEvent}
        />
      </main>
    </div>
  );
}
