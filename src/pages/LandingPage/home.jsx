import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography } from "../../components/typography";
import CardLanding from "../../components/cardLanding";
import airnavLogoOnly from "../../assets/airnav-logo-notext.png";
import heroImage from "../../assets/hero.png";
import airnav from "../../assets/airnav.png";
import bumn from "../../assets/bumn.png";
import maganghub from "../../assets/maganghub.png";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [prevVisibleCount, setPrevVisibleCount] = useState(0);

  // sentinel hook dari react-intersection-observer
  const [loaderRef, loaderInView] = useInView({
    root: null,
    rootMargin: "0px",
    threshold: 0,
  });

  // fetch semua event sekali (atau ganti dengan pagination endpoint)
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/events/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.events)) {
          const mappedEvents = data.data.events.map((event) => ({
            id: event.id,
            slug: event.slug,
            title: event.nama,
            date: event.tanggal_mulai,
            location: event.lokasi,
            image: event.banner,
            status: event.status_acara,
            type: event.tipe,
          }));
          setEvents(mappedEvents);
          setHasMore(mappedEvents.length > 6);
        } else {
          setEvents([]);
          setHasMore(false);
        }
      })
      .catch((err) => {
        console.error("Fetch events error:", err);
        setEvents([]);
        setHasMore(false);
      })
      .finally(() => setLoading(false));
  }, []);

  // ketika sentinel terlihat, tambah visibleCount
  useEffect(() => {
    if (loaderInView && !loading && hasMore) {
      setLoading(true);
      setTimeout(() => {
        setPrevVisibleCount(visibleCount); // simpan batas lama
        setVisibleCount((prev) => {
          const next = prev + 6;
          if (next >= events.length) {
            setHasMore(false);
            return events.length;
          }
          return next;
        });
        setLoading(false);
      }, 600);
    }
  }, [loaderInView, loading, hasMore, events.length, visibleCount]);

  // Animasi dasar & FadeInSection (tetap pakai yang sebelumnya)
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const FadeInSection = ({ children, delay = 0, variant = fadeUp }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <motion.div
        ref={ref}
        variants={variant}
        initial="hidden"
        animate={inView ? "visible" : "hidden"}
        transition={{ delay }}
      >
        {children}
      </motion.div>
    );
  };

  return (
    <div>
      {/* === HERO SECTION === */}
      <section
        className="relative h-[80vh] flex gap-10 items-center justify-between px-8 md:px-28 overflow-hidden mt-16"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>

        {/* Text masuk dari kiri */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 max-w-xl text-white"
        >
          <Typography
            type="heading2"
            weight="bold"
            className="text-white mb-4 drop-shadow-lg"
          >
            Tepat & Efisien
            <br />
            Sistem Manajemen Acara AirNav
          </Typography>
          <Typography type="body1" className="text-gray-100 drop-shadow">
            Mulai dari perencanaan hingga pelaksanaan — setiap detail dikelola
            dengan presisi, akurasi, dan efisiensi tinggi.
          </Typography>
        </motion.div>

        {/* Logo masuk dari kanan */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="hidden lg:block z-20"
        >
          <img
            src={airnavLogoOnly}
            alt="AirNav Indonesia"
            className="w-68 mx-20"
          />
        </motion.div>
      </section>

      {/* === ABOUT SECTION === */}
      <section
        className="bg-blue-50 py-16 px-8 md:px-28 grid md:grid-cols-2 gap-12 items-center"
        id="tentang"
      >
        <FadeInSection delay={0.1}>
          <div className="">
            <img
              src={airnav}
              alt="AirNav Event Management"
              className="w-full h-auto max-w-120 rounded-xl"
            />
          </div>
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <div>
            <Typography
              type="heading4"
              weight="semibold"
              className="text-gray-900 mb-2"
            >
              Tentang <span className="text-blue-700">NavEvent</span> Sistem
              Manajemen Acara AirNav
            </Typography>
            <Typography type="body1" className="text-gray-600 leading-relaxed">
              NavEvent adalah sistem pintar dan terintegrasi yang dirancang
              untuk memastikan efisiensi, ketepatan, dan profesionalisme di
              setiap acara. Dengan teknologi canggih dan antarmuka yang
              intuitif, sistem ini memudahkan penjadwalan, pengelolaan peserta,
              serta pemantauan progres acara.
            </Typography>
          </div>
        </FadeInSection>
      </section>

      {/* === EVENTS SECTION === */}

      <section
        className="py-20 px-8 md:px-28 bg-white text-center overflow-hidden"
        id="acara"
      >
        <FadeInSection delay={0.1}>
          <Typography type="heading4" weight="bold" className="mb-10">
            Acara AirNav
          </Typography>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.slice(0, visibleCount).map((event, index) => {
            const isNew = index >= prevVisibleCount;
            return isNew ? (
              <FadeInSection
                key={event.id}
                delay={(index - prevVisibleCount) * 0.08}
              >
                <CardLanding {...event} />
              </FadeInSection>
            ) : (
              <CardLanding key={event.id} {...event} />
            );
          })}
        </div>

        {/* SENTINEL UNTUK TRIGGER LOAD BERIKUTNYA */}
        <div
          ref={loaderRef}
          className="h-10 flex justify-center items-center mt-8"
        >
          {loading && <p className="text-gray-500">Memuat...</p>}
        </div>
      </section>
      <section className="bg-blue-50 py-16 text-center px-4 sm:px-8">
        <FadeInSection delay={0.1}>
          <Typography
            type="heading5"
            weight="semibold"
            className="mb-8 text-gray-800"
          >
            Supported by
          </Typography>
        </FadeInSection>
        <FadeInSection delay={0.3}>
          <div className="flex flex-wrap justify-center items-center gap-6 lg:gap-12 px-4">
            <img src={bumn} alt="BUMN" className="h-12 sm:h-14 lg:h-20" />
            <img
              src="/src/assets/airnav-logo.png"
              alt="AirNav Indonesia"
              className="h-12 sm:h-14 lg:h-20"
            />
            <img
              src={maganghub}
              alt="Maganghub"
              className="h-12 sm:h-14 lg:h-20"
            />
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
