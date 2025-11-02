import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/button";
import Spinner from "../../../components/spinner";
import { Eye, EyeOff, Lock } from "lucide-react";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [token] = useState(searchParams.get("token") || "");
  const [email] = useState(searchParams.get("email") || "");

  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Validasi password kosong
    if (!password.trim()) {
      setError("Password wajib diisi!");
      setLoading(false);
      return;
    }

    // Validasi panjang password
    if (password.length < 8) {
      setError("Password minimal harus 8 karakter.");
      setLoading(false);
      return;
    }

    // Validasi token dan email
    if (!token || !email) {
      setError(
        "Token atau email tidak valid. Silakan ulangi proses reset password."
      );
      setLoading(false);
      return;
    }

    const payload = {
      token: token,
      email: email,
      password: password,
      password_confirmation: password,
    };

    try {
      const response = await axios.post(
        `${API_BASE_URL}/reset-password`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      console.log("Response reset password:", response.data);

      setMessage(response.data.message || "Password berhasil diperbarui!");
      setLoading(false);

      // Redirect ke login setelah 2 detik
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Gagal reset password:", err.response?.data || err.message);

      if (err.response?.status === 400) {
        setError("Token tidak valid atau telah kedaluwarsa.");
      } else if (err.response?.status === 404) {
        setError("Email tidak ditemukan.");
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Terjadi kesalahan. Silakan coba lagi nanti.");
      }

      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      <div className="w-full max-w-md md:max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="grid md:grid-cols-[4fr_5fr]">
          {/* === SISI KIRI/ATAS: GAMBAR === */}
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

          {/* === SISI KANAN/BAWAH: FORMULIR === */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center">
              <Lock size={96} className="text-blue-700 mb-4" />

              <h2 className="text-2xl font-bold mb-2">
                Masukkan Kata Sandi Baru
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Buat kata sandi baru. Demi keamanan Anda,
                <br />
                hindari penggunaan kata sandi lama
              </p>

              {/* Pesan Error */}
              {error && (
                <div className="w-full max-w-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Pesan Success */}
              {message && (
                <div className="w-full max-w-sm mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{message}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
              >
                {/* Input: Kata Sandi Baru */}
                <div className="text-left">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type={showPass ? "text" : "password"}
                      id="password"
                      name="password"
                      placeholder="Masukkan kata sandi baru"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
                  <p className="text-xs text-gray-500 mt-2">
                    Password minimal 8 karakter
                  </p>
                </div>

                {/* Tombol Submit */}
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Perbarui Kata Sandi"}
                </Button>

                {/* Tombol Batal */}
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full rounded-lg !mt-2 h-11 flex items-center justify-center bg-transparent text-gray-600 hover:bg-gray-100"
                  onClick={() => navigate("/login")}
                  disabled={loading}
                >
                  Batal
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}