import React from "react";
import { Route, Routes } from "react-router-dom";
import App from "./App";
import Mjak from "./Mjak";
import Random from "./Random";
import Login from "./Login";

export default function Apna() {
  return (
    <Routes>
      <Route exact path="/" element={<App />} />
      <Route path="/room" element={<Mjak />} />
      <Route path="/infinite" element={<Random />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
