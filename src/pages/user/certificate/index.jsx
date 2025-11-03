import React, { useState, useEffect } from "react";
import {
  Page,
  Text,
  Document,
  PDFViewer,
  View,
  StyleSheet,
  Image as PdfImage,
} from "@react-pdf/renderer";
import Loading from "../../../components/loading";

const styles = StyleSheet.create({
  body: {
    width: "29.7cm",
    height: "21cm",
  },
  text: {
    position: "absolute",
    left: "0px",
    right: "0px",
    marginHorizontal: "auto",
    textAlign: "center",
    justifyContent: "center",
  },
  certNumber: {
    fontSize: 16,
    color: "#000",
    fontWeight: "normal",
  },
  name: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#000",
    letterSpacing: 1,
  },
});

const Certificate = ({ name, number, background }) => {
  const displayName = name && name !== "null" ? name : "Nama belum tersedia";
  const displayNumber =
    number && number !== "null" ? number : "Nomor belum tersedia";

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.body}>
        <View>
          <PdfImage src={background} />
        </View>

        <Text style={{ top: "160px", ...styles.text, ...styles.certNumber }}>
          Nomor: {displayNumber}
        </Text>

        <Text style={{ top: "207px", ...styles.text, ...styles.name }}>
          {displayName}
        </Text>
      </Page>
    </Document>
  );
};

export default function CertificatePreview() {
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [bgBase64, setBgBase64] = useState(null);

  useEffect(() => {
    // Fungsi untuk ubah gambar menjadi base64
    const loadImageAsBase64 = async (url) => {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`Gagal load gambar: ${url}`);
        const blob = await res.blob();
        return await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } catch (err) {
        console.error("Gagal load:", url, err);
        return null;
      }
    };

    const loadWithFallback = async (url) => {
      // Urutan fallback: url → /cert.jpg → /no-image.jpg
      let base64 = null;
      if (url && url !== "null") {
        base64 = await loadImageAsBase64(url);
      }
      if (!base64) {
        console.warn("Template tidak ditemukan, coba fallback /cert.jpg");
        base64 = await loadImageAsBase64("/cert.jpg");
      }
      if (!base64) {
        console.warn("Gagal juga, fallback terakhir /no-image.jpg");
        base64 = await loadImageAsBase64("/no-image.jpg");
      }
      return base64;
    };

    const init = async () => {
      try {
        const certData = localStorage.getItem("cert_data");
        let parsed = {};
        if (certData) parsed = JSON.parse(certData);

        setName(parsed.data?.nama_peserta || parsed.name || "");
        setNumber(parsed.data?.no_sertifikat || parsed.number || "");

        const templateUrl =
          parsed.data?.base_template_sertifikat || parsed.data?.templateUrl;

        console.log("Template URL:", templateUrl);

        const base64 = await loadWithFallback(templateUrl);
        setBgBase64(base64);
      } catch (err) {
        console.error("Gagal parsing cert_data:", err);
        const base64 = await loadWithFallback(null);
        setBgBase64(base64);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  if (loading || !bgBase64) return <Loading />;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <Certificate name={name} number={number} background={bgBase64} />
      </PDFViewer>
    </div>
  );
}
