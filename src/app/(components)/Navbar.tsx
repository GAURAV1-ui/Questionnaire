
import React from "react";
import Image from "next/image";
import Logo from "../../assets/Kreatoors Logo.svg"

const Navbar = () => {
  return (
    <header className="flex justify-left p-4 font-poppins md:px-8">
      <Image src={Logo} alt="Kreatoors Logo" className="w-8 h-8"/>
      <h1 className="text-xl font-bold text-black">Kreatoors</h1>
    </header>
  );
};

export default Navbar;
