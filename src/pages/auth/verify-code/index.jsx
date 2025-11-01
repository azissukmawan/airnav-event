import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Button } from "../../../components/button";
import Modal from "../../../components/modal";
import Spinner from "../../../components/spinner";
import { Lock, CheckCircle2, AlertCircle } from "lucide-react";
import AirNav from "../../../assets/airnav-logo.png";
import loginImage from "../../../assets/loginimage.png";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function VerifyCode() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(179);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRefs = useRef([]);

  // Ambil email dari halaman register
  const email = location.state?.email || "";

  useEffect(() => {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const intervalId = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return;
    const newOtp = otp.map((d, idx) => (idx === index ? element.value : d));
    setOtp(newOtp);
    setError("");
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend || resendLoading) return;

    if (!email) {
      setError("Email tidak ditemukan. Silakan daftar ulang.");
      return;
    }

    setResendLoading(true);
    setError("");

    try {
      // Kirim request untuk resend OTP
      const response = await axios.post(`${API_BASE_URL}/resend-otp`, {
        email: email,
      });

      if (response.data?.success || response.status === 200) {
        // Reset timer dan OTP
        setTimer(179);
        setOtp(new Array(6).fill(""));
        setCanResend(false);
        inputRefs.current[0]?.current.focus();

        // Tampilkan pesan sukses
        alert("Kode OTP baru telah dikirim ke email Anda.");
      } else {
        setError("Gagal mengirim ulang OTP. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Error resend OTP:", err);
      if (err.response?.status === 404) {
        setError("Email tidak ditemukan. Silakan registrasi ulang.");
      } else if (err.response?.status === 429) {
        setError("Terlalu banyak permintaan. Tunggu beberapa saat.");
      } else {
        setError("Terjadi kesalahan saat mengirim ulang OTP.");
      }
    } finally {
      setResendLoading(false);
    }
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");

    // Validasi frontend
    if (!email) {
      setError("Email tidak ditemukan. Silakan daftar ulang.");
      return;
    }

    if (finalOtp.length < 6 || otp.includes("")) {
      setError("Kode OTP wajib diisi lengkap.");
      inputRefs.current[0]?.current.focus();
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Kirim ke backend
      const response = await axios.post(`${API_BASE_URL}/verify-otp`, {
        email,
        otp: finalOtp,
      });

      // Jika sukses
      if (response.data?.success || response.status === 200) {
        setShowSuccessModal(true);
      } else {
        setError("Verifikasi gagal. Kode OTP tidak cocok.");
      }
    } catch (err) {
      console.error("Error verify OTP:", err);
      // Custom error (bukan dari backend mentah)
      if (err.response?.status === 400) {
        setError("Kode OTP salah atau sudah kadaluarsa.");
      } else if (err.response?.status === 404) {
        setError("Akun tidak ditemukan. Silakan registrasi ulang.");
      } else {
        setError("Terjadi kesalahan koneksi. Coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/login");
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
              <img src={AirNav} alt="AirNav Logo" className="w-20" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <div className="relative text-white z-10">
              <h1 className="text-3xl font-bold mb-2">
                Event Management System
              </h1>
              <p className="text-sm text-gray-200 max-w-sm">
                Satu sistem, semua event terkendali.
              </p>
            </div>
          </div>

          <div className="p-6 md:p-10 flex flex-col justify-center">
            <div className="flex flex-col items-center text-center">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Lock size={96} className="text-blue-700 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Confirm Your OTP</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    We've sent a code to <b>{email}</b>.
                    <br />
                    Please type the 6-digit code below.
                  </p>

                  <div className="flex gap-2 md:gap-3 my-4">
                    {otp.map((data, index) => (
                      <input
                        key={index}
                        ref={inputRefs.current[index]}
                        type="text"
                        maxLength="1"
                        value={data}
                        onChange={(e) => handleChange(e.target, index)}
                        onKeyDown={(e) => handleKeyDown(e, index)}
                        className="w-12 h-12 md:w-14 md:h-14 text-center text-2xl font-semibold bg-gray-100 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                      />
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-red-600 text-sm mb-3">
                      <AlertCircle size={16} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Tampilkan timer atau tombol resend */}
                  {canResend ? (
                    <div className="text-sm text-gray-500 mt-2">
                      <p className="mb-2">Didn't receive the code?</p>
                      <button
                        onClick={handleResend}
                        disabled={resendLoading}
                        className="inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-medium disabled:text-gray-400 disabled:bg-transparent transition-colors"
                      >
                        {resendLoading ? (
                          <>
                            <Spinner className="w-4 h-4" />
                            <span>Sending...</span>
                          </>
                        ) : (
                          "Resend OTP"
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="text-sm text-gray-500 mt-2">
                      <p>
                        You can resend the code in{" "}
                        <span className="font-medium text-blue-600">
                          {formatTime(timer)}
                        </span>
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleSubmit}
                    variant="primary"
                    className="mt-6 w-full rounded-lg h-11"
                    disabled={loading}
                  >
                    {loading ? "Verifying..." : "Verify Code"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        size="sm"
        showCloseButton={false}
      >
        <div className="flex flex-col items-center text-center p-4">
          <CheckCircle2 size={96} className="text-green-500 mb-6" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Yay!</h2>
          <p className="text-lg text-gray-500 mb-8">
            Your account has been successfully verified.
          </p>
          <Button
            variant="primary"
            className="w-full rounded-lg h-11"
            onClick={handleCloseModal}
          >
            Go to Login
          </Button>
        </div>
      </Modal>
    </div>
  );
}
