import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./layout";
import { EventProvider } from "./contexts/EventContext";

// Auth pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import VerifyCode from "./pages/auth/verify-code";
import ForgotPassword from "./pages/auth/forgot-password";

// Guest pages
import LandingPage from "./pages/LandingPage";
import AdminDetail from "./pages/admin/AdminDetail";
import InfoAcara from "./pages/admin/InfoAcara";
import EventDetail from "./pages/LandingPage/event";

// Admin pages
import Dashboard from "./pages/admin/dashboard";
import AdminEvent from "./pages/admin/event";
import Style from "./pages/style";
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

        {/* test sertifikat */}
        <Route path="/user/certificate" element={<CertificatePreview />} />

        <Route path="/style" element={<Style />} />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-code" element={<VerifyCode />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Admin routes */}
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/detail" element={<AdminDetail />} />
        <Route path="/admin/events" element={<AdminEvent />} />
        <Route path="/admin/doorprize" element={<Doorprize />} />
        <Route path="/InfoAcara" element={<InfoAcara />} />
        <Route path="/doorprize" element={<Doorprize />} />

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
              </Routes>
            </EventProvider>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
