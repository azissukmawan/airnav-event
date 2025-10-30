import { useState, useEffect } from "react";
import Header from "./header";
import Content from "./home";
import Footer from "./footer";
import { ArrowUp } from "lucide-react";

export default function LandingPage() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const menuItems = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Events", href: "#events" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="font-sans text-gray-800" id="home">
      <Header
        menuItems={[
          { name: "Home", href: "/" },
          { name: "About", href: "/#about" },
          { name: "Events", href: "/#events" },
        ]}
      />
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
  );
}
