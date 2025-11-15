import { useEffect, useState } from "react";
import { InputText } from "../../../components/form/InputText";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import Modal from "../../../components/modal";
import axios from "axios";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  const [profileImage, setProfileImage] = useState("");

  const [editFormData, setEditFormData] = useState({
    name: "",
    telp: "",
    email: "",
    profile_photo: null
  });

  const [passwordFormData, setPasswordFormData] = useState({
    current_password: "",
    new_password: "",
    new_password_confirmation: ""
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrors({ ...errors, profile_photo: "Ukuran file maksimal 2MB" });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors({ ...errors, profile_photo: "File harus berupa gambar" });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        setEditFormData({ ...editFormData, profile_photo: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageInNewTab = () => {
    window.open(profileImage, '_blank');
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        
        if (!token) {
          window.location.href = "/login";
          return;
        }

        const response = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });
        
        const data = response.data.data;
        setProfile(data);

        setEditFormData({
          name: data.name || "",
          telp: data.telp || "",
          email: data.email || "",
          profile_photo: null
        });

        if (data.profile_photo) {
          setProfileImage(data.profile_photo);
        } else {
          const avatarName = encodeURIComponent(data.name || "User");
          setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
        }
      } catch (error) {            
        if (error.response?.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    try {
      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append('name', editFormData.name);
      formData.append('telp', editFormData.telp);
      
      if (editFormData.profile_photo) {
        formData.append('profile_photo', editFormData.profile_photo);
      }

      const response = await axios.post(`${API_BASE_URL}/profile/update`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json'
        }
      });

      if (response.data.success) {
        setSuccessMessage("Profile berhasil diperbarui!");
        setProfile(response.data.data);

        if (response.data.data.profile_photo) {
          setProfileImage(response.data.data.profile_photo);
        } else {
          const avatarName = encodeURIComponent(response.data.data.name || "User");
          setProfileImage(`https://ui-avatars.com/api/?name=${avatarName}&size=200&background=3b82f6&color=fff&bold=true`);
        }

        const user = JSON.parse(localStorage.getItem("user") || "{}");
        user.name = response.data.data.name;
        user.telp = response.data.data.telp;
        localStorage.setItem("user", JSON.stringify(user));

        setTimeout(() => {
          setIsProfileModalOpen(false);
          setSuccessMessage("");
        }, 1500);
      }
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: error.response?.data?.message || "Terjadi kesalahan saat memperbarui profile" });
      }
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    if (!passwordFormData.current_password) {
      setErrors({ current_password: "Password lama harus diisi" });
      return;
    }

    if (passwordFormData.new_password.length < 8) {
      setErrors({ new_password: "Password baru minimal 8 karakter" });
      return;
    }

    if (passwordFormData.new_password !== passwordFormData.new_password_confirmation) {
      setErrors({ new_password_confirmation: "Konfirmasi password tidak sesuai" });
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API_BASE_URL}/profile/change-password`,
        {
          current_password: passwordFormData.current_password,
          new_password: passwordFormData.new_password,
          new_password_confirmation: passwordFormData.new_password_confirmation
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        }
      );

      if (response.data.success) {
        setSuccessMessage("Password berhasil diubah!");
        setPasswordFormData({ 
          current_password: "",
          new_password: "", 
          new_password_confirmation: "" 
        });
        
        setTimeout(() => {
          setIsPasswordModalOpen(false);
          setSuccessMessage("");
        }, 1500);
      }
    } catch (error) {
      console.error("Error response:", error.response?.data);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: "Terjadi kesalahan saat mengubah password" });
      }
    }
  };

  const handleEditFormChange = (e) => {
    setEditFormData({
      ...editFormData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordFormChange = (e) => {
    setPasswordFormData({
      ...passwordFormData,
      [e.target.name]: e.target.value
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.2s]"></div>
            <div className="w-3 h-3 bg-primary rounded-full animate-bounce [animation-delay:-0.4s]"></div>
          </div>
        </div>
      </div>
    );
  }

  const userData = localStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  const isKaryawan =
    user?.status_karyawan === 1 ||
    user?.status_karyawan === "1" ||
    user?.status_karyawan === true;

  const status = isKaryawan ? "Karyawan" : "Non Karyawan";

  return (
    <div>
      <h1 className="text-lg md:text-2xl text-primary font-bold mb-1">
        My Profile
      </h1>
      <h1 className="text-sm md:text-md text-typo-secondary mb-1">
        Menampilkan informasi data diri
      </h1>
      <div className="bg-white p-8 rounded-xl mt-4">
        <div className="grid md:grid-cols-2 gap-8 w-full">
          <div>
            <h1 className="text-lg md:text-2xl text-typo mb-1 font-bold">
              Informasi Profil
            </h1>
            <div className="flex justify-center mt-6">
              <div 
                className="relative cursor-pointer hover:opacity-90 transition-opacity"
                onClick={openImageInNewTab}
                title="Klik untuk melihat foto lebih besar"
              >
                <img 
                  src={profileImage || "https://ui-avatars.com/api/?name=User&size=200&background=3b82f6&color=fff&bold=true"}
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <div className="px-4 py-3 bg-primary-10 rounded-lg mt-6 text-center">
                  <Typography type="body" weight="semibold" className="text-primary">{status}</Typography>
                </div>
              </div>
            </div>
          </div>            
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="space-y-2">
                <Typography type="caption1" className="text-typo-secondary">Username</Typography>
                <div className="px-4 py-3 bg-typo-white2 rounded-lg">
                  <Typography type="body" weight="semibold" className="text-typo">{profile?.username || "-"}</Typography>
                </div>
              </div>
              <div className="space-y-2">
                <Typography type="caption1" className="text-typo-secondary">Nama Lengkap</Typography>
                <div className="px-4 py-3 bg-typo-white2 rounded-lg">
                  <Typography type="body" weight="semibold" className="text-typo">{profile?.name || "-"}</Typography>
                </div>
              </div>
              <div className="space-y-2">
                <Typography type="caption1" className="text-typo-secondary">No. Whatsapp</Typography>
                <div className="px-4 py-3 bg-typo-white2 rounded-lg">
                  <Typography type="body" weight="semibold" className="text-typo">{profile?.telp || "-"}</Typography>
                </div>
              </div>
              <div className="space-y-2">
                <Typography type="caption1" className="text-typo-secondary">Email</Typography>
                <div className="px-4 py-3 bg-typo-white2 rounded-lg">
                  <Typography type="body" weight="semibold" className="text-typo">{profile?.email || "-"}</Typography>
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button 
                variant="primary" 
                onClick={() => setIsProfileModalOpen(true)}
              >
                Edit Profil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsPasswordModalOpen(true)}
              >
                Ubah Kata Sandi
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setErrors({});
          setSuccessMessage("");
        }}
        title="Edit Profile"
        size="md"
        footer={
          <>
            <Button 
              variant="gray_outline" 
              onClick={() => {
                setIsProfileModalOpen(false);
                setErrors({});
                setSuccessMessage("");
              }}
            >
              Batal
            </Button>
            <Button 
              variant="primary" 
              onClick={handleEditProfileSubmit}
            >
              Simpan Perubahan Data
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-success-10 border border-success rounded-lg">
              <p className="text-sm text-success">{successMessage}</p>
            </div>
          )}
          
          {errors.general && (
            <div className="p-3 bg-error-10 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleEditProfileSubmit} className="space-y-4">
            <div className="flex justify-center mt-6">
              <div className="relative">
                <img 
                  src={profileImage || "https://ui-avatars.com/api/?name=User&size=200&background=3b82f6&color=fff&bold=true"}
                  alt="Profile" 
                  className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                />
                <input
                  type="file"
                  id="upload-photo"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <label
                  htmlFor="upload-photo"
                  className="absolute bottom-2 right-2 bg-primary hover:bg-primary-70 text-white p-2 rounded-full shadow-lg transition-colors cursor-pointer"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </label>
              </div>
            </div>
            {errors.profile_photo && (
              <p className="text-sm text-error text-center">{errors.profile_photo}</p>
            )}

            <div>
              <InputText
                id="edit-nama"
                name="name"
                label="Nama Lengkap"
                type="text"
                placeholder="Masukkan nama lengkap"
                value={editFormData.name}
                onChange={handleEditFormChange}
              />
              {errors.name && (
                <p className="text-sm text-error mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <InputText
                id="edit-telp"
                name="telp"
                label="No. Whatsapp"
                type="tel"
                placeholder="Masukkan nomor telepon"
                value={editFormData.telp}
                onChange={handleEditFormChange}
              />
              {errors.telp && (
                <p className="text-sm text-error mt-1">{errors.telp}</p>
              )}
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={() => {
          setIsPasswordModalOpen(false);
          setErrors({});
          setSuccessMessage("");
          setPasswordFormData({ current_password: "", new_password: "", new_password_confirmation: "" });
        }}
        title="Edit Password"
        size="md"
        footer={
          <>
            <Button 
              variant="gray_outline" 
              onClick={() => {
                setIsPasswordModalOpen(false);
                setErrors({});
                setSuccessMessage("");
                setPasswordFormData({ current_password: "", new_password: "", new_password_confirmation: "" });
              }}
            >
              Batal
            </Button>
            <Button 
              variant="primary" 
              onClick={handlePasswordSubmit}
            >
              Simpan Kata Sandi Baru
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {successMessage && (
            <div className="p-3 bg-success-10 border border-success rounded-lg">
              <p className="text-sm text-success">{successMessage}</p>
            </div>
          )}
          
          {errors.general && (
            <div className="p-3 bg-error-10 border border-error rounded-lg">
              <p className="text-sm text-error">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <InputText
                id="current-password"
                name="current_password"
                label="Password Lama"
                type="password"
                placeholder="Masukkan password lama"
                value={passwordFormData.current_password}
                onChange={handlePasswordFormChange}
                error={errors.current_password}
              />
            </div>
            <div>  
              <InputText
                id="new-password"
                name="new_password"
                label="Password Baru"
                type="password"
                placeholder="Masukkan password baru (min. 8 karakter)"
                value={passwordFormData.new_password}
                onChange={handlePasswordFormChange}
                error={errors.new_password}
              />
            </div>
            <div>
              <InputText
                id="new-password-confirm"
                name="new_password_confirmation"
                label="Ketik Ulang Password Baru"
                type="password"
                placeholder="Masukkan konfirmasi password baru"
                value={passwordFormData.new_password_confirmation}
                onChange={handlePasswordFormChange}
                error={errors.new_password_confirmation}
              />
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;