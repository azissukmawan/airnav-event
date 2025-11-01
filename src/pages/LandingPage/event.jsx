import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import {
  Calendar,
  MapPin,
  Facebook,
  MessageCircle,
  X,
  Copy,
} from "lucide-react";
import { Button } from "../../components/button";
import Tabs from "../../components/tabs";
import { Typography } from "../../components/typography";
import defaultImage from "../../assets/no-image.jpg";
import Loading from "../../components/loading";

const EventDetail = () => {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const shareUrl = window.location.href;

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/events/${slug}`);
        const json = await res.json();
        if (json.success && json.data?.event) {
          setEvent(json.data.event);
        } else {
          setEvent(null);
        }
      } catch (err) {
        console.error("Gagal mengambil event:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [slug]);

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

  if (loading) {
    return <Loading />;
  }

  if (!event) {
    return (
      <div className="text-center py-20">
        <Typography type="heading4">Event tidak ditemukan</Typography>
      </div>
    );
  }

  const bannerImage = event.banner || defaultImage;

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
              Tentang <span className="text-blue-600">{event.nama}</span>
            </Typography>
            <Typography
              type="paragraph"
              className="text-gray-700 leading-relaxed"
            >
              {event.deskripsi}
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
                <strong>Alamat:</strong> {event.lokasi || "Tidak tersedia"}
              </li>
              <li>
                <strong>Tanggal Pendaftaran:</strong>{" "}
                {event.pendaftaran?.mulai || "-"} –{" "}
                {event.pendaftaran?.selesai || "-"}
              </li>
              <li>
                <strong>Tanggal Acara:</strong> {event.acara?.mulai || "-"} –{" "}
                {event.acara?.selesai || "-"}
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
              {event.catatan || "Tidak ada catatan tambahan."}
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

      {/* HERO SECTION */}
      <section className="relative mt-20 overflow-hidden py-10 md:py-20 bg-gray-800">
        <div
          className="absolute inset-0 bg-cover bg-center scale-105"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-xs" />

        <div className="relative max-w-6xl mx-auto px-6 lg:px-0 md:px-12 z-10 flex items-center">
          <div className="grid md:grid-cols-2 gap-10 items-center text-white w-full">
            <div>
              <Typography
                type="heading3"
                weight="semibold"
                className="text-white"
              >
                {event.nama}
              </Typography>
              <div className="flex items-center gap-3 mt-3 text-gray-200">
                <MapPin className="w-4 h-4" />
                <Typography type="body">
                  {event.lokasi || "Lokasi belum ditentukan"}
                </Typography>
              </div>
              <div className="flex items-center gap-3 text-gray-200 mt-1">
                <Calendar className="w-4 h-4" />
                <Typography type="body">
                  {event.acara?.mulai || "-"} – {event.acara?.selesai || "-"}
                </Typography>
              </div>
            </div>

            <div className="flex justify-center">
              <img
                src={bannerImage}
                alt={event.nama}
                className="rounded-2xl shadow-2xl w-full max-w-md md:max-h-[250px] sm:max-h-[180px] object-cover hover:scale-105 transition-transform"
              />
            </div>
          </div>
        </div>
      </section>

      {/* TAB & SHARE SECTION */}
      <section className="w-full px-6 md:px-12 z-10 mb-20 mt-10 flex justify-center">
        <div className="w-full max-w-6xl grid md:grid-cols-[2fr_1fr] gap-10 items-start">
          <div>
            <Tabs items={tabItems} />
          </div>

          <div className="space-y-6">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2 rounded-lg w-full md:w-auto">
              {event.status_acara === "Bisa Daftar"
                ? "Daftar Sekarang"
                : event.status_acara}
            </Button>

            <div className="flex flex-col items-start gap-3">
              <Typography type="body" weight="medium" className="text-gray-700">
                Bagikan Event:
              </Typography>
              <div className="flex gap-3 flex-wrap">
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
