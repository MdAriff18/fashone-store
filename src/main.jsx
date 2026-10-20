import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";

import App from "./App.jsx";
import Admin from "./Admin.jsx";
import TrackOrder from "./TrackOrder.jsx";
import PolicyPage from "./PolicyPage.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/track-order" element={<TrackOrder />} />

        <Route path="/about" element={<PolicyPage path="/about" />} />
        <Route path="/contact" element={<PolicyPage path="/contact" />} />
        <Route
          path="/shipping-policy"
          element={<PolicyPage path="/shipping-policy" />}
        />
        <Route
          path="/return-policy"
          element={<PolicyPage path="/return-policy" />}
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);