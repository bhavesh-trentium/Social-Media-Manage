import React, { useEffect } from "react";
import "./styles/globle.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./components/auth/SignIn";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;
