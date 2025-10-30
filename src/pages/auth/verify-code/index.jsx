import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../components/button";
import Modal from "../../../components/modal";
import Spinner from "../../../components/spinner";
import { Lock, CheckCircle2 } from "lucide-react"; // ▼▼▼ IKON DITAMBAHKAN ▼▼▼
import AirNav from "../../../assets/airnav-logo.png";
import loginImage from "../../../assets/loginimage.png";

export default function VerifyCode() {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(179);
  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const inputRefs = useRef([]);
  useEffect(() => {
    inputRefs.current = Array(6)
      .fill()
      .map((_, i) => inputRefs.current[i] || React.createRef());
  }, []);

  // Logika untuk Timer Countdown
  useEffect(() => {
    if (timer === 0) return;
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timer]);

  // Logika untuk auto-submit saat 6 digit terisi
  useEffect(() => {
    if (otp.every((digit) => digit !== "")) {
      handleSubmit();
    }
  }, [otp]);

  // Fungsi untuk memformat timer
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  // Handler saat mengetik OTP
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.value !== "" && index < 5) {
      inputRefs.current[index + 1].current.focus();
    }
  };

  // Handler untuk tombol backspace
  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].current.focus();
    }
  };

  // Handler untuk Resend Code
  const handleResend = () => {
    if (timer === 0) {
      setTimer(179);
      setOtp(new Array(6).fill(""));
      if (inputRefs.current[0].current) {
        inputRefs.current[0].current.focus();
      }
      alert("Kode OTP baru telah dikirim (simulasi)");
    }
  };

  // Handler untuk Submit (dipanggil otomatis)
  const handleSubmit = () => {
    setLoading(true);
    const finalOtp = otp.join("");
    console.log("Verifying OTP:", finalOtp);
    setTimeout(() => {
      setLoading(false);
      setShowSuccessModal(true);
    }, 1500);
  };

  // Handler untuk menutup modal dan navigasi
  const handleCloseModal = () => {
    setShowSuccessModal(false);
    navigate("/login");
  };

  return (
    // Wrapper Halaman Penuh
    <div className="min-h-screen flex items-center justify-center bg-[#eff2f9] p-6">
      {/* Layout Kartu Tunggal (Sama seperti Login/Register) */}
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

          {/* === SISI KANAN/BAWAH: FORMULIR OTP === */}
          <div className="p-6 md:p-10 flex flex-col justify-center">
            {/* Konten diletakkan di tengah */}
            <div className="flex flex-col items-center text-center">
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <Lock size={96} className="text-blue-700 mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Confirm Your OTP</h2>
                  <p className="text-sm text-gray-500 mb-6">
                    We've send code to your email,
                    <br />
                    please type the code here
                  </p>

                  {/* Input OTP 6 Digit */}
                  <div className="flex gap-2 md:gap-3 my-6">
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

                  {/* Timer dan Link Resend */}
                  <p className="text-sm text-gray-500">
                    You can resend the code in{" "}
                    <span className="font-medium text-blue-600">
                      {formatTime(timer)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Didn't receive the code?{" "}
                    <button
                      onClick={handleResend}
                      disabled={timer > 0}
                      className="text-blue-600 hover:underline font-medium disabled:text-gray-400 disabled:no-underline"
                    >
                      Resend it
                    </button>
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ▼▼▼ MENGGUNAKAN KOMPONEN MODAL ANDA ▼▼▼ */}
      <Modal
        isOpen={showSuccessModal}
        onClose={handleCloseModal}
        title="" // Kosongkan title agar tidak ada header
        size="sm" // Gunakan 'sm' agar lebih ramping
        showCloseButton={false} // Sembunyikan tombol 'x'
      >
        {/* Ini adalah children dari modal */}
        <div className="flex flex-col items-center text-center p-4">
          {/* ▼▼▼ GAMBAR DIGANTI IKON BERHASIL ▼▼▼ */}
          <CheckCircle2
            size={96} // Ukuran ikon (besar)
            className="text-green-500 mb-6" // Warna hijau
          />
          {/* ▲▲▲ SELESAI ▲▲▲ */}

          {/* Konten Teks */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Yay!</h2>
          <p className="text-lg text-gray-500 mb-8">
            You've successfully signed up.
          </p>

          {/* Tombol Aksi */}
          <Button
            variant="primary"
            className="w-full rounded-lg h-11 flex items-center justify-center"
            onClick={handleCloseModal}
          >
            Go to Login
          </Button>
        </div>
      </Modal>
      {/* ▲▲▲ SELESAI ▲▲▲ */}
    </div>
  );
}
