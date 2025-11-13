import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout";
import { EventProvider } from "./contexts/EventContext";
import ProtectedRoute from "./components/protected-route";
import NotFound from "./pages/NotFound";

// Auth pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import VerifyCode from "./pages/auth/verify-code";
import ForgotPassword from "./pages/auth/forgot-password";
import ResetPassword from "./pages/auth/reset-password";

// Guest pages
import LandingPage from "./pages/landing-page";
import AdminDetail from "./pages/admin/event-detail";
import InfoAcara from "./pages/admin/event-edit";
import EventDetail from "./pages/landing-page/event";

// Admin pages
import Dashboard from "./pages/admin/dashboard";
import AdminEvent from "./pages/admin/event";
import AdminUser from "./pages/admin/users";
import DetailEventId from "./pages/admin/event-detail-id";
import AllParticipants from "./pages/admin/event-detail/allParticipants";
import Doorprize from "./pages/admin/event-doorprize";

// User pages
import Event from "./pages/user/event";
import DetailEvent from "./pages/user/event/detail";
import Activity from "./pages/user/activity";
import Profile from "./pages/user/profile";
import CertificatePreview from "./pages/user/certificate";
import PresensiAutoSubmit from "./pages/user/activity/scan/autoSubmit";

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
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Admin routes (dilindungi login) */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/event/:id"
          element={
            <ProtectedRoute role="admin">
              <AdminDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/event/detail/:id"
          element={
            <ProtectedRoute role="admin">
              <DetailEventId />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/event/edit/:id"
          element={
            <ProtectedRoute role="admin">
              <InfoAcara />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <ProtectedRoute role="admin">
              <AdminEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUser />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/event/doorprize/:id"
          element={
            <ProtectedRoute role="admin">
              <Doorprize />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/event/:id/allparticipants"
          element={
            <ProtectedRoute role="admin">
              <AllParticipants />
            </ProtectedRoute>
          }
        />

        {/* User routes */}
        <Route
          path="/user/*"
          element={
            <EventProvider>
              <Routes>
                <Route
                  path=""
                  element={
                    <Layout role="user">
                      <Event />
                    </Layout>
                  }
                />
                <Route
                  path="event/:id"
                  element={
                    <Layout role="user">
                      <DetailEvent />
                    </Layout>
                  }
                />
                <Route
                  path="activities"
                  element={
                    <Layout role="user">
                      <Activity />
                    </Layout>
                  }
                />
                <Route
                  path="profile"
                  element={
                    <Layout role="user">
                      <Profile />
                    </Layout>
                  }
                />
                <Route path="/certificate" element={<CertificatePreview />} />
              </Routes>
            </EventProvider>
          }
        />
        <Route path="/presensi/:kode" element={<PresensiAutoSubmit />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
