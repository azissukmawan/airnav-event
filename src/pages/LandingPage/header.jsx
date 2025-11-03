import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "../../components/button";
import { Menu as MenuIcon, X, User } from "lucide-react";

export default function Header({ menuItems = [] }) {
  // default ke array kosong
  const [menuOpen, setMenuOpen] = useState(false);
  const [show, setShow] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  // cek loginn
  const token = localStorage.getItem("token");
  const [loggedIn, setLoggedIn] = useState(!!token);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      setShow(window.scrollY < lastScrollY || window.scrollY <= 100);
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const targetId = href.replace("/#", "#");
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: targetId } });
      return;
    }
    const target = document.querySelector(targetId);
    if (target) {
      const yOffset = -80;
      const y = target.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    navigate("/");
  };

  return (
    <header
      className={`fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white shadow-sm z-50 transition-transform duration-300 ${
        show ? "translate-y-0" : "-translate-y-full"
      } font-poppins`}
    >
      <div className="flex items-center gap-3">
        <Link to="/">
          <img src="/airnav-logo.png" alt="AirNav Logo" className="h-16" />
        </Link>
      </div>

      {/* Menu desktop */}
      <nav className="hidden md:flex items-center gap-6 text-gray-600">
        {Array.isArray(menuItems) &&
          menuItems.map((item) => {
            const isAnchor = item.href?.includes("#");
            return isAnchor ? (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => handleScrollTo(e, item.href)}
                className="hover:text-blue-600 transition-colors"
              >
                {item.name}
              </a>
            ) : (
              <Link
                key={item.name}
                to={item.href || "/"}
                className="hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            );
          })}
      </nav>

      {/* Tombol desktop */}
      <div className="hidden md:flex items-center gap-3">
        {loggedIn ? (
          role === "admin" || role === "superadmin" ? (
            <Button variant="primary" to="/admin">
              Dashboard
            </Button>
          ) : (
            <Button variant="primary" to="/user/profile">
              Profile
            </Button>
          )
        ) : (
          <>
            <Button variant="primary" to="/login">
              Login
            </Button>
            <Button variant="secondary" to="/register">
              Daftar Akun
            </Button>
          </>
        )}
      </div>

      {/* Tombol mobile menu */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {menuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MenuIcon className="w-6 h-6" />
        )}
      </button>

      {/* Menu mobile */}
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-lg md:hidden z-50 border-t">
          <nav className="flex flex-col items-center gap-4 py-6">
            {Array.isArray(menuItems) &&
              menuItems.map((item) => {
                const isAnchor = item.href?.includes("#");
                return isAnchor ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => handleScrollTo(e, item.href)}
                    className="hover:text-blue-600 transition-colors py-2"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    to={item.href || "/"}
                    onClick={() => setMenuOpen(false)}
                    className="hover:text-blue-600 transition-colors py-2"
                  >
                    {item.name}
                  </Link>
                );
              })}
            <div className="flex flex-col gap-3 mt-4 w-full px-8">
              {loggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="block w-full text-center bg-gray-100 py-2 rounded-lg"
                    onClick={() => setMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full bg-gray-100 py-2 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Button variant="primary" onClick={() => setMenuOpen(false)}>
                    Login
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => setMenuOpen(false)}
                  >
                    Daftar Akun
                  </Button>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
