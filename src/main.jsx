import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { installTypographer } from "./typograph.js";
import "./styles.css";
import "./refinements.css";
import "./pages.css";

const rootElement = document.getElementById("root");
installTypographer(rootElement);

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
