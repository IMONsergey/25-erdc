import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./portal/PortalApp.jsx";
import "./styles.css";
import "./refinements.css";
import "./pages.css";
import "./portal/portal.css";

const rootElement = document.getElementById("root");

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

import "./pages/territories.css";

import "./portal/interactions.css";

import "./layout.css";

import "./portal/experience.css";
import "./pages/simplified-city.css";
import "./portal/catalog-dialog.css";
