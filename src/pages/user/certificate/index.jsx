import React, { useState } from "react";
import {
  Page,
  Text,
  Document,
  StyleSheet,
  PDFViewer,
  View,
  Image,
} from "@react-pdf/renderer";
import bgImage from "../../../assets/cert.png";

// Styles
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
    fontWeight: "normal",
  },
  name: {
    fontSize: 36,
    fontWeight: "bold",
    letterSpacing: 1,
  },
});

// Certificate PDF
const Certificate = ({ name, number, background }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.body}>
      <View>
        <Image src={background} />
      </View>

      <Text style={{ top: "160px", ...styles.text, ...styles.certNumber }}>
        Nomor: {number}
      </Text>

      <Text style={{ top: "210px", ...styles.text, ...styles.name }}>
        {name}
      </Text>
    </Page>
  </Document>
);

// Main Component
export default function CertificatePreview() {
  const [name, setName] = useState("John Doe");
  const [number, setNumber] = useState("00082/KODEEEEEEEEEEEE/FHCI01/5/24");

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <PDFViewer style={{ width: "100%", height: "100%" }}>
        <Certificate name={name} number={number} background={bgImage} />
      </PDFViewer>
    </div>
  );
}