// main.jsx: starts the app. The fonts are bundled with the site (not loaded from Google), so no visitor data
// goes to a third party just to show text (a GDPR point for a site in Germany).
// League Spartan: the geometric display face (Bauhaus posters), DM Sans for text, DM Mono for labels.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource-variable/league-spartan";
import "@fontsource-variable/dm-sans";
import "@fontsource/dm-mono/400.css";
import "@fontsource/dm-mono/500.css";
import "./styles/global.css";
import App from "./App";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
