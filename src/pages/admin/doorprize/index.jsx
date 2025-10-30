import { useState, useEffect, useRef } from "react";
import { Typography } from "../../../components/typography";
import { Button } from "../../../components/button";

export default function Doorprize() {
  const names = [
    "nunik",
    "melanie",
    "azzah",
    "kinop",
    "fatih",
    "najib",
    "nana",
    "nini",
  ];

  const [scroll, setScroll] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState("");
  const [speed, setSpeed] = useState(10);
  const [itemHeight, setItemHeight] = useState(0);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const ref = useRef(null);

  const visible = 7;
  const repeated = [...names, ...names, ...names, ...names]; // Lebih banyak repeat
  const midIndex = Math.floor(visible / 2);

  useEffect(() => {
    const resize = () => setItemHeight((window.innerHeight * 0.4) / visible);
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  const toggleRoll = () => {
    if (isRolling) {
      let s = speed;
      const slow = setInterval(() => {
        s += 5;
        setSpeed(s);
        if (s > 120) {
          clearInterval(slow);
          cancelAnimationFrame(ref.current);
          setIsRolling(false);
          setSpeed(10);

          // Ambil nama yang ada di tengah berdasarkan posisi scroll
          const centerPosition = scroll;
          const itemIndex = Math.round(centerPosition / itemHeight);
          const winnerName = repeated[itemIndex % repeated.length];

          setWinner(winnerName);
          setIsConfirmed(false);
        }
      }, 100);
    } else {
      setWinner("");
      setIsConfirmed(false);
      setScroll(0);
      setSpeed(10);
      setIsRolling(true);
    }
  };

  const confirmWinner = () => {
    setIsConfirmed(true);
  };

  useEffect(() => {
    let last = Date.now();
    const move = () => {
      if (isRolling) {
        const now = Date.now();
        const maxScroll = itemHeight * repeated.length;
        setScroll((p) => {
          const newScroll = p + ((now - last) / speed) * 10;
          return newScroll % maxScroll;
        });
        last = now;
        ref.current = requestAnimationFrame(move);
      }
    };
    if (isRolling) ref.current = requestAnimationFrame(move);
    return () => cancelAnimationFrame(ref.current);
  }, [isRolling, speed, itemHeight]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* 🎯 Konten Utama */}
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Left Side - Header Info */}
            <div className="bg-gradient-to-br from-[#478FC8] to-[#175FA4] p-8 flex flex-col justify-center text-white">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <span className="text-5xl">🎁</span>
                </div>
                <div className="flex-1">
                  <Typography type="heading3" weight="bold" className="mb-1">
                    Company Annual
                  </Typography>
                  <Typography type="heading3" weight="bold">
                    Gathering 2025
                  </Typography>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 mb-6">
                <Typography type="caption1" weight="medium" className="mb-1">
                  DOORPRIZE DRAW
                </Typography>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <Typography type="body" weight="semibold">
                    {names.length} Peserta Terdaftar
                  </Typography>
                </div>
              </div>

              {/* 🏆 Pemenang Section */}
              {winner && !isRolling && (
                <div className="animate-in fade-in duration-500">
                  <div className="bg-gradient-to-br from-white to-[#EDFAFF] rounded-2xl p-6 shadow-xl border-2 border-[#A1D9F5]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#FDE047] to-[#EAB308] rounded-xl flex items-center justify-center">
                        <span className="text-2xl">🏆</span>
                      </div>
                      <div className="flex-1">
                        <Typography
                          type="caption1"
                          weight="medium"
                          className="text-[#64646D] mb-1"
                        >
                          Pemenang Doorprize
                        </Typography>
                        <Typography
                          type="heading3"
                          weight="bold"
                          className="text-[#175FA4] capitalize"
                        >
                          {winner}
                        </Typography>
                      </div>
                    </div>

                    {!isConfirmed ? (
                      <Button
                        onClick={confirmWinner}
                        className="w-full bg-gradient-to-r from-[#10B981] to-[#059669] hover:from-[#059669] hover:to-[#047857] text-white font-bold py-3 rounded-xl shadow-lg transition-all duration-300"
                      >
                        ✓ Konfirmasi Pemenang
                      </Button>
                    ) : (
                      <div className="bg-gradient-to-r from-[#D1FAE5] to-[#A7F3D0] rounded-xl p-3 text-center border-2 border-[#10B981]">
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-[#047857] text-xl">✓</span>
                          <Typography
                            type="body"
                            weight="bold"
                            className="text-[#047857]"
                          >
                            Pemenang Telah Dikonfirmasi
                          </Typography>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Shuffle Area */}
            <div className="p-8 flex flex-col justify-center">
              {/* 🌀 Area Scroll Nama dengan Panah */}
              <div className="relative mb-6">
                {/* Panah Kiri - Mengarah ke Dalam */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 z-30">
                  <div className="flex items-center">
                    <div className="w-2 h-16 bg-[#175FA4] rounded-l-lg"></div>
                    <div className="w-0 h-0 border-t-[20px] border-t-transparent border-b-[20px] border-b-transparent border-l-[25px] border-l-[#175FA4]"></div>
                  </div>
                </div>

                {/* Card Scroll */}
                <div className="bg-gradient-to-br from-[#F3F4F6] to-[#CFEEFA] rounded-2xl shadow-inner overflow-hidden relative border-2 border-[#A1D9F5]">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#CFEEFA] to-transparent z-20 pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#CFEEFA] to-transparent z-20 pointer-events-none"></div>

                  <div
                    style={{
                      height: `${itemHeight * visible}px`,
                      position: "relative",
                    }}
                  >
                    <div
                      className="absolute left-0 right-0"
                      style={{
                        transform: `translateY(${
                          itemHeight * midIndex -
                          (scroll % (itemHeight * repeated.length))
                        }px)`,
                      }}
                    >
                      {repeated.map((n, i) => {
                        const bgColor =
                          i % 2 === 0 ? "bg-white" : "bg-[#EDFAFF]";
                        return (
                          <div
                            key={i}
                            className={`flex items-center justify-center text-3xl font-bold text-[#0F172A] ${bgColor} transition-colors capitalize`}
                            style={{ height: `${itemHeight}px` }}
                          >
                            {n}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 🔘 Tombol Start / Stop */}
              <Button
                onClick={toggleRoll}
                disabled={isConfirmed}
                className={`w-full py-5 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 ${
                  isConfirmed
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : isRolling
                    ? "bg-gradient-to-r from-[#F87171] to-[#EF4444] hover:from-[#EF4444] hover:to-[#DC2626] text-white"
                    : "bg-gradient-to-r from-[#478FC8] to-[#175FA4] hover:from-[#175FA4] hover:to-[#10498D] text-white"
                } ${
                  !isConfirmed &&
                  "hover:shadow-xl hover:scale-[1.02] active:scale-95"
                }`}
              >
                {isRolling ? (
                  <span className="flex items-center justify-center gap-3">
                    <span>⏸</span> STOP SEKARANG
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-3">
                    <span>▶</span> MULAI UNDIAN
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
