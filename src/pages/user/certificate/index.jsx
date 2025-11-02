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
    color: "#8B4545",
    fontWeight: "normal",
  },
  name: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#1a5490",
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
    const loadImageAsBase64 = (url) => {
      return fetch(url)
        .then((res) => {
          if (!res.ok) throw new Error(`Failed to load image: ${url}`);
          return res.blob();
        })
        .then(
          (blob) =>
            new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(blob);
            })
        );
    };

    const certData = localStorage.getItem("cert_data");
    if (certData) {
      try {
        const parsed = JSON.parse(certData);
        setName(parsed.data?.nama_peserta || parsed.name || "");
        setNumber(parsed.data?.no_sertifikat || parsed.number || "");

        const templateUrl = parsed.templateUrl || parsed.data?.templateUrl;

        console.log("Template URL from DB:", templateUrl);

        if (templateUrl && templateUrl !== "null" && templateUrl !== null) {
          if (templateUrl.startsWith("data:image")) {
            setBgBase64(templateUrl);
            setLoading(false);
          } else {
            loadImageAsBase64(templateUrl)
              .then((base64) => {
                console.log("Loaded template from DB successfully");
                setBgBase64(base64);
              })
              .catch((err) => {
                console.error("Gagal load template dari DB:", err);
                return loadImageAsBase64("/cert.jpg");
              })
              .then((base64) => {
                if (base64) setBgBase64(base64);
              })
              .catch((err) => {
                console.error("Gagal load default background:", err);
              })
              .finally(() => setLoading(false));
          }
        } else {
          console.log("No template URL, using default /cert.jpg");
          loadImageAsBase64("/cert.jpg")
            .then((base64) => setBgBase64(base64))
            .catch((err) => {
              console.error("Gagal load default background:", err);
            })
            .finally(() => setLoading(false));
        }
      } catch (err) {
        console.error("Gagal parsing cert_data:", err);
        loadImageAsBase64("/cert.jpg")
          .then((base64) => setBgBase64(base64))
          .catch((err) => console.error("Gagal load default background:", err))
          .finally(() => setLoading(false));
      }
    } else {
      console.log("No cert_data found, using default /cert.jpg");
      loadImageAsBase64("/cert.jpg")
        .then((base64) => setBgBase64(base64))
        .catch((err) => console.error("Gagal load default background:", err))
        .finally(() => setLoading(false));
    }
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