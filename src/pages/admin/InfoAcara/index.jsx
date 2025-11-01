import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import AirnavLogo from "../../../assets/airnav2.png";
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
import Breadcrumb from "../../../components/breadcrumb";
import EditEvent from "../../../components/Popup/EditEvent";

const InfoAcara = () => {
  const statusField = [
    { label: "Tanggal Mulai Pendaftaran", type: "date" },
    { label: "Tanggal Penutupan Acara", type: "date" },
    {
      label: "Tipe Acara",
      icon: (
        <Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
    },
    {
      label: "Jenis Acara",
      icon: (
        <Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      ),
      type: "text",
    },
    {
      label: "Modul Penutupan Acara",
      icon: (
        <FileStack className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      ),
      type: "file",
    },
    {
      label: "Susunan Penutupan Acara",
      icon: (
        <FileSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      ),
      type: "file",
    },
    {
      label: "Template Sertifikat Penutupan Acara",
      icon: (
        <FileUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
      ),
      type: "file",
    },
  ];

  const [selectedOption, setSelectedOption] = useState("nonaktif");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara", link: "/admin/detail" },
    { label: "Detail Acara" },
  ];

  const handleSaveClick = () => {
    setIsModalOpen(true);
  };

  const handleConfirmSave = () => {
    setIsModalOpen(false);
    setShowSuccess(true);
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <div className="flex flex-wrap bg-gray-50 h-full">
      <Sidebar />

      <div className="flex flex-wrap flex-col flex-1 p-8">
        <Breadcrumb items={breadcrumbItems} />
        <div className="flex flex-wrap mt-7 mb-5  justify-between w-full max-w-full rounded-2xl">
          <div>
            <h1 className="text-4xl font-bold text-blue-900">Detail Acara</h1>
            <p className="text-gray-500 mt-3">
              Menampilkan halaman detail acara dari Acara{" "}
              <span className="font-semibold italic">“Nama Acara”</span>
            </p>
          </div>

          <div className="flex items-start">
            <button
              onClick={handleSaveClick}
              className="bg-blue-900 px-3 py-3 mt-2 rounded-2xl text-blue-50 font-semibold hover:bg-blue-200 hover:text-blue-950 transition-colors"
            >
              Simpan Perubahan
            </button>
          </div>
        </div>

        <div className="flex flex-wrap flex-row justify-between mt-6">
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
          <div className="flex flex-wrap gap-6 flex-col">
            <div className="flex flex-wrap">
              <div className="mr-5">
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Nama Acara
                </Typography>
                <div className="relative w-72">
                  <Pencil className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Nama Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Lokasi Acara
                </Typography>
                <div className="relative w-72">
                  <MapPin className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Lokasi Acara"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-wrap">
              <div className="mr-5">
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Tanggal Acara
                </Typography>
                <div className="relative w-72">
                  <input
                    type="date"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <Typography type="caption1" weight="semibold" className="mb-4">
                  Waktu Acara
                </Typography>
                <div className="relative w-72">
                  <input
                    type="time"
                    className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
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
          <div className="flex flex-col">
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
          <div className="p-3">
            <RadioGroup
              options={[
                { label: "Non Aktif", value: "nonaktif" },
                { label: "Aktif", value: "aktif" },
              ]}
              selected={selectedOption}
              onChange={setSelectedOption}
            />
          </div>
        </div>
      </div>

      {/* ✅ Popup Konfirmasi */}
      <EditEvent
        isOpen={isModalOpen}
        type="confirm"
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmSave}
      />

      {/* ✅ Popup Sukses */}
      <EditEvent
        isOpen={showSuccess}
        type="success"
        message="Perubahan data acara berhasil disimpan!"
        onClose={handleCloseSuccess}
      />
    </div>
  );
};

export default InfoAcara;
