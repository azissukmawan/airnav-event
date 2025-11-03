import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Jika role admin/superadmin boleh akses halaman role="admin"
  if (
    role === "admin" &&
    !(userRole === "admin" || userRole === "superadmin")
  ) {
    return <Navigate to="/" replace />;
  }

  // Jika role user tapi bukan user → lempar ke beranda
  if (role === "user" && userRole !== "user") {
    return <Navigate to="/" replace />;
  }

  return children;
}
