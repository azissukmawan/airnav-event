import { useState, useEffect } from "react";
import LandingLayout from "./layout";
import Header from "./header";
import Content from "./home";
import Footer from "./footer";
import { ArrowUp } from "lucide-react";
import { useLocation } from "react-router-dom"; 

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Beranda", href: "#beranda" },
    { name: "Tentang", href: "#tentang" },
    { name: "Acara", href: "#acara" },
  ];

  useEffect(() => {
    if (location.state?.scrollTo) {
      const target = document.querySelector(location.state.scrollTo);
      if (target) {
        const yOffset = -80;
        const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
        setTimeout(() => {
          window.scrollTo({ top: y, behavior: "smooth" });
        }, 300);
      }
    }
  }, [location]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <LandingLayout>
      <div className="font-sans text-gray-800" id="beranda">
        <Header menuItems={menuItems} />
        <Content />
        <Footer />

        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-primary text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors z-50"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>
    </LandingLayout>
  );
}
