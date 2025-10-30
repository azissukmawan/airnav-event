import { useState } from "react";
import { InputText } from "../../../components/form/InputText";
import { Button } from "../../../components/button";
import { Typography } from "../../../components/typography";
import Modal from "../../../components/modal";

const Profile = () => {
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileImage, setProfileImage] = useState("https://ui-avatars.com/api/?name=User+Name&size=200&background=3b82f6&color=fff&bold=true");

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openImageInNewTab = () => {
    window.open(profileImage, '_blank');
  };

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
                                src={profileImage}
                                alt="Profile" 
                                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200 shadow-lg"
                            />
                        </div>
                    </div>
                </div>            
                <div className="space-y-4">
                    <form action="" className="space-y-4">
                        <InputText
                            id="nama"
                            name="Nama Lengkap"
                            type="text"
                            placeholder="Masukkan nama lengkap"
                        />
                        <InputText
                            id="telp"
                            name="No. Whatsapp"
                            type="tel"
                            placeholder="Masukkan nomor telepon"
                        />
                        <InputText
                            id="email"
                            name="Email"
                            type="email"
                            placeholder="Masukkan email"
                        />
                    </form>
                    <div className="flex space-x-2">
                        <Button 
                            variant="primary" 
                            onClick={() => setIsProfileModalOpen(true)}
                        >
                            Edit Profil
                        </Button>
                        <Button 
                            variant="red" 
                            onClick={() => setIsPasswordModalOpen(true)}
                        >
                            Ubah Password
                        </Button>
                    </div>
                </div>
            </div>
        </div>

        <Modal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          title="Edit Profile"
          size="md"
          footer={
            <>
              <Button variant="red" onClick={() => setIsProfileModalOpen(false)}>Batal</Button>
              <Button variant="primary">Simpan</Button>
            </>
          }
        >
          <div className="space-y-4">
            <form action="" className="space-y-4">
                <div className="flex justify-center mt-6">
                    <div className="relative">
                        <img 
                            src={profileImage}
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
                <InputText
                    id="edit-nama"
                    name="Nama Lengkap"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                />
                <InputText
                    id="edit-telp"
                    name="No. Whatsapp"
                    type="tel"
                    placeholder="Masukkan nomor telepon"
                />
                {/* email gabisa diedit */}
                <InputText
                    id="edit-email"
                    name="Email"
                    type="email"
                    placeholder="Masukkan email"
                />
            </form>
          </div>
        </Modal>

        <Modal
          isOpen={isPasswordModalOpen}
          onClose={() => setIsPasswordModalOpen(false)}
          title="Edit Password"
          size="md"
          footer={
            <>
              <Button variant="red" onClick={() => setIsPasswordModalOpen(false)}>Batal</Button>
              <Button variant="primary">Simpan</Button>
            </>
          }
        >
          <div className="space-y-4">
            <form action="" className="space-y-4">
                <InputText
                    id="password"
                    name="Password Baru"
                    type="password"
                    placeholder="Masukkan password baru"
                />
                <InputText
                    id="password-confirm"
                    name="Ketik Ulang Password Baru"
                    type="password"
                    placeholder="Masukkan konfirmasi password baru"
                />
            </form>
          </div>
        </Modal>
    </div>
  );
};

export default Profile;