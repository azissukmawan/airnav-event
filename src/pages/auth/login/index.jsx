import React, { useState } from "react";
import { Button } from "../../../components/button"; // Pastikan path ini benar
import Spinner from "../../../components/spinner"; // Pastikan path ini benar
import { Eye, EyeOff, Lock, User } from "lucide-react";
import AirNav from "../../../assets/airnav-logo.png"; // Pastikan path ini benar
import loginImage from "../../../assets/loginimage.png"; // Pastikan path ini benar

export default function Login() {
  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert("Login simulasi selesai");
    }, 1500);
  };

  return (
    // Wrapper Halaman Penuh
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      {/* Layout Kartu Tunggal (Responsif) */}
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Grid Internal (Mobile: 1 kolom, Desktop: 2 kolom) */}
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
            {/* Teks Judul */}
            <div className="relative text-white z-10">
              <h1 className="text-3xl font-bold mb-2">
                Event Management System
              </h1>
              <p className="text-sm text-gray-200 max-w-sm">
                Satu sistem, semua event terkendali.
              </p>
            </div>
          </div>

          {/* === SISI KANAN/BAWAH: FORMULIR === */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">Masuk</h2>
            <p className="text-sm text-gray-500 text-center mb-6 -mt-4">
              Silakan masuk untuk melanjutkan
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input: Username / Email */}
              <div>
                <label
                  htmlFor="usernameOrEmail"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Username / Email
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    id="usernameOrEmail"
                    name="usernameOrEmail"
                    placeholder="Masukkan username / email"
                    value={formData.usernameOrEmail}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Input: Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    aria-label="Toggle password"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Checkbox "Remember Me" dan "Lupa kata sandi?" */}
              <div className="flex items-center justify-between !mt-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={rememberMe}
                    onChange={handleRememberChange}
                    className="form-checkbox text-blue-600 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember Me
                  </span>
                </label>
                <a
                  href="/forgot-password"
                  className="text-sm text-blue-600 hover:underline font-medium"
                >
                  Lupa kata sandi?
                </a>
              </div>

              {/* Tombol Submit (DENGAN PERBAIKAN) */}
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center" // <-- TINGGI TETAP h-11
                disabled={loading}
              >
                {loading ? <Spinner /> : "Masuk"}
              </Button>

              {/* Link ke Halaman Register */}
              <p className="text-center text-sm !mt-4">
                Belum punya akun?{" "}
                <a
                  href="/register"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Daftar
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
