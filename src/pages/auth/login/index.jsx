import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/button";
import Spinner from "../../../components/spinner";
import { Eye, EyeOff, Lock, User } from "lucide-react";

export default function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    password: "",
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleRememberChange = (e) => {
    setRememberMe(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.usernameOrEmail.trim() || !formData.password.trim()) {
      setError("Username/Email dan Password harus diisi.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        login: formData.usernameOrEmail,
        password: formData.password,
      });

      // Di bagian setelah login sukses
      if (response.data.success) {
        const userData = response.data.data.user;
        const token = response.data.data.access_token;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("token", token);
        localStorage.setItem("role", userData.role?.toLowerCase() || "user");

        if (rememberMe) localStorage.setItem("rememberMe", "true");

        // Cek kode presensi pending
        const pendingKode = localStorage.getItem("pendingPresensiKode");
        const redirectTo = pendingKode
          ? `/presensi/${pendingKode}`
          : localStorage.getItem("redirectAfterLogin");

        // Hapus storage sementara
        localStorage.removeItem("pendingPresensiKode");
        localStorage.removeItem("redirectAfterLogin");

        if (redirectTo) {
          navigate(redirectTo);
        } else if (
          userData.role?.toLowerCase() === "superadmin" ||
          userData.role?.toLowerCase() === "admin"
        ) {
          navigate("/admin");
        } else {
          navigate("/user");
        }
      } else {
        console.error("Login tidak berhasil:", response.data);
        setError(response.data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error login:", error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else if (error.response?.status === 401) {
        setError("Username/Email atau Password salah.");
      } else if (error.response?.status === 422) {
        setError("Data yang dimasukkan tidak valid.");
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-[4fr_5fr]">
          {/* KIRI: Gambar */}
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

          {/* KANAN: Form Login */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h2 className="text-2xl font-bold text-center mb-6">Masuk</h2>
            <p className="text-sm text-gray-500 text-center mb-6 -mt-4">
              Silakan masuk untuk melanjutkan
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username / Email */}
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

              {/* Password */}
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
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
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

              {/* Tombol Login */}
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center"
                disabled={loading}
              >
                {loading ? <Spinner /> : "Masuk"}
              </Button>

              {/* Daftar */}
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
