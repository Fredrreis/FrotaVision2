"use client";

import React from "react";
import dynamic from "next/dynamic";
import "../../home/home.css";

const Register = dynamic(() => import("./register"), { ssr: false });

export default function App() {
  return <Register />;
}
