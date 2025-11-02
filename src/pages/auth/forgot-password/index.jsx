import React, { useState } from "react";
import axios from "axios";
import { Button } from "../../../components/button";
import Spinner from "../../../components/spinner";
import { Lock, User, AlertTriangle } from "lucide-react";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Validasi email kosong
    if (!email.trim()) {
      setError("Email wajib diisi!");
      setLoading(false);
      return;
    }

    // Validasi format email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Format email tidak valid!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, {
        email: email,
      });

      console.log("Response:", response.data);

      if (response.data.success || response.status === 200) {
        setSuccess(`Instruksi reset password telah dikirim ke ${email}`);
        setEmail(""); // Kosongkan input
      } else {
        setError("Gagal mengirim email. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error forgot password:", error);
      if (error.response?.status === 404) {
        setError("Email tidak terdaftar dalam sistem.");
      } else if (error.response?.data?.message) {
        setError(error.response.data.message);
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
          <div
            className="relative flex md:h-auto h-72 flex-col justify-end p-10 bg-cover bg-center"
            style={{ backgroundImage: `url(${loginImage})` }}
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

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center">
              <Lock size={96} className="text-blue-700 mb-4" />

              <h2 className="text-2xl font-bold mb-2">Lupa Kata Sandi</h2>
              <p className="text-sm text-gray-500 mb-6">
                Masukan email Anda untuk menerima instruksi
                <br />
                reset kata sandi.
              </p>

              {/* Pesan Error */}
              {error && (
                <div className="w-full max-w-sm mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Pesan Success */}
              {success && (
                <div className="w-full max-w-sm mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-600">{success}</p>
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                className="w-full max-w-sm space-y-4"
              >
                <div className="text-left">
                  <label
                    htmlFor="email"
                    className="text-sm font-medium text-gray-700 mb-1 block"
                  >
                    Email
                  </label>
                  <div className="relative">
                    <User
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      id="email"
                      name="email"
                      placeholder="Masukkan email Anda"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full p-3 pl-10 bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500 text-sm"
                      autoComplete="email"
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full rounded-lg !mt-6 h-11 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? <Spinner /> : "Dapatkan Instruksi"}
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
                      Tips Kata Sandi
                    </h4>
                    <p className="text-xs text-red-500 mt-1">
                      Buat kata sandi yang mudah diingat dan aman untuk
                      mengurangi kebutuhan melakukan reset.
                    </p>
                  </div>
                </div>
              </div>
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
