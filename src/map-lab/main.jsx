import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { installTypographer } from "../typograph.js";
import MapLabApp from "./MapLabApp.jsx";
import "./styles.css";

const rootElement = document.getElementById("map-lab-root");
installTypographer(rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <MapLabApp />
  </StrictMode>,
);
