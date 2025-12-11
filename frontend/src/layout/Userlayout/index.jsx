import React from "react";

import NavBar from "@/components/Navbar";


export default function UserLayout({ children }) {
  return (
    <>
      <NavBar/>
      {children}
    </>
  );
}
