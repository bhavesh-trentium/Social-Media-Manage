import React, { useEffect } from "react";
import "./styles/globle.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import SignIn from "./components/auth/SignIn";

function App() {
  const navigate = useNavigate();
  const user = localStorage.getItem("user");
  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      navigate("/home");
    }
  }, []);
  return (
    <Routes>
      <Route path="*" element={user ? <Home /> : <SignIn />} />
      <Route path="/home/*" element={<Home />} />
    </Routes>
  );
}

export default App;
