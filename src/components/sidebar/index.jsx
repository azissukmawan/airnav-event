import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Typography } from "../typography";
import {
  CalendarBlankIcon,
  HouseSimpleIcon,
} from "@phosphor-icons/react";
import {
  LayoutGrid,
  BriefcaseBusiness,
  User,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import AirnavLogo from "../../assets/airnav-logo.png";
import { Button } from "../button";
import axios from "axios";

export default function Sidebar({ role = "admin" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const adminMenu = [
    { label: "Dashboard", path: "/admin", icon: <HouseSimpleIcon size={20} /> },
    {
      label: "Acara",
      path: "/admin/events",
      icon: <CalendarBlankIcon size={20} />,
    }
  ];

  const userMenu = [
    { label: "Event", path: "/user", icon: <LayoutGrid size={20} /> },
    {
      label: "Aktivitas",
      path: "/user/activities",
      icon: <BriefcaseBusiness size={20} />,
    },
  ];

  const userExtraMenu = [
    { label: "Profil", path: "/user/profile", icon: <User size={20} /> },
    {
      label: "Logout",
      path: "/login",
      icon: <LogOut size={20} />,
      isLogout: true,
    },
  ];

  const menuItems = role === "admin" ? adminMenu : userMenu;

  const handleLogout = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      localStorage.removeItem("token");

      setShowLogoutModal(false);
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
      localStorage.removeItem("token");
      setShowLogoutModal(false);
      navigate("/login");
    }
  };

  return (
    <>
      {/* Mobile*/}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-gray-700 hover:text-primary transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="w-20">
            <Link to="/">
              <img src={AirnavLogo} alt="airnavlogo" className="w-full" />
            </Link>
          </div>

          <div className="w-6"></div>
        </div>

        <div
          className={`
            overflow-hidden transition-all duration-300 ease-in-out
            ${isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"}
          `}
        >
          <div className="px-4 py-2 bg-white border-t border-gray-200">
            <div className="flex flex-col space-y-1 items-center">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                >
                  <Typography
                    type="body"
                    weight="medium"
                    className="text-typo p-2"
                  >
                    {item.label}
                  </Typography>
                </Link>
              ))}

              {role === "user" && (
                <>
                  <hr className="border-gray-300 w-full my-2" />
                  {userExtraMenu.map((item) => {
                    if (item.isLogout) {
                      return (
                        <button
                          key={item.label}
                          onClick={() => {
                            setIsOpen(false);
                            setShowLogoutModal(true);
                          }}
                          className="w-full text-center text-typo p-2"
                        >
                          <Typography type="body" weight="medium">
                            {item.label}
                          </Typography>
                        </button>
                      );
                    }
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setIsOpen(false)}
                      >
                        <Typography
                          type="body"
                          weight="medium"
                          className="text-typo p-2"
                        >
                          {item.label}
                        </Typography>
                      </Link>
                    );
                  })}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <nav className="hidden lg:flex sticky top-0 left-0 bg-white text-secondary overflow-y-auto p-4 w-52 h-screen flex-col justify-between">
        <div>
          <div className="w-28 mx-auto mb-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src={AirnavLogo} alt="airnavlogo" />
            </Link>
          </div>

          <hr className="border-gray-300 my-4" />

          <div className="flex flex-col">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;

              return (
                <Link key={item.path} to={item.path}>
                  <Typography
                    type="body"
                    weight="medium"
                    className={`rounded-md p-1.5 my-1 flex items-center gap-2 transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white text-gray-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Typography>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col border-t border-gray-300 pt-4">
          {role === "user" &&
            userExtraMenu.map((item) => {
              const isActive = location.pathname === item.path;

              if (item.isLogout) {
                return (
                  <button
                    key={item.label}
                    onClick={() => setShowLogoutModal(true)}
                    className={`rounded-md p-1.5 my-1 flex items-center gap-2 transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white text-gray-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </button>
                );
              }

              return (
                <Link key={item.path} to={item.path}>
                  <Typography
                    type="body"
                    weight="medium"
                    className={`rounded-md p-1.5 my-1 flex items-center gap-2 transition-colors ${
                      isActive
                        ? "bg-primary text-white"
                        : "hover:bg-primary hover:text-white text-gray-400"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Typography>
                </Link>
              );
            })}

          {role === "admin" && (
            <button
              onClick={() => setShowLogoutModal(true)}
              className="rounded-md p-1.5 mt-1 flex items-center gap-2 text-gray-400 hover:bg-primary hover:text-white transition-colors"
            >
              <LogOut size={20} />
              Logout
            </button>
          )}
        </div>
      </nav>

      {showLogoutModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={() => setShowLogoutModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-lg p-6 w-80 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Typography type="title" weight="semibold" className="mb-3">
              Konfirmasi Logout
            </Typography>
            <Typography type="body" className="text-gray-600 mb-6">
              Apakah Anda yakin ingin keluar dari akun ini?
            </Typography>

            <div className="flex justify-center gap-3">
              <Button variant="red" onClick={() => setShowLogoutModal(false)}>
                Batal
              </Button>
              <Button variant="primary" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
