import React, { useState, useRef, useEffect } from "react";

const Tabs = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);
  const sectionRefs = useRef([]);

  // === Scrollspy: deteksi konten yang terlihat ===
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveTab(Number(entry.target.dataset.index));
          }
        });
      },
      { threshold: 0.5 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // === Deteksi arah scroll (up / down) ===
  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      if (currentY > lastScrollY.current) {
        setScrollDirection("down");
      } else if (currentY < lastScrollY.current) {
        setScrollDirection("up");
      }
      lastScrollY.current = currentY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // === Klik tab → scroll ke bagian ===
  const handleScrollTo = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!items || items.length === 0) return null;

  // === Atur posisi top sticky dinamis ===
  const stickyTopClass =
    scrollDirection === "up"
      ? "top-[96px]" // saat scroll ke atas, beri jarak dari atas
      : "top-0"; // saat scroll ke bawah, nempel ke atas

  return (
    <div className="w-full">
      {/* === Sticky Tab Bar === */}
      <div
        className={`sticky ${stickyTopClass} z-40 bg-white border-b border-gray-200 transition-all duration-300 flex overflow-x-auto no-scrollbar`}
      >
        {items.map((item, index) => (
          <button
            key={index}
            className={`py-3 px-5 font-medium whitespace-nowrap transition-colors ${
              index === activeTab
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleScrollTo(index)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* === Semua Konten === */}
      <div className="space-y-16 mt-8">
        {items.map((item, index) => (
          <div
            key={index}
            data-index={index}
            ref={(el) => (sectionRefs.current[index] = el)}
            className="scroll-mt-28"
          >
            {item.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs;
