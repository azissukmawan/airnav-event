import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token"); // atau sesuaikan dengan cara kamu menyimpan auth
  const userRole = localStorage.getItem("role"); // jika ada role admin/user

  if (!token) {
    // kalau belum login
    return <Navigate to="/login" replace />;
  }

  // jika role dibutuhkan, bisa ditambahkan pengecekan:
  if (role && userRole !== role) {
    return <Navigate to="/" replace />;
  }

  // kalau sudah login dan role sesuai
  return children;
}
