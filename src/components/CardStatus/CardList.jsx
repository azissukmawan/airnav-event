// CardList.jsx
import React from "react";
import CardStatus from "../../components/CardStatus/index";
import { Users, UserCheck, Lightbulb, Laptop, User } from "lucide-react";

const CardList = ({ participantsCount = 0 }) => {
  return (
    <div className="grid  md:grid-cols-5 gap-4 mb-10">
      <CardStatus
        icon={<Users className="text-blue-500" />}
        value={participantsCount}
        label="Jumlah Pendaftar"
        color="border-blue-500"
      />
      <CardStatus
        icon={<UserCheck className="text-yellow-500" />}
        value="45"
        label="Kehadiran"
        color="border-yellow-500"
      />
      <CardStatus
        icon={<Laptop className="text-red-500" />}
        value="5"
        label="Online"
        color="border-red-500"
      />
      <CardStatus
        icon={<User className="text-red-500" />}
        value="62"
        label="Offline"
        color="border-red-500"
      />
      <CardStatus
        icon={<Lightbulb className="text-green-500" />}
        value="2"
        label="Status Doorprize"
        color="border-green-500"
      />
    </div>
  );
};

export default CardList;
