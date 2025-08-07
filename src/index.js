import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import AuthPage from "./components/Auth";
import "./index.css";
import "./axiosSetup";


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/login"    element={<AuthPage mode="login"    />} />
      <Route path="/register" element={<AuthPage mode="register" />} />
      <Route path="/*"        element={<App />} />   {/* כל כתובת אחרת → הצ'אט */}
    </Routes>
  </BrowserRouter>
);

