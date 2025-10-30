import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../button";
import { Typography } from "../typography";
import AirnavLogo from "../../assets/airnav2.png";
import { Search, Cog, CheckCircle, Lock, UserCheck, Menu, X } from "lucide-react";

export default function Navbaru() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col w-full bg-white px-4 lg:px-10 py-3 shadow-sm border-b border-gray-100">
      
      <div className="flex flex-row items-center justify-between w-full gap-3">
        {/* Logo + Text */} 
        <div className="flex items-center gap-2 flex-shrink-0">
          <Link to="/" className="flex items-center gap-2">
            <img src={AirnavLogo} alt="airnavlogo" className="w-10 h-auto" />
          </Link>
          <div className="leading-tight text-left">
            <Typography
              type="title"
              weight="semibold"
              className="text-blue-800 text-base lg:text-lg"
            >
              Event Manager
            </Typography>
            <Typography
              type="caption1"
              weight="medium"
              className="text-gray-600 text-xs lg:text-sm"
            >
              Airnav Indonesia
            </Typography>
          </div>
        </div>

        <div className="flex justify-center w-full lg:mx-6">
          <div className="relative w-full max-w-md lg:max-w-2xl flex items-center">
            <Search
              size={18}
              color="gray"
              className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
            />

            <input
              type="search"
              placeholder="Cari event yang tersedia..."
              className="w-full border border-gray-300 rounded-2xl pl-12 pr-10 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />

            {/* Toggle Button (mobile only) */}
            <button
              className="absolute right-3 md:hidden text-gray-600 hover:text-blue-700"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>  
        </div>

        {/* Auth Buttons (desktop only) */}
        <div className="hidden md:flex items-center gap-2 flex-shrink-0">
          <Link to="">
            <Button variant="primary" className="text-xs lg:text-sm px-3 py-1.5">
              Login
            </Button>
          </Link>
          <Link to="">
            <Button variant="secondary" className="text-xs lg:text-sm px-3 py-1.5">
              Daftar Akun
            </Button>
          </Link>
        </div>
      </div>

      {/* Toggle Menu (mobile only) */}
      {isOpen && (
        <div className="flex flex-col items-center gap-2 mt-3 md:hidden animate-fadeIn">
          <Link to="">
            <Button variant="primary" className="w-full max-w-xs text-sm py-1.5">
              Login
            </Button>
          </Link>
          <Link to="">
            <Button variant="secondary" className="w-full max-w-xs text-sm py-1.5">
              Daftar Akun
            </Button>
          </Link>
        </div>
      )}

      {/* Status Buttons */}
      <div className="flex flex-wrap justify-center items-center gap-3 mt-3">
        <Button
          variant="status"
          iconLeft={<Cog size={14} />}
          className="text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full"
        >
          Segera Hadir
        </Button>
        <Button
          variant="status"
          iconLeft={<CheckCircle size={14} />}
          className="text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full"
        >
          Bisa Daftar
        </Button>
        <Button
          variant="status"
          iconLeft={<Lock size={14} />}
          className="text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full"
        >
          Ditutup
        </Button>
        <Button
          variant="status"
          iconLeft={<UserCheck size={14} />}
          className="text-xs lg:text-sm px-2 lg:px-3 py-1 rounded-full"
        >
          Terdaftar
        </Button>
      </div>
    </nav>
  );
}
