import { Typography } from "../../components/typography";
import CardLanding from "../../components/cardLanding";
import airnavLogoOnly from "../../assets/airnav-logo-notext.png";
import heroImage from "../../assets/hero.png";
import airnav from "../../assets/airnav.png";
import bumn from "../../assets/bumn.png";
import kemenhub from "../../assets/kemenhub.png";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";

export default function Content() {
  const events = [
    {
      id: 1,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Segera Hadir",
      type: "Online",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
    {
      id: 2,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Bisa Daftar",
      type: "Hybrid",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
    {
      id: 3,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Terdaftar",
      type: "Offline",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
    {
      id: 4,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Ditutup",
      type: "Online",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
    {
      id: 5,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Ditutup",
      type: "Hybrid",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
    {
      id: 6,
      title: "Rapat Koordinator Bersama Jajaran Direktur",
      date: "25 November 2025, 09:00 WIB",
      location: "Gedung Dormitory",
      status: "Terdaftar",
      type: "Offline",
      image:
        "https://firstindonesiamagz.id/wp-content/uploads/2022/11/WhatsApp-Image-2022-11-10-at-13.54.09.jpeg",
    },
  ];

  // Animasi dasar
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  // Helper untuk animasi scroll
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
        className="relative h-[80vh] flex gap-10 items-center justify-between px-8 md:px-16 overflow-hidden mt-16"
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
            Smart & Precision
            <br />
            Event Management
            <br />
            System
          </Typography>
          <Typography type="body1" className="text-gray-100 drop-shadow">
            From planning to execution — everything is managed intelligently,
            accurately, and efficiently.
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
        className="bg-blue-50 py-16 px-8 md:px-16 grid md:grid-cols-2 md:gap-6 gap-8 items-center"
        id="about"
      >
        <FadeInSection delay={0.1}>
          <div className="flex justify-center">
            <img
              src={airnav}
              alt="AirNav Event Management"
              className="w-full h-auto max-w-100 rounded-xl mx-auto"
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
              About <span className="text-blue-700">AirNav</span> Event
              Management
            </Typography>
            <Typography type="body1" className="text-gray-600 leading-relaxed">
              AirNav Event Management is a smart and integrated system designed
              to ensure efficiency, precision, and professionalism in every
              event. With advanced technology and an intuitive interface, it
              simplifies scheduling, participant management, and progress
              monitoring.
            </Typography>
          </div>
        </FadeInSection>
      </section>

      {/* === EVENTS SECTION === */}
      <section className="py-20 px-8 md:px-16 bg-white text-center" id="events">
        <FadeInSection delay={0.1}>
          <Typography type="heading4" weight="bold" className="mb-10">
            AirNav Events
          </Typography>
        </FadeInSection>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {events.map((event, index) => (
            <FadeInSection key={event.id} delay={index * 0.2}>
              <CardLanding
                id={event.id}
                title={event.title}
                date={event.date}
                location={event.location}
                image={event.image}
                status={event.status}
                type={event.type}
              />
            </FadeInSection>
          ))}
        </div>
      </section>

      {/* === SUPPORTED SECTION === */}
      <section className="bg-blue-50 py-16 text-center px-8">
        <FadeInSection delay={0.1}>
          <Typography type="heading5" weight="semibold" className="mb-8">
            Supported by
          </Typography>
        </FadeInSection>

        <FadeInSection delay={0.3}>
          <div className="flex flex-row justify-center items-center lg:gap-12 gap-4">
            <img src={bumn} alt="BUMN" className="lg:h-20 h-14" />
            <img src={kemenhub} alt="Kemenhub" className="lg:h-20 h-14" />
            <img
              src="/src/assets/airnav-logo.png"
              alt="AirNav Indonesia"
              className="lg:h-20 h-14"
            />
          </div>
        </FadeInSection>
      </section>
    </div>
  );
}
