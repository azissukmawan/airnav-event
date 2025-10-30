import React, { useState } from "react";
import { Button } from "../../../components/button"; // Pastikan path ini benar
import Spinner from "../../../components/spinner"; // Pastikan path ini benar
import { Eye, EyeOff, User, Phone, Mail, Lock } from "lucide-react";
import AirNav from "../../../assets/airnav-logo.png"; // Pastikan path ini benar
import loginImage from "../../../assets/loginimage.png"; // Pastikan path ini benar

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    status: "karyawan",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleChange = (e) =>
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleStatusChange = (e) => {
    setFormData((s) => ({ ...s, status: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: Arahkan ke /verify-code setelah sukses
    setTimeout(() => {
      setLoading(false);
      // window.location.href = '/verify-code'; // Contoh redirect
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
                Satu sistem, semua event terkendali. Dari perencanaan hingga
                laporan, semuanya jadi lebih cepat dan teratur.
              </p>
            </div>
          </div>

          {/* === SISI KANAN/BAWAH: FORMULIR === */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">Daftar</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input: Nama Lengkap */}
              <div>
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Nama Lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Input: No WhatsApp */}
              <div>
                <label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  No WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    id="phone"
                    name="phone"
                    placeholder="+62 812 3456 7890"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Input: Username */}
              <div>
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Username
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    id="username"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
              </div>

              {/* Input: Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 mb-1 block"
                >
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
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
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Helper Teks Password */}
              <p className="text-xs text-gray-500 !mt-2">
                Minimal 8 karakter, 1 angka, 1 kapital, 1 simbol
              </p>

              {/* Input: Status (Checkbox) */}
              <div className="!mt-4">
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Status
                </label>
                <div className="flex gap-6">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      value="karyawan"
                      checked={formData.status === "karyawan"}
                      onChange={handleStatusChange}
                      className="form-checkbox text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">Karyawan</span>
                  </label>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      name="status"
                      value="nonkaryawan"
                      checked={formData.status === "nonkaryawan"}
                      onChange={handleStatusChange}
                      className="form-checkbox text-blue-600 rounded"
                    />
                    <span className="ml-2 text-sm">Non Karyawan</span>
                  </label>
                </div>
              </div>

              {/* Tombol Submit (DENGAN PERBAIKAN) */}
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center" // <-- TINGGI TETAP h-11
                disabled={loading}
              >
                {loading ? <Spinner /> : "Daftar"}
              </Button>

              {/* Link ke Halaman Login */}
              <p className="text-center text-sm !mt-4">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
