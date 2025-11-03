import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout";
import { EventProvider } from "./contexts/EventContext";

// Auth pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import VerifyCode from "./pages/auth/verify-code";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";

// Guest pages
import LandingPage from "./pages/LandingPage";
import AdminDetail from "./pages/admin/AdminDetail";
import InfoAcara from "./pages/admin/InfoAcara";
import EventDetail from "./pages/LandingPage/event";

// Admin pages
import Dashboard from "./pages/admin/dashboard";
import AdminEvent from "./pages/admin/event";
import Doorprize from "./pages/admin/doorprize";

// User pages
import Event from "./pages/user/event";
import DetailEvent from "./pages/user/event/detail";
import Activity from "./pages/user/activity";
import Profile from "./pages/user/profile";
import CertificatePreview from "./pages/user/certificate";

function App() {
  return (
    <Router>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/event/:slug" element={<EventDetail />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* ▼▼▼ TAMBAHKAN RUTE INI ▼▼▼ */}
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* ▲▲▲ SELESAI ▲▲▲ */}

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/event/:id" element={<AdminDetail />} />
        <Route path="/admin/event/edit/:id" element={<InfoAcara />} />
        <Route path="/admin/events" element={<AdminEvent />} />
        <Route path="/admin/event/doorprize/:id" element={<Doorprize />} />
        <Route path="/InfoAcara" element={<InfoAcara />} />

        {/* User routes */}
        <Route
          path="/user/*"
          element={
            <EventProvider>
              <Routes>
                <Route path="" element={<Layout role="user"><Event /></Layout>} />
                <Route path="event/:id" element={<Layout role="user"><DetailEvent /></Layout>} />
                <Route path="activities" element={<Layout role="user"><Activity /></Layout>} />
                <Route path="profile" element={<Layout role="user"><Profile /></Layout>} />
                <Route path="/certificate" element={<CertificatePreview />} />
              </Routes>
            </EventProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
