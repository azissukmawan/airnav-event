import React, { useState } from "react";
import { Button } from "../../../components/button"; // Pastikan path ini benar
import Spinner from "../../../components/spinner"; // Pastikan path ini benar

// Impor Ikon
import { Lock, User, AlertTriangle } from "lucide-react"; // Kita perlu Lock, User, dan AlertTriangle
import AirNav from "../../../assets/airnav-logo.png"; // Pastikan path ini benar
import loginImage from "../../../assets/loginimage.png"; // Pastikan path ini benar

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  // Handler untuk submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("Password reset requested for:", email);
    setTimeout(() => {
      setLoading(false);
      alert(`Instruksi reset password telah dikirim ke ${email} (simulasi)`);
      // Di sini Anda mungkin akan mengarahkan pengguna ke halaman "Cek Email Anda"
    }, 1500);
  };

  return (
    // Wrapper Halaman Penuh
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      {/* Layout Kartu Tunggal (Sama seperti Login/Register/Verify) */}
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Grid Internal (Rasio 4:5 seperti yang Anda minta) */}
        <div className="grid md:grid-cols-[4fr_5fr]">
          {/* === SISI KIRI/ATAS: GAMBAR === */}
          <div
            className="relative flex md:h-auto h-72 flex-col justify-end p-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginImage})` }}
          >
            {/* Logo "kaca buram" */}
            <div className="absolute top-6 left-6 bg-white/30 backdrop-blur-md p-3 rounded-2xl shadow-md">
              <img src={AirNav} alt="AirNav Logo" className="w-20" />
            </div>

            {/* Overlay Gradasi Hitam */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

            {/* Teks Judul (z-10) */}
            <div className="relative text-white z-10">
              <h1 className="text-3xl font-bold mb-2">
                Event Management System
              </h1>
              <p className="text-sm text-gray-200 max-w-sm">
                Satu sistem, semua event terkendali.
              </p>
            </div>
          </div>

          {/* === SISI KANAN/BAWAH: FORMULIR LUPA PASSWORD === */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {/* Konten diletakkan di tengah (sesuai desain) */}
            <div className="flex flex-col items-center text-center">
              <Lock size={96} className="text-blue-700 mb-4" />

              <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
              <p className="text-sm text-gray-500 mb-6">
                Enter your email and get instruction for
                <br />
                resetting your password
              </p>

              {/* Form Email */}
              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
              >
                {/* Input: Email */}
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <User // Sesuai desain, ikonnya User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.Ttarget.value)}
                      className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>

                {/* Tombol Submit (DENGAN PERBAIKAN) */}
                <Button
                  type="submit"
                  variant="primary"
                  // ▼▼▼ PERBAIKAN DI SINI ▼▼▼
                  className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center"
                  disabled={loading}
                >
                  {/* ▼▼▼ DIV PEMBUNGKUS SPINNER DIHAPUS ▼▼▼ */}
                  {loading ? <Spinner /> : "Get Instruction"}
                </Button>
              </form>

              {/* Password Tips */}
              <div className="w-full max-w-sm border border-dashed border-red-300 bg-red-50 p-4 rounded-lg text-left mt-6">
                <div className="flex items-start">
                  <AlertTriangle
                    size={24}
                    className="text-red-500 mr-3 flex-shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-red-600">
                      Password Tips
                    </h4>
                    <p className="text-xs text-red-500 mt-1">
                      Create a memorable and secure password to reduce the need
                      for resets.
                    </p>
                  </div>
                </div>
              </div>

              {/* Link kembali ke Login */}
              <p className="text-center text-sm !mt-6">
                <a
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Kembali ke Login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
