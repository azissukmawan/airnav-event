import React from "react";
import Header from "./header";
import Footer from "./footer";

const LandingLayout = ({ children }) => {
  return (
    <div className="font-poppins text-gray-800">
      <Header
        menuItems={[
          { name: "Home", href: "/" },
          { name: "About", href: "/#about" },
          { name: "Events", href: "/#events" },
        ]}
      />
      <main>{children}</main>
    </div>
  );
};

export default LandingLayout;
