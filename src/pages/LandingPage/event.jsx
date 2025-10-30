import React, { useState } from "react";
import Header from "./header";
import Footer from "./footer";
import {
  Calendar,
  MapPin,
  Facebook,
  MessageCircle,
  Twitter as X,
  Twitter,
  Instagram,
  Linkedin,
  Copy,
} from "lucide-react";
import { Button } from "../../components/button";
import Tabs from "../../components/tabs";
import { Typography } from "../../components/typography";
import heroImage from "../../assets/hero.png";

const EventDetail = () => {
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Gagal menyalin tautan:", err);
    }
  };

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const shareToWhatsApp = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(
        "Cek event keren ini! " + shareUrl
      )}`,
      "_blank"
    );
  };

  const shareToX = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        shareUrl
      )}&text=Cek%20event%20keren%20ini!`,
      "_blank"
    );
  };

  const tabItems = [
    {
      label: "Deskripsi",
      content: (
        <div className="space-y-10">
          <div>
            <Typography
              type="heading5"
              weight="semibold"
              className="text-gray-900 mb-3"
            >
              Tentang <span className="text-blue-600">Smart & Precision</span>{" "}
              Event Management
            </Typography>
            <Typography
              type="paragraph"
              className="text-gray-700 leading-relaxed"
            >
              AirNav Event Management is a smart and integrated system designed
              to ensure efficiency, precision, and professionalism in every
              event. With advanced technology and an intuitive interface, it
              simplifies scheduling, participant management, and progress
              monitoring.
            </Typography>
          </div>
        </div>
      ),
    },
    {
      label: "Informasi",
      content: (
        <div className="space-y-10">
          <div>
            <Typography
              type="heading6"
              weight="semibold"
              className="text-gray-900 mb-4"
            >
              Informasi Acara
            </Typography>
            <ul className="space-y-1 text-gray-700">
              <li>
                <strong>Alamat:</strong> Airnav, Tangerang
              </li>
              <li>
                <strong>Tanggal Pendaftaran:</strong> 11–20 Oktober 2026
              </li>
              <li>
                <strong>Tanggal Acara:</strong> 25 Oktober 2026
              </li>
              <li>
                <strong>Jam Acara:</strong> 09:00 – 12:00 WIB
              </li>
            </ul>
          </div>

          <div>
            <Typography
              type="heading6"
              weight="semibold"
              className="text-gray-900 mb-4"
            >
              Informasi Tambahan
            </Typography>
            <Typography
              type="paragraph"
              className="text-gray-700 leading-relaxed"
            >
              <strong>Dress Code:</strong> Baju warna putih, celana/rok hitam.
            </Typography>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="font-poppins text-gray-800">
      <Header
        menuItems={[
          { name: "Home", href: "/" },
          { name: "About", href: "/#about" },
          { name: "Events", href: "/#events" },
        ]}
      />

      <section className="relative mt-20 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

        <div className="relative max-w-6xl mx-auto px-6 md:px-0 z-10 flex items-center">
          <div className="grid md:grid-cols-2 gap-10 items-center text-white w-full">
            <div>
              <Typography
                type="heading3"
                weight="semibold"
                className="text-white"
              >
                Smart & Precision Event Management System
              </Typography>
              <div className="flex items-center gap-3 mt-3 text-gray-200">
                <MapPin className="w-4 h-4" />
                <Typography type="body">Airnav, Tangerang</Typography>
              </div>
              <div className="flex items-center gap-3 text-gray-200 mt-1">
                <Calendar className="w-4 h-4" />
                <Typography type="body">
                  25 Oktober 2026, 09:00–12:00 WIB
                </Typography>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={heroImage}
                alt="Smart & Precision Event"
                className="rounded-2xl shadow-2xl w-full max-w-md max-h-[220px] my-10 object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-0 mt-10 mb-16">
        <div className="grid md:grid-cols-[2fr_1fr] gap-10 items-start">
          <div>
            <Tabs items={tabItems} />
          </div>

          <div className="space-y-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg w-full md:w-auto">
              Daftar Sekarang
            </Button>

            <div className="flex flex-col items-start gap-3">
              <Typography type="body" weight="medium" className="text-gray-700">
                Bagikan Event:
              </Typography>
              <div className="flex gap-3">
                <div
                  onClick={copyToClipboard}
                  className="w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center hover:bg-gray-600 cursor-pointer"
                  title="Salin Tautan"
                >
                  <Copy className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToFacebook}
                  className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-700 cursor-pointer"
                  title="Bagikan ke Facebook"
                >
                  <Facebook className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToWhatsApp}
                  className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center hover:bg-green-600 cursor-pointer"
                  title="Bagikan ke WhatsApp"
                >
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <div
                  onClick={shareToX}
                  className="w-10 h-10 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 cursor-pointer"
                  title="Bagikan ke X (Twitter)"
                >
                  <X className="w-5 h-5 text-white" />
                </div>
              </div>
              {copied && (
                <Typography type="caption2" className="text-green-600">
                  ✅ Tautan disalin ke clipboard
                </Typography>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default EventDetail;
