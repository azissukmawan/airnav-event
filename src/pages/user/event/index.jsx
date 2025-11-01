import { useState, useEffect } from "react";
import Card from "../../../components/card";
// import { Bell } from "lucide-react";
import { useEvents } from "../../../contexts/EventContext";
import axios from "axios";

const Event = () => {
  const { events, loading } = useEvents();
  const [registeredEvents, setRegisteredEvents] = useState([]);
  const [loadingRegistered, setLoadingRegistered] = useState(true);
  const [userName, setUserName] = useState("User");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) return;

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const data = response.data.data;
        setUserName(data.name || "User");

        if (data.profile_photo) {
          setProfileImage(data.profile_photo);
        } else {
          const avatarName = encodeURIComponent(data.name || "User");
          setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);

        const user = localStorage.getItem("user");
        if (user) {
          try {
            const parsedUser = JSON.parse(user);
            setUserName(parsedUser.name || "User");
            const avatarName = encodeURIComponent(parsedUser.name || "User");
            setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
          } catch (e) {
            console.error("Error parsing user data:", e);
          }
        }
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchRegisteredEvents = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/me/pendaftaran`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const result = await response.json();
        
        if (result.success) {
          setRegisteredEvents(result.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching registered events:", error);
      } finally {
        setLoadingRegistered(false);
      }
    };

    fetchRegisteredEvents();
  }, []);

  const registeredEventsCount = registeredEvents.length;
  const totalEventsCount = events.length;

  if (loading || loadingRegistered) return <p>Loading...</p>;

  return (
    <div>
      <div className="flex justify-between mb-6">
        <div>
          <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
            Selamat Datang, {userName}!
          </h1>
          <h1 className="text-sm md:text-md text-typo-secondary mb-1">
            Kamu terdaftar di {registeredEventsCount} dari {totalEventsCount} event yang tersedia
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {/* <button
            className="p-3 rounded-full bg-primary-10 text-primary"
            onClick={() => {}}
          >
            <Bell />
          </button> */}
          {profileImage && (
            <img 
              src={profileImage}
              alt="Profile" 
              className="hidden lg:block w-14 h-14 rounded-full object-cover border-2 border-gray-200 shadow-sm"
            />
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {events.map((event) => (
          <Card
            key={event.id}
            id={event.id}
            title={event.mdl_nama}
            date={event.mdl_acara_mulai}
            location={event.mdl_lokasi}
            image={event.media_urls.banner}
            mdl_pendaftaran_mulai={event.mdl_pendaftaran_mulai}
            mdl_pendaftaran_selesai={event.mdl_pendaftaran_selesai}
            mdl_acara_mulai={event.mdl_acara_mulai}
            mdl_acara_selesai={event.mdl_acara_selesai}
            tipe={event.mdl_tipe}
            registeredEvents={registeredEvents}
          />
        ))}
      </div>
    </div>
  );
};

export default Event;