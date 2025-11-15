import { useState, useRef, useEffect } from "react";

const Tabs = ({ items }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [scrollDirection, setScrollDirection] = useState("down");
  const lastScrollY = useRef(0);
  const sectionRefs = useRef([]);

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

  const handleScrollTo = (index) => {
    sectionRefs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  if (!items || items.length === 0) return null;

  const stickyTopClass =
    scrollDirection === "up"
      ? "top-[96px]"
      : "top-0";

  return (
    <div className="w-full">
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