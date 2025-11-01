import React, { createContext, useState, useContext, useEffect } from "react";

const DoorprizeContext = createContext();

export const DoorprizeProvider = ({ children }) => {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          "http://localhost:5000/api/doorprize/participants"
        );
        const data = await res.json();
        setParticipants(data.participants || []);
        setWinners(data.winners || []);
      } catch (error) {
        console.error("Gagal memuat data doorprize:", error);
      }
    };
    fetchData();
  }, []);

  const addWinner = async (participantId) => {
    try {
      const res = await fetch("http://localhost:5000/api/doorprize/winner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const data = await res.json();
      setWinners((prev) => [...prev, data]);
      return data;
    } catch (error) {
      console.error("Gagal menambahkan pemenang:", error);
      throw error;
    }
  };

  return (
    <DoorprizeContext.Provider value={{ participants, winners, addWinner }}>
      {children}
    </DoorprizeContext.Provider>
  );
};

export const useDoorprize = () => useContext(DoorprizeContext);
