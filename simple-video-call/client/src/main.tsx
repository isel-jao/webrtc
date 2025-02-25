import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@/global.css";
import Router from "@/pages/router";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Router />
  </StrictMode>,
);
