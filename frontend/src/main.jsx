import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* ✅ This enables useNavigate, useLocation, useRoutes, etc. */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
