import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { Typography } from "../../components/typography";
import CardLanding from "../../components/cardLanding";
import Spinner from "../../components/spinner";

const API_BASE_URL =
  "https://mediumpurple-swallow-757782.hostingersite.com/api";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [prevVisibleCount, setPrevVisibleCount] = useState(0);

  // Fetch events
  useEffect(() => {
    setLoading(true);
    fetch(`${API_BASE_URL}/events/all`)
      .then((res) => res.json())
      .then((data) => {
        if (data?.success && Array.isArray(data.data?.events)) {
          const mappedEvents = data.data.events.map((event) => ({
            id: event.id,
            slug: event.mdl_slug,
            title: event.mdl_nama,
            date: event.mdl_acara_mulai,
            location: event.mdl_lokasi,
            image: event.media_urls?.banner,
            status: event.status_acara,
            type: event.mdl_tipe,
            mdl_pendaftaran_mulai: event.mdl_pendaftaran_mulai,
            mdl_pendaftaran_selesai: event.mdl_pendaftaran_selesai,
            mdl_acara_mulai: event.mdl_acara_mulai,
            mdl_acara_selesai: event.mdl_acara_selesai,
          }));
          setEvents(mappedEvents);
        } else {
          setEvents([]);
        }
      })
      .catch((err) => {
        console.error(err);
        setEvents([]);
      })
      .finally(() => setLoading(false));
  }, []);

  // Load More Button
  const handleLoadMore = () => {
    setLoadingMore(true);
    setPrevVisibleCount(visibleCount); // simpan batas lama untuk fade-in
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + 6, events.length));
      setLoadingMore(false);
    }, 600); // simulasi loading
  };

  // Fade-in animation
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const FadeInSection = ({ children, delay = 0 }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.2 });
    return (
      <motion.div
        ref={ref}
        variants={fadeUp}
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
          backgroundImage: "url(/hero.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-black/50 z-10"></div>
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
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
          className="hidden lg:block z-20"
        >
          <img
            src="/airnav-logo-notext.png"
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
          <div>
            <img
              src="/airnav.png"
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
        className="py-20 px-8 md:px-28 bg-white text-center overflow-hidden gap-10"
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

        {/* Load More Button */}
        {visibleCount < events.length && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleLoadMore}
              className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 flex items-center justify-center gap-2 transition h-10"
            >
              {loadingMore && <Spinner className="w-4 h-4 text-white" />}
              <span>{loadingMore ? "Memuat..." : "Load More"}</span>
            </button>
          </div>
        )}
      </section>

      {/* === SUPPORTED BY SECTION === */}
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
            <img src="/bumn.png" alt="BUMN" className="h-12 sm:h-14 lg:h-20" />
            <img
              src="/airnav-logo.png"
              alt="AirNav Indonesia"
              className="h-12 sm:h-14 lg:h-20"
            />
            <img
              src="/maganghub.png"
              alt="Maganghub"
              className="h-12 sm:h-14 lg:h-20"
            />
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}