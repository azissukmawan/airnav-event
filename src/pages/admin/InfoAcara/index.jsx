import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import { Button } from "../../../components/button";
import AirnavLogo from "../../../assets/airnav2.png";
import Breadcrumb from "../../../components/breadcrumb";
import EditEvent from "../../../components/Popup/EditEvent";
import {
  Pencil,
  MapPin,
  CalendarPlus,
  Clock,
  Wallpaper,
  FileSearch,
  FileStack,
  FileUser,
} from "lucide-react";
import { RadioGroup } from "../../../components/form/Radiogroup";

const InfoAcara = () => {
  const statusField = [
    { label: "Tanggal Mulai Pendaftaran", type: "date" },
    { label: "Tanggal Penutupan Acara", type: "date" },
    {
      label: "Tipe Acara",
      icon: (
        <Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Wallpaper>
      ),
      type: "text",
    },
    {
      label: "Jenis Acara",
      icon: (
        <Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Wallpaper>
      ),
      type: "text",
    },
    {
      label: "Modul Penutupan Acara",
      icon: (
        <FileStack className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileStack>
      ),
      type: "file",
    },
    {
      label: "Susunan Penutupan Acara",
      icon: (
        <FileSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileSearch>
      ),
      type: "file",
    },
    {
      label: "Template Sertifikat Penut  upan Acara",
      icon: (
        <FileUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileUser>
      ),
      type: "file",
    },
  ];
  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara", link: "/admin/detail" },
    { label: "Detail Acara" },
  ];
  const [selectedOption, setSelectedOption] = useState("nonaktif");

  const radioOptions = [
    { label: "Non Aktif", value: "nonaktif" },
    { label: "Aktif", value: "aktif" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault(); // Mencegah reload halaman
    const formData = new FormData(e.target);
    console.log("Form data terkirim:", Object.fromEntries(formData.entries()));
    alert("Data acara berhasil disimpan!");
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Handler tombol Simpan
  const handleSaveClick = () => {
    setShowConfirm(true);
  };

  // Handler confirm modal
  const handleConfirm = () => {
    setShowConfirm(false);
    setShowSuccess(true);
  };

  // Handler tutup modal sukses
  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };
  return (
    <div className="flex flex-wrap bg-gray-50 h-full">
      <Sidebar />

      <div className="flex flex-wrap flex-col flex-1 p-6 mt-4 ">
        <Breadcrumb items={breadcrumbItems} />
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex flex-wrap  justify-between w-full max-w-full ">
            <div>
              <Typography
                type="primary"
                weight="semibold"
                className="text-blue-900 text-4xl mt-6"
              >
                Detail Acara
              </Typography>
              <Typography
                type="body"
                weight="regular"
                className="text-gray-600 mt-3"
              >
                Menampilkan halaman detail acara dari Acara{" "}
                <span className="italic">"Nama acara"</span>
              </Typography>
            </div>
            <div className="flex items-start">
              <Button
                variant="primary"
                className="font-light text-sm px-4 py-2 mt-12"
                onClick={handleSaveClick}
              >
                Simpan Perubahan
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap justify-between mt-10">
            <div>
              <Typography type="caption1" weight="semibold" className="mb-4">
                Event Name
              </Typography>
              <img
                src={AirnavLogo}
                alt=""
                className="bg-amber-300 w-80 rounded-2xl"
              />
            </div>
            <div>
              <div>
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Nama Acara
                </Typography>
                <div className="relative w-72">
                  <Pencil className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Pencil>
                  <input
                    type="text"
                    placeholder="Jam Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-7">
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Lokasi Acara
                </Typography>
                <div className="relative w-full">
                  <MapPin className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></MapPin>
                  <input
                    type="text"
                    placeholder="Jam Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div>
              <div>
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Tanggal Acara
                </Typography>
                <div className="relative w-72">
                  {/* <CalendarPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></CalendarPlus> */}
                  <input
                    type="date"
                    placeholder="Jam Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="mt-7">
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Waktu Acara
                </Typography>
                <div className="relative w-full">
                  {/* <Clock className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Clock>  */}
                  <input
                    type="time"
                    placeholder="Jam Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Typography type="caption1" weight="semibold" className="mb-4">
              Deskripsi Acara
            </Typography>
            <textarea className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"></textarea>
          </div>
          <div className="flex flex-wrap mt-6 w-full gap-9">
            {statusField.map((field, index) => (
              <div key={index} className="w-72">
                <Typography type="caption1" weight="semibold" className="mb-2">
                  {field.label}
                </Typography>
                <div className="relative w-full">
                  {field.icon}
                  <input
                    type={field.type}
                    placeholder={field.label}
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Typography type="caption1" weight="semibold" className="mb-4">
              Informasi Tambahan
            </Typography>
            <textarea className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"></textarea>
          </div>
          <div className="flex outline-2 outline-offset-2 outline-gray-300 w-fit rounded-2xl p-5 mt-6">
            <div className="flex flex-col ">
              <div className="p-10 flex flex-col bg-amber-600">
                <p>barcode</p>
              </div>
              <div className="pt-2">
                <Typography type="body" className="text-gray-600">
                  Download <br />
                  QR Code
                </Typography>
              </div>
            </div>
            <div>
              <div className="p-3">
                <RadioGroup
                  options={radioOptions}
                  selected={selectedOption}
                  onChange={setSelectedOption}
                />
              </div>
            </div>
          </div>
        </form>
        {/* Modal Confirm */}
        {showConfirm && (
          <EditEvent
            isOpen={showConfirm}
            type="confirm"
            onClose={() => setShowConfirm(false)}
            onConfirm={handleConfirm}
          />
        )}

        {/* Modal Success */}
        {showSuccess && (
          <EditEvent
            isOpen={showSuccess}
            type="success"
            message="Data acara berhasil disimpan!"
            onClose={handleCloseSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default InfoAcara;
