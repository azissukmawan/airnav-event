import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/button";
import Spinner from "../../../components/spinner";
import { Eye, EyeOff, User, Phone, Mail, Lock } from "lucide-react";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    username: "",
    email: "",
    password: "",
    password_confirmation: "",
    status: "karyawan",
  });

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState({});

  // --- Fungsi validasi password ---
  const validatePassword = (password) => {
    const rules = [
      { test: /.{8,}/, message: "Minimal 8 karakter." },
      { test: /[A-Z]/, message: "Harus mengandung minimal 1 huruf besar." },
      { test: /[0-9]/, message: "Harus mengandung minimal 1 angka." },
      {
        test: /[!@#$%^&*(),.?":{}|<>_\-]/,
        message: "Harus mengandung minimal 1 simbol.",
      },
    ];
    for (let rule of rules) {
      if (!rule.test.test(password)) return rule.message;
    }
    return "";
  };

  // --- Validasi semua field ---
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi.";
    else if (formData.name.trim().length < 3)
      newErrors.name = "Nama minimal 3 karakter.";

    if (!formData.phone.trim()) newErrors.telp = "Nomor WhatsApp wajib diisi.";
    else if (!/^[0-9]+$/.test(formData.phone))
      newErrors.telp = "Nomor WhatsApp hanya boleh berisi angka.";
    else if (formData.phone.length < 10)
      newErrors.telp = "Nomor WhatsApp minimal 10 digit.";

    if (!formData.username.trim()) newErrors.username = "Username wajib diisi.";
    else if (formData.username.trim().length < 4)
      newErrors.username = "Username minimal 4 karakter.";

    if (!formData.email.trim()) newErrors.email = "Email wajib diisi.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Format email tidak valid.";
    else if (
      formData.status === "karyawan" &&
      !formData.email.endsWith("@airnavindonesia.co.id")
    ) {
      newErrors.email =
        "Email karyawan harus menggunakan domain @airnavindonesia.co.id.";
    }

    const passwordError = validatePassword(formData.password);
    if (passwordError) newErrors.password = passwordError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleStatusChange = (e) => {
    setFormData((s) => ({ ...s, status: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setErrors({});

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name: formData.name,
        username: formData.username,
        email: formData.email,
        telp: formData.phone,
        password: formData.password,
        password_confirmation: formData.password,
        status_karyawan: formData.status === "karyawan" ? "1" : "0",
      });

      setMessage("Registrasi berhasil! Silakan verifikasi akun Anda.");

      setTimeout(() => {
        navigate("/verify-code", { state: { email: formData.email } });
      }, 1000);
    } catch (error) {
      console.error("Error register:", error.response?.data || error.message);
      const serverErrors = error.response?.data?.errors || {};
      const newErrors = {};

      if (serverErrors.email) newErrors.email = "Email sudah digunakan.";
      if (serverErrors.username)
        newErrors.username = "Username sudah terdaftar.";
      if (serverErrors.telp)
        newErrors.telp = "Nomor WhatsApp tidak valid atau sudah digunakan.";

      setErrors(newErrors);
      setMessage(
        error.response?.data?.message ||
          "Terjadi kesalahan saat registrasi. Coba lagi nanti."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderError = (field) =>
    errors[field] && (
      <p className="text-xs text-red-600 mt-1">{errors[field]}</p>
    );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-[4fr_5fr]">
          {/* SISI GAMBAR */}
          <div
            className="relative flex md:h-auto h-72 flex-col justify-end p-10 bg-cover bg-center"
            style={{ backgroundImage: "url(/loginimage.png)" }}
          >
            <div className="absolute top-6 left-6 bg-white/30 backdrop-blur-md p-3 rounded-2xl shadow-md">
              <img src="/airnav-logo.png" alt="AirNav Logo" className="w-20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
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

          {/* FORM */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">Daftar</h2>

            {/* Pesan Success/Error Global */}
            {message && (
              <div
                className={`mb-4 p-3 rounded-lg ${
                  message.includes("berhasil")
                    ? "bg-green-50 border border-green-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    message.includes("berhasil")
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nama */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="name"
                    placeholder="Nama Lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 text-sm ${
                      errors.name
                        ? "focus:ring-red-500 ring-1 ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                </div>
                {renderError("name")}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  No WhatsApp
                </label>
                <div className="relative">
                  <Phone
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="phone"
                    placeholder="+62 812 3456 7890"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 text-sm ${
                      errors.telp
                        ? "focus:ring-red-500 ring-1 ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                </div>
                {renderError("telp")}
              </div>

              {/* Username */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Username
                </label>
                <div className="relative">
                  <User
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    value={formData.username}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 text-sm ${
                      errors.username
                        ? "focus:ring-red-500 ring-1 ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                </div>
                {renderError("username")}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Email
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="example@mail.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 text-sm ${
                      errors.email
                        ? "focus:ring-red-500 ring-1 ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                </div>
                {renderError("email")}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    placeholder="Masukkan password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 text-sm ${
                      errors.password
                        ? "focus:ring-red-500 ring-1 ring-red-500"
                        : "focus:ring-blue-500"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {renderError("password")}
                <p className="text-xs text-gray-500 mt-2">
                  Password harus minimal 8 karakter, mengandung huruf besar,
                  angka, dan simbol.
                </p>
              </div>

              {/* Status */}
              <div className="mt-4">
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

              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-lg mt-6 h-11 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Daftar"}
              </Button>

              <p className="text-center text-sm mt-4">
                Sudah punya akun?{" "}
                <a
                  href="/login"
                  className="text-blue-600 hover:underline font-medium"
                >
                  Login
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}