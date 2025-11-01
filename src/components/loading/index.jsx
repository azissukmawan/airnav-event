import React, { useEffect, useState } from "react";
import airnavLogoOnly from "../../assets/airnav-logo-notext.png";

export default function Loading() {
  const [fadeOut, setFadeOut] = useState(false);
  const [shouldRender, setShouldRender] = useState(true);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadeOut(true), 10000);
    const removeTimer = setTimeout(() => setShouldRender(false), 10700);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!shouldRender) return null;

  return (
    <div
      className={`fixed inset-0 flex flex-col items-center justify-center 
        bg-white/60 backdrop-blur-lg text-gray-800 z-[9999] 
        transition-opacity duration-700 ease-in-out
        ${fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      {/* LOGO */}
      <div className="relative">
        <div className="absolute inset-0 blur-3xl opacity-50 animate-pulse bg-white/70 rounded-full scale-150"></div>
        <img
          src={airnavLogoOnly}
          alt="AirNav Logo"
          className="relative w-24 h-24 animate-[spin_6s_linear_infinite] drop-shadow-xl"
        />
      </div>

      {/* TEKS */}
      <p className="mt-6 text-base tracking-wide font-medium text-gray-700 animate-pulse">
        Memuat halaman ...
      </p>
    </div>
  );
}
