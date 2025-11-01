import React, { useState } from "react";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import { Button } from "../../../components/button";
import AirnavLogo from "../../../assets/airnav2.png";
import { Pencil, MapPin, CalendarPlus, Clock, Wallpaper, FileSearch, FileStack, FileUser} from "lucide-react";
import { RadioGroup } from "../../../components/form/Radiogroup";
import Breadcrumb from "../../../components/Breadcrumb";


const InfoAcara = () => {
  const statusField = [
    {label: "Tanggal Mulai Pendaftaran", type:"date"},
    {label: "Tanggal Penutupan Acara", type:"date"},
    {label: "Tipe Acara", icon:<Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Wallpaper>, type:"text"},
    {label: "Jenis Acara", icon:<Wallpaper className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Wallpaper>, type:"text"},
    {label: "Modul Penutupan Acara", icon:<FileStack className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileStack>, type:"file"},
    {label: "Susunan Penutupan Acara", icon:<FileSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileSearch>, type:"file"},
    {label: "Template Sertifikat Penut  upan Acara", icon:<FileUser className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></FileUser>, type:"File"},
  ];

  const [selectedOption, setSelectedOption] = useState("nonaktif");

  const radioOptions = [
    { label: "Non Aktif", value: "nonaktif"},
    { label: "Aktif", value: "aktif" },
  ];

    const breadcrumbItems = [
    { label: "Dashboard", link: "/admin" },
    { label: "Acara", link: "/admin/events" },
    { label: "Informasi Acara" },
  ];


  return (
    <div className="flex flex-wrap bg-gray-50 h-full">
      <Sidebar />

      <div className="flex flex-wrap flex-col flex-1 p-8">
        <Breadcrumb items={breadcrumbItems}></Breadcrumb>
        <div className="flex flex-wrap justify-between w-full max-w-full rounded-2xl ">
          <div>
            <Typography
              type="heading4"
              weight="bold"
              className="text-blue-900 text-xl"
            >
              Detail Acara
            </Typography>
            <Typography type="body" weight="regular" className="text-gray-600">
              Menampilkan halaman detail acara dari Acara{" "}
              <span className="italic">"Nama acara"</span>
            </Typography>
          </div>

          <div className="flex items-start">
            <button className="bg-blue-900 px-3 py-3 rounded-2xl text-blue-50 font-semibold hover:bg-blue-200 hover:text-blue-950 transition-colors">Simpan Perubahan</button>
            {/* <Button variant="primary" className="font-light text-sm px-4 py-2">
              Simpan Perubahan
            </Button> */}
          </div>
        </div>

        <div className="flex flex-wrap flex-row justify-between mt-6">
            <div>
                <Typography type="caption1" weight="semibold" className="mb-4" >Event Name</Typography>
                <img src={AirnavLogo} alt="" className="bg-amber-300 w-80 rounded-2xl" />
            </div>
            <div className="flex flex-wrap gap-6 flex-col">
              <div className="flex flex-wrap">
                <div className="mr-5">
                    <Typography type="caption1" weight="semibold" className="mb-4">Nama Acara</Typography>
                    <div className="relative w-72">
                      <Pencil className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></Pencil>
                      <input
                      type="text"
                      placeholder="Jam Acara"
                      className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>
                </div>
                <div className="">
                    <Typography type="caption1" weight="semibold" className="mb-4" >Lokasi Acara</Typography>
                    <div className="relative w-72">
                      <MapPin className=" absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></MapPin>
                      <input
                      type="text"
                      placeholder="Jam Acara"
                      className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>  
                </div>
              </div>  
              <div className="flex flex-wrap">
                <div className="mr-5">
                    <Typography type="caption1" weight="semibold" className="mb-4">Tanggal Acara</Typography>
                    <div className="relative w-72">
                      {/* <CalendarPlus className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"></CalendarPlus> */}
                      <input
                      type="date"
                      placeholder="Jam Acara"
                      className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                      />
                    </div>
                </div>
                <div className="">
                    <Typography type="caption1" weight="semibold" className="mb-4">Waktu Acara</Typography>
                    <div className="relative w-72">
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
        </div>
        <div className="mt-6">
          <Typography type="caption1" weight="semibold" className="mb-4" >Deskripsi Acara</Typography>
          <textarea className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"></textarea>
        </div>
        <div className="flex flex-wrap mt-6 w-full gap-9">
          {statusField.map((field, index) => (
            <div key={index} className="w-72">
              <Typography type="caption1" weight="semibold" className="mb-2">{field.label}</Typography>
              <div className="relative w-full">
                {field.icon}
                <input type={field.type} placeholder={field.label} className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"/>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <Typography type="caption1" weight="semibold" className="mb-4" >Informasi Tambahan</Typography>
          <textarea className="w-full bg-white outline-2 outline-offset-2 outline-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"></textarea>
        </div>
        <div className="flex outline-2 outline-offset-2 outline-gray-300 w-fit rounded-2xl p-5 mt-6">
          <div className="flex flex-col ">
            <div className="p-10 flex flex-col bg-amber-600">
              <p>barcode</p>
            </div>
            <div className="pt-2">
              <Typography type="body" className="text-gray-600">Download <br />QR Code</Typography>
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
        
      </div>
    </div>
  );
};

export default InfoAcara;