import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./brand.css";
import "./ui-fixes.css";
import "./premium-home.css";
import "./home-premium-v3.css";
import App from "./App.tsx";
import { installProductShareHandler } from "./utils/installProductShare";

installProductShareHandler();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
