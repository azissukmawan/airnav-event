import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Sidebar from "../../../components/sidebar";
import { Typography } from "../../../components/typography";
import Breadcrumb from "../../../components/breadcrumb";
import axios from "axios";
import { QRCodeCanvas } from "qrcode.react";

const DetailEventId = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const qrRef = useRef();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/admin/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const eventData =
          response.data?.data?.data || response.data?.data || response.data;

        setEvent(eventData);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        setError(error.response?.data?.message || "Terjadi kesalahan");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchEvent();
  }, [id, token]);

  const handleDownloadQR = () => {
    if (!qrRef.current || !event?.mdl_kode_qr) return;
    const canvas = qrRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.mdl_kode_qr}-QR.png`;
    link.click();
  };

  if (loading) {
    return (
      <div className="flex ml-48 bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 p-8 justify-center items-center">
          <Typography>Memuat data acara...</Typography>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex ml-48 bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex flex-col flex-1 p-8 justify-center items-center">
          <Typography className="text-red-600">
            {error || "Data acara tidak ditemukan"}
          </Typography>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-900 text-white rounded-xl hover:bg-blue-700"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex ml-48 flex-wrap bg-gray-50 min-h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1 p-8">
        <Breadcrumb
          items={[
            { label: "Dashboard", link: "/admin" },
            { label: "Acara", link: "/admin/events" },
            { label: "Informasi Acara", link:`/admin/event/${id}`},
            { label: event.mdl_nama || "Detail Acara" },
          ]}
        />

        <div className="flex justify-between mt-7 mb-5 w-full">
          <div>
            <Typography
              type="heading4"
              weight="bold"
              className="text-blue-900 text-xl"
            >
              Detail Acara
            </Typography>
            <Typography type="body" className="text-gray-600">
              Menampilkan halaman detail acara {event.mdl_nama}
            </Typography>
          </div>
            {event.mdl_status === "draft" && (
                <Link to={`/admin/event/edit/${id}`}>
                <button className="bg-blue-900 px-8 py-2 rounded-2xl text-blue-50 font-semibold hover:bg-blue-700 transition-colors">
                    Edit Data
                </button>
                </Link>
            )}
        </div>

        <div className="flex flex-wrap justify-between gap-8">
          <div className="flex-1 min-w-[320px]">
            <img
              src={event.mdl_banner_acara_url}
              alt=""
              className="bg-gray-200 w-80 h-48 object-cover rounded-2xl mb-4"
            />
            <div className="mb-5">
              <Typography weight="semibold">Deskripsi Acara</Typography>
              <textarea
                disabled
                value={event.mdl_deskripsi || ""}
                className="w-full h-24 rounded-xl p-2 text-sm"
              ></textarea>
            </div>
            <div>
              <Typography weight="semibold">Informasi Tambahan</Typography>
              <textarea
                disabled
                value={event.mdl_catatan || ""}
                className="w-full h-24 rounded-xl p-2 text-sm"
              ></textarea>
            </div>
          </div>

          <div className="flex-1 min-w-[300px]">
            <div className="mb-5">
              <Typography weight="semibold">Nama Acara</Typography>
              <Typography>{event.mdl_nama}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">
                Tanggal Mulai Pendaftaran
              </Typography>
              <Typography>{event.mdl_pendaftaran_mulai}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Tanggal Mulai Acara</Typography>
              <Typography>{event.mdl_acara_mulai}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Tipe Acara</Typography>
              <Typography>{event.mdl_tipe}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Doorprize</Typography>
              <Typography>
                {event.mdl_doorprize_aktif === 1 ? "Ada" : "Tidak Ada"}
              </Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Modul Acara</Typography>
              {event.mdl_file_acara_url ? (
                <a
                  href={event.mdl_file_acara_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File Acara
                </a>
              ) : (
                <p>Tidak ada file acara</p>
              )}
            </div>
            <div>
              <Typography weight="semibold">Template Sertifikat</Typography>
              {event.mdl_template_sertifikat_url ? (
                <a
                  href={event.mdl_template_sertifikat_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File Sertifikat
                </a>
              ) : (
                <p>Tidak ada file sertifikat</p>
              )}
            </div>
          </div>

          <div className="flex-1 min-w-[300px]">
            <div className="mb-5">
              <Typography weight="semibold">Lokasi Acara</Typography>
              <Typography>{event.mdl_lokasi}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">
                Tanggal Selesai Pendaftaran
              </Typography>
              <Typography>{event.mdl_pendaftaran_selesai}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Tanggal Selesai Acara</Typography>
              <Typography>{event.mdl_acara_selesai}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Jenis Acara</Typography>
              <Typography>{event.mdl_kategori}</Typography>
            </div>
            <div className="mb-5">
              <Typography weight="semibold">Susunan Acara</Typography>
              {event.mdl_file_rundown_url ? (
                <a
                  href={event.mdl_file_rundown_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  Lihat File Rundown
                </a>
              ) : (
                <p>Tidak ada file rundown</p>
              )}
            </div>

            <div className="flex flex-col">
              <Typography weight="semibold">QR Code Presensi</Typography>
              <div ref={qrRef} className="flex mb-4 gap-3 items-center">
                <QRCodeCanvas
                  value={event.mdl_kode_qr || ""}
                  size={80}
                  className="p-2 bg-white rounded"
                />
                <Typography>
                  Presensi Acara: <br />
                  {event.mdl_presensi_aktif === 1
                    ? "Aktif"
                    : "Tidak Aktif"}
                </Typography>
              </div>
              <button
                onClick={handleDownloadQR}
                className="bg-blue-900 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition"
              >
                Download QR Code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailEventId;
