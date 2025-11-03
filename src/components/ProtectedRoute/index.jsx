import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Kalau admin login dan bukan di halaman admin → ke /admin
  if (userRole === "superadmin" && role !== "superadmin") {
    return <Navigate to="/admin" replace />;
  }

  // Kalau user login dan bukan di halaman user → ke /user
  if (userRole === "user" && role !== "user") {
    return <Navigate to="/user" replace />;
  }

  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
