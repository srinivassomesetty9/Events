import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { GlobalStateProvider } from "./components/GlobalStateContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <React.StrictMode>
    <GlobalStateProvider>
    <App />
    </GlobalStateProvider>
    </React.StrictMode>
  </BrowserRouter>
);
